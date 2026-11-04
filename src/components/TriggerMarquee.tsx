const TRIGGER_WORDS = [
  'chewing',
  'slurping',
  'pen clicking',
  'keyboard tapping',
  'sniffling',
  'gum snapping',
  'foot tapping',
  'heavy breathing',
  'cutlery on plates',
  'throat clearing',
  'crisp packets',
  'lip smacking',
]

export function TriggerMarquee() {
  return (
    <div
      className="relative flex overflow-hidden border-y border-line/60 py-5 select-none"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max shrink-0 items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {TRIGGER_WORDS.map((word) => (
              <span key={word} className="flex items-center">
                <span className="font-display px-7 text-2xl text-muted/60 italic">
                  {word}
                </span>
                <span className="size-1 rounded-full bg-mint/40" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-ink to-transparent" />
    </div>
  )
}
