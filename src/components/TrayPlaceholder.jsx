// Illustrated stand-in until real product photos are added (see data/menu.js).
export default function TrayPlaceholder({ colors, label }) {
  return (
    <svg viewBox="0 0 240 180" className="aspect-[4/3] w-full bg-paper" role="img" aria-label={`${label} photo coming soon`}>
      {/* parchment */}
      <path d="M22 40 L218 34 L226 150 L16 156 Z" fill="#ffffff" stroke="#e5ddd0" strokeWidth="2" />
      {/* slab */}
      <rect x="40" y="52" width="160" height="88" rx="8" fill={colors.body} />
      <path
        d="M40 64 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V60 a8 8 0 0 0 -8 -8 H48 a8 8 0 0 0 -8 8 Z"
        fill={colors.top}
      />
      {/* cut lines */}
      <g stroke={colors.crumb} strokeWidth="2" opacity="0.6">
        <path d="M93 54 V138 M147 54 V138 M42 96 H198" />
      </g>
      {/* crackle */}
      <g fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5">
        <path d="M58 76 l10 6 l8 -4 M110 80 l8 8 l10 -6 M160 74 l12 6 M64 118 l12 -4 l6 6 M120 116 l10 6 l8 -6 M170 114 l10 4" />
      </g>
      <text x="120" y="172" textAnchor="middle" className="font-hand" fontSize="13" fill="#4a3222" opacity="0.6">
        photo coming soon
      </text>
    </svg>
  )
}
