/** Simple botanical line art — decorative punctuation, never covers a face. */
export function FloralAccent({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      className={`floral-accent ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      width="120"
      height="160"
      viewBox="0 0 120 160"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20 150 C 30 110, 25 70, 45 30"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M45 30 C 55 22, 65 24, 70 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="72" cy="10" rx="9" ry="5" transform="rotate(28 72 10)" fill="currentColor" opacity="0.55" />
      <path d="M32 78 C 20 74, 12 80, 6 72" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <ellipse cx="4" cy="70" rx="7" ry="4" transform="rotate(-18 4 70)" fill="currentColor" opacity="0.4" />
      <path d="M38 108 C 50 104, 56 110, 66 104" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <ellipse cx="68" cy="103" rx="7" ry="4" transform="rotate(20 68 103)" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
