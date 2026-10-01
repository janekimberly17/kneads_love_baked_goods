// Little hand-drawn doodles scattered around, like on the menu poster.
export default function Sparkle({ className = '', variant = 'asterisk' }) {
  if (variant === 'flower') {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <g fill="currentColor">
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="20" cy="9" rx="6" ry="9" transform={`rotate(${r} 20 20)`} />
          ))}
        </g>
        <circle cx="20" cy="20" r="4" fill="#fbf8f1" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <path d="M20 4v32M4 20h32M8.7 8.7l22.6 22.6M31.3 8.7 8.7 31.3" />
      </g>
    </svg>
  )
}
