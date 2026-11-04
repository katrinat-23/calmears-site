import { useId, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { ArrowRight, Check, LoaderCircle } from 'lucide-react'
import { checkWaitlist, joinWaitlist } from '@/server/waitlist'

/** Light client-side check so an obvious typo never costs a round trip. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type FormState = 'idle' | 'sending' | 'joined' | 'already' | 'invalid' | 'error'

const MESSAGES: Record<Exclude<FormState, 'idle' | 'sending' | 'joined'>, string> = {
  already: "That address is already on the list — you're set.",
  invalid: 'That email address does not look quite right.',
  error: 'Something broke on our end. Try again in a moment.',
}

export function WaitlistForm({
  size = 'md',
  onJoined,
}: {
  size?: 'md' | 'lg'
  onJoined?: () => void
}) {
  const inputId = useId()
  const check = useServerFn(checkWaitlist)
  const join = useServerFn(joinWaitlist)
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')

  const sending = state === 'sending'
  const large = size === 'lg'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    const address = email.trim()
    if (!LOOKS_LIKE_EMAIL.test(address)) {
      setState('invalid')
      return
    }

    setState('sending')
    try {
      // 1. Skip everything if this address is already saved.
      const existing = await check({ data: { email: address } })
      if (existing.status !== 'new') {
        setState(existing.status)
        return
      }

      // 2. Forward to Netlify Forms. The "waitlist" form is registered from the
      //    static skeleton in public/__forms.html; SSR would swallow a POST to "/".
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'waitlist',
          'bot-field': '',
          email: address.toLowerCase(),
        }).toString(),
      })
      if (!response.ok) {
        setState('error')
        return
      }

      // 3. Save to the database, which powers the count and duplicate check.
      const result = await join({ data: { email: address } })
      setState(result.status)
      if (result.status === 'joined') onJoined?.()
    } catch {
      setState('error')
    }
  }

  if (state === 'joined') {
    return (
      <div
        className={`rise flex items-start gap-4 rounded-2xl border border-mint/30 bg-mint/[0.07] ${
          large ? 'p-6' : 'p-5'
        }`}
        role="status"
      >
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-mint text-ink">
          <Check className="size-4.5" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <div>
          <p className="font-display text-2xl leading-tight text-bone">
            You're on the list.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            We'll write to{' '}
            <span className="text-bone/90">{email.trim().toLowerCase()}</span> once —
            when there is something real to put in your ears.
          </p>
        </div>
      </div>
    )
  }

  const message = state === 'idle' || state === 'sending' ? null : MESSAGES[state]

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div
        className={`group flex flex-col gap-2 rounded-2xl border bg-surface/60 p-2 transition-colors duration-300 focus-within:border-mint/60 sm:flex-row sm:items-center ${
          state === 'invalid' ? 'border-clay/60' : 'border-line'
        }`}
      >
        <input
          id={inputId}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (state !== 'idle') setState('idle')
          }}
          disabled={sending}
          aria-invalid={state === 'invalid'}
          className={`min-w-0 flex-1 bg-transparent px-4 text-bone placeholder:text-muted/55 focus:outline-none disabled:opacity-60 ${
            large ? 'py-3.5 text-lg' : 'py-3 text-base'
          }`}
        />
        <button
          type="submit"
          disabled={sending}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-bone font-medium text-ink transition-all duration-300 hover:bg-mint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint disabled:opacity-70 ${
            large ? 'px-7 py-3.5 text-base' : 'px-6 py-3 text-[0.95rem]'
          }`}
        >
          {sending ? (
            <>
              <LoaderCircle className="spin size-4" aria-hidden="true" />
              Adding you
            </>
          ) : (
            <>
              Join the waitlist
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </div>
      <p
        aria-live="polite"
        className={`min-h-6 px-1 pt-2.5 text-sm ${
          state === 'already' ? 'text-mint' : 'text-clay'
        }`}
      >
        {message}
      </p>
    </form>
  )
}
