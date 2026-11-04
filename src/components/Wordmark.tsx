export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 30 24"
        className="h-[0.92em] w-auto shrink-0 self-center"
        aria-hidden="true"
      >
        <g fill="currentColor">
          <rect x="0" y="10" width="2.6" height="4" rx="1.3" opacity="0.5" />
          <rect x="5.6" y="6.5" width="2.6" height="11" rx="1.3" opacity="0.75" />
          <rect x="11.2" y="1" width="2.6" height="22" rx="1.3" />
          <rect x="16.8" y="8" width="2.6" height="8" rx="1.3" opacity="0.75" />
          <rect x="22.4" y="10.5" width="2.6" height="3" rx="1.3" opacity="0.5" />
          <rect x="27.4" y="11.2" width="2.6" height="1.6" rx="0.8" opacity="0.3" />
        </g>
      </svg>
      <span className="font-display text-[1.35em] leading-none tracking-tight">
        CalmEars
      </span>
    </span>
  )
}
