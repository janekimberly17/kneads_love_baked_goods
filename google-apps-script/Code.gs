/**
 * Kneads Love order receiver: Google Apps Script Web App.
 *
 * Setup:
 * 1. Create a Google Sheet (e.g. "Kneads Love Orders"). Keep it private: don't share its link.
 * 2. Extensions → Apps Script, paste this file, save.
 * 3. Deploy → New deployment → type "Web app"
 *      Execute as: Me
 *      Who has access: Anyone   (needed so the website can send orders; it can only add rows,
 *                                there is no doGet, so nobody can read the sheet through this URL)
 * 4. Copy the Web app URL (ends in /exec) into .env as VITE_GOOGLE_SCRIPT_URL,
 *    then rebuild/redeploy the site.
 * After editing this script, deploy a new version (Manage deployments → Edit → New version).
 *
 * The URL ends up in the public website code, so anyone could post to it directly.
 * Everything below is therefore checked again here instead of trusting the browser:
 * prices and totals are recalculated from the tables below, text is length-limited and
 * made safe for Sheets, and obvious spam is rejected or rate-limited.
 */

// Keep these in sync with src/data/menu.js and src/data/fulfilment.js.
const PRICES = {
  'brownie:small': { product: 'Brownie', size: 'Small (6 × 6")', price: 30 },
  'brownie:big': { product: 'Brownie', size: 'Big (9 × 9")', price: 56 },
  'blondie:small': { product: 'Blondie', size: 'Small (6 × 6")', price: 30 },
  'blondie:big': { product: 'Blondie', size: 'Big (9 × 9")', price: 56 },
};
const DELIVERY_FEES = { nearby: 3, mid: 5, far: 7 };
const DAYS = ['Saturday', 'Sunday'];
const MAX_TRAYS_PER_ITEM = 20;
const MAX_ORDERS_PER_NUMBER_PER_HOUR = 3;
const MAX_ORDERS_PER_HOUR = 60;

const SHEET_NAME = 'Orders';
const HEADERS = [
  'Submitted at', 'Order ID', 'Name', 'WhatsApp', 'Method', 'Day', 'Delivery area', 'Address',
  'Items', 'Subtotal (RM)', 'Delivery fee (RM)', 'Total (RM)', 'Notes', 'Status',
];

function doPost(e) {
  let order;
  try {
    order = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ result: 'error', message: 'Invalid request.' });
  }

  // Honeypot filled in: a bot. Pretend it worked so it doesn't retry.
  if (order.website) return json_({ result: 'success' });

  const clean = validate_(order);
  if (clean.error) return json_({ result: 'error', message: clean.error });

  const limited = rateLimit_(clean.whatsapp);
  if (limited) return json_({ result: 'error', message: limited });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet_().appendRow([
      new Date(),
      safe_(clean.orderId),
      safe_(clean.name),
      "'" + clean.whatsapp, // keep the leading 0 / + as text
      clean.method,
      clean.day,
      safe_(clean.zone),
      safe_(clean.address),
      safe_(clean.itemsText),
      clean.subtotal,
      clean.deliveryFee,
      clean.total,
      safe_(clean.notes),
      'New',
    ]);
  } finally {
    lock.releaseLock();
  }
  return json_({ result: 'success', orderId: clean.orderId, total: clean.total });
}

function validate_(o) {
  const customer = o.customer || {};
  const fulfilment = o.fulfilment || {};
  const name = text_(customer.name, 80);
  const whatsapp = String(customer.whatsapp || '').replace(/[\s-]/g, '');
  if (!name) return { error: 'Please enter your name.' };
  if (!/^(\+?60|0)1\d{8,9}$/.test(whatsapp)) return { error: 'Please enter a valid Malaysian mobile number.' };

  const method = fulfilment.method === 'delivery' ? 'delivery' : 'pickup';
  const day = DAYS.indexOf(fulfilment.day) >= 0 ? fulfilment.day : '';
  if (!day) return { error: 'Please choose Saturday or Sunday.' };

  let deliveryFee = 0;
  let zone = '';
  let address = '';
  if (method === 'delivery') {
    if (!(fulfilment.zoneId in DELIVERY_FEES)) return { error: 'Please choose a delivery area.' };
    deliveryFee = DELIVERY_FEES[fulfilment.zoneId];
    zone = text_(fulfilment.zone, 100);
    address = text_(fulfilment.address, 300);
    if (!address) return { error: 'Please enter a delivery address.' };
  }

  // Recalculate every line from our own price list; ignore prices sent by the browser.
  const lines = [];
  let subtotal = 0;
  (Array.isArray(o.items) ? o.items : []).forEach(function (item) {
    const menuItem = PRICES[item && item.id];
    const qty = Math.floor(Number(item && item.quantity));
    if (!menuItem || !(qty >= 1 && qty <= MAX_TRAYS_PER_ITEM)) return;
    subtotal += qty * menuItem.price;
    lines.push(qty + ' × ' + menuItem.product + ' ' + menuItem.size);
  });
  if (lines.length === 0) return { error: 'Your order is empty.' };

  return {
    orderId: text_(o.orderId, 40) || 'KL-' + Date.now(),
    name: name,
    whatsapp: whatsapp,
    method: method,
    day: day,
    zone: zone,
    address: address,
    itemsText: lines.join('\n'),
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    total: subtotal + deliveryFee,
    notes: text_(o.notes, 500),
  };
}

// Simple limits so one person or script can't flood the sheet.
function rateLimit_(whatsapp) {
  const cache = CacheService.getScriptCache();
  const hour = Math.floor(Date.now() / 3600000);
  const keys = ['all:' + hour, 'wa:' + whatsapp + ':' + hour];
  const counts = keys.map(function (k) { return Number(cache.get(k) || 0); });
  if (counts[0] >= MAX_ORDERS_PER_HOUR || counts[1] >= MAX_ORDERS_PER_NUMBER_PER_HOUR) {
    return 'We’ve received a lot of orders just now. Please message us on WhatsApp instead.';
  }
  keys.forEach(function (k, i) { cache.put(k, String(counts[i] + 1), 3600); });
  return '';
}

function text_(value, maxLength) {
  return String(value == null ? '' : value).trim().slice(0, maxLength);
}

// Stop text like "=IMPORTXML(...)" from running as a formula in the sheet.
function safe_(value) {
  const s = String(value == null ? '' : value);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
