import { useState } from 'react'
import { Ear, EarOff } from 'lucide-react'

const BAR_COUNT = 56

/** Amplitude a trimmed trigger is pulled back to. */
const TRIMMED = 0.3
/** The dashed envelope drawn across the console. */
const CEILING = 0.6

/**
 * Deterministic room-tone baseline. Generated from a fixed formula rather than
 * Math.random so the server and client render identical markup.
 */
const ROOM_TONE = Array.from({ length: BAR_COUNT }, (_, i) => {
  const noise = Math.sin((i + 1) * 12.9898) * 43758.5453
  return 0.14 + (noise - Math.floor(noise)) * 0.2
})

type Trigger = {
  id: string
  label: string
  /** Bar positions this sound occupies, and how far it peaks. */
  bars: number[]
  peak: number
}

const TRIGGERS: Trigger[] = [
  { id: 'chewing', label: 'Chewing', bars: [6, 7, 19, 20, 32, 33, 45, 46], peak: 0.94 },
  { id: 'keyboard', label: 'Keyboard tapping', bars: [3, 12, 22, 29, 38, 49, 53], peak: 0.82 },
  { id: 'sniffling', label: 'Sniffling', bars: [14, 15, 16, 40, 41, 42], peak: 0.88 },
  { id: 'pen', label: 'Pen clicking', bars: [9, 26, 35, 51], peak: 1 },
  { id: 'slurping', label: 'Slurping', bars: [1, 2, 24, 25, 43, 44], peak: 0.91 },
]

export function SoundConsole() {
  const [active, setActive] = useState<string[]>(['chewing'])
  const [filtering, setFiltering] = useState(true)

  const activeTriggers = TRIGGERS.filter((trigger) => active.includes(trigger.id))

  // Highest peak landing on each bar position.
  const peaks = new Map<number, number>()
  for (const trigger of activeTriggers) {
    for (const bar of trigger.bars) {
      peaks.set(bar, Math.max(peaks.get(bar) ?? 0, trigger.peak))
    }
  }

  const loudest = activeTriggers.reduce((max, t) => Math.max(max, t.peak), 0)
  const rawPeak = Math.round(54 + loudest * 27)
  const trimmedPeak = Math.round(37 + loudest * 7)

  function toggleTrigger(id: string) {
    setActive((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-ink-2/80 backdrop-blur-sm">
      {/* console header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/70 px-6 py-4">
        <p className="font-mono text-[0.7rem] tracking-[0.22em] text-muted uppercase">
          Trigger console
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={filtering}
          onClick={() => setFiltering((value) => !value)}
          className="group inline-flex items-center gap-3 rounded-full border border-line bg-surface/70 py-1.5 pr-4 pl-1.5 text-sm transition-colors duration-300 hover:border-mint/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
        >
          <span
            className={`grid size-7 place-items-center rounded-full transition-colors duration-300 ${
              filtering ? 'bg-mint text-ink' : 'bg-surface-2 text-muted'
            }`}
          >
            {filtering ? (
              <Ear className="size-4" aria-hidden="true" />
            ) : (
              <EarOff className="size-4" aria-hidden="true" />
            )}
          </span>
          <span className={filtering ? 'text-bone' : 'text-muted'}>
            Filter {filtering ? 'on' : 'off'}
          </span>
        </button>
      </div>

      {/* waveform */}
      <div className="px-6 pt-7 pb-6">
        <p className="mb-2 text-right font-mono text-[0.65rem] tracking-[0.18em] text-muted/70 uppercase">
          Comfort ceiling
        </p>

        <div className="relative flex h-44 items-center gap-[3px] sm:gap-[5px]">
          {/* Envelope the trimmed sound is kept underneath. Bars scale from
              their centre, so amplitude A reaches (1 - A) / 2 from each edge. */}
          <div
            className="pointer-events-none absolute inset-x-0 border-y border-dashed border-line"
            style={{
              top: `${((1 - CEILING) / 2) * 100}%`,
              bottom: `${((1 - CEILING) / 2) * 100}%`,
            }}
            aria-hidden="true"
          />
          {ROOM_TONE.map((base, index) => {
            const peak = peaks.get(index)
            const amplitude = peak
              ? filtering
                ? Math.max(base, TRIMMED)
                : peak
              : base

            return (
              <span
                key={index}
                className={`bar flex-1 rounded-full ${peak ? '' : 'bar-idle'} ${
                  peak
                    ? filtering
                      ? 'bg-mint'
                      : 'bg-clay'
                    : 'bg-muted/35'
                }`}
                style={
                  {
                    '--amp': amplitude,
                    height: '100%',
                    animationDelay: `${(index % 11) * 160}ms`,
                    transitionDelay: `${(index % 9) * 18}ms`,
                  } as React.CSSProperties
                }
              />
            )
          })}
        </div>

        {/* readout */}
        <div className="mt-5 flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-wide">
          {activeTriggers.length === 0 ? (
            <span className="text-muted">Room tone only — nothing to trim.</span>
          ) : filtering ? (
            <>
              <span className="text-mint">Peak trimmed to ~{trimmedPeak} dB</span>
              <span className="text-muted/40">/</span>
              <span className="text-muted">
                speech and music pass through untouched
              </span>
            </>
          ) : (
            <>
              <span className="text-clay">Peak ~{rawPeak} dB, over the ceiling</span>
              <span className="text-muted/40">/</span>
              <span className="text-muted">this is the part you cannot ignore</span>
            </>
          )}
        </div>
      </div>

      {/* trigger chips */}
      <div className="border-t border-line/70 px-6 py-5">
        <p className="mb-3 text-sm text-muted">
          Pick what gets to you. Most people have more than one.
        </p>
        <div className="flex flex-wrap gap-2">
          {TRIGGERS.map((trigger) => {
            const on = active.includes(trigger.id)
            return (
              <button
                key={trigger.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleTrigger(trigger.id)}
                className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint ${
                  on
                    ? 'border-bone/80 bg-bone text-ink'
                    : 'border-line bg-transparent text-muted hover:border-bone/40 hover:text-bone'
                }`}
              >
                {trigger.label}
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted/70">
          An illustration of the behaviour we are designing for — not measured
          performance from a finished product.
        </p>
      </div>
    </div>
  )
}
