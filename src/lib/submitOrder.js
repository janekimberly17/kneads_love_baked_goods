// Google Apps Script Web App that appends each order to a Google Sheet.
// Set VITE_GOOGLE_SCRIPT_URL in .env (see .env.example and google-apps-script/Code.gs).
export const GOOGLE_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_SCRIPT_URL ||
  'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'

const isPlaceholderUrl = (url) => !url || url.includes('YOUR_SCRIPT_ID')

/**
 * POSTs an order to the Google Apps Script Web App.
 *
 * The body is sent as text/plain so the browser treats it as a "simple"
 * request and skips the CORS preflight, which Apps Script can't answer.
 * Apps Script still receives the JSON string in e.postData.contents.
 *
 * Resolves with the script's JSON response, or throws on failure.
 */
export async function submitOrder(order) {
  if (isPlaceholderUrl(GOOGLE_SCRIPT_URL)) {
    // Demo mode: no script configured yet, so pretend it worked.
    console.warn('[Kneads Love] VITE_GOOGLE_SCRIPT_URL is not set. Order not saved:', order)
    await new Promise((resolve) => setTimeout(resolve, 700))
    return { result: 'success', demo: true }
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(order),
  })

  if (!response.ok) {
    throw new Error(`Order request failed (${response.status})`)
  }

  const data = await response.json().catch(() => ({}))
  if (data.result && data.result !== 'success') {
    // The script rejected the order (e.g. invalid details); its message is safe to show.
    throw Object.assign(new Error(data.message || 'The order could not be saved.'), { fromServer: true })
  }
  return data
}
