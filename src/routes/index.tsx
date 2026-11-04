import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Faq } from '@/components/Faq'
import { SoundConsole } from '@/components/SoundConsole'
import { TriggerMarquee } from '@/components/TriggerMarquee'
import { WaitlistForm } from '@/components/WaitlistForm'
import { Wordmark } from '@/components/Wordmark'
import { getWaitlistCount } from '@/server/waitlist'

export const Route = createFileRoute('/')({
  loader: () => getWaitlistCount(),
  component: Home,
})

const IMG = '/.netlify/images?url='

const PROTOTYPE_URL = 'https://calmears-demo.netlify.app'

const STEPS = [
  {
  n: '01',
  title: 'It knows a trigger when it hears one',
  body: 'Chewing, clicking and tapping sound different from everything else around you. CalmEars is built to pick those sounds out as they happen.',
},
{
  n: '02',
  title: 'It quiets the trigger and leaves the rest',
  body: 'When a trigger sound happens, it gets turned down right away. Voices, music and everything else around you stay the same.',
},
{
  n: '03',
  title: 'You choose what gets quieted',
  body: 'Everyone\u2019s triggers are different. Pick the sounds that bother you and how much each one is turned down, you set.',
},
]

const STAGES = [
  {
    when: 'Now',
    title: 'Prototype in the ear',
    body: 'Off-the-shelf drivers and our own filter running on a development board. It behaves on the bench. It is not a product yet, and we are not pretending otherwise.',
  },
  {
    when: 'Next',
    title: 'Closed listening trial',
    body: 'A small group of people with misophonia test it against their own trigger lists, in their own kitchens, offices and open-plan hells.',
  },
  {
    when: 'Then',
    title: 'A first, small run',
    body: 'Manufactured in a deliberately limited batch and offered to this waitlist before it goes anywhere else.',
  },
]

function Home() {
  const initialCount = Route.useLoaderData()
  const [count, setCount] = useState<number | null>(initialCount)

  const bumpCount = () => setCount((value) => (value === null ? value : value + 1))

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* ---------------------------------------------------------------- nav */}
      <header className="sticky top-0 z-50 border-b border-line/40 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4">
          <a
            href="#top"
            className="text-bone transition-colors duration-300 hover:text-mint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint"
          >
            <Wordmark className="text-base" />
          </a>
          <nav className="flex items-center gap-1 text-sm sm:gap-2">
            <a
              href="#how"
              className="hidden rounded-full px-3 py-2 text-muted transition-colors duration-300 hover:text-bone sm:block"
            >
              How it works
            </a>
            <a
              href="#questions"
              className="hidden rounded-full px-3 py-2 text-muted transition-colors duration-300 hover:text-bone sm:block"
            >
              Questions
            </a>
            <a
              href={PROTOTYPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-3 py-2 text-muted transition-colors duration-300 hover:text-bone"
            >
              Try the prototype
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href="#waitlist"
              className="rounded-full border border-line bg-surface/60 px-4 py-2 text-bone transition-colors duration-300 hover:border-mint/60 hover:text-mint"
            >
              Join the waitlist
            </a>
          </nav>
        </div>
      </header>

      {/* -------------------------------------------------------------- hero */}
      <section id="top" className="relative">
        <div
          className="halo top-[-10rem] right-[-6rem] size-[34rem] bg-mint/[0.09]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 px-6 pt-14 pb-16 lg:grid-cols-12 lg:gap-6 lg:pt-20 lg:pb-24">
          <div className="lg:col-span-6 lg:pr-8">
            <p
              className="rise flex items-center gap-2.5 font-mono text-[0.7rem] tracking-[0.2em] text-mint uppercase"
              style={{ animationDelay: '60ms' }}
            >
              <span className="pulse-dot size-1.5 rounded-full bg-mint" />
              In development — waitlist open
            </p>

            <h1
              className="rise font-display mt-6 text-[2.7rem] leading-[1.02] tracking-[-0.02em] text-balance sm:text-6xl lg:text-[4.1rem]"
              style={{ animationDelay: '140ms' }}
            >
              Earbuds for the sounds
              <span className="text-mint italic"> nobody else </span>
              seems to notice.
            </h1>

            <p
              className="rise mt-7 max-w-[52ch] text-lg leading-relaxed text-muted"
              style={{ animationDelay: '220ms' }}
            >
              CalmEars is a pair of earbuds being built for misophonia — designed to
              pull down chewing, typing and other everyday sounds without sealing you
              off from the conversation. It is not finished. This is where you get told when
              it is.
            </p>

            <div className="rise mt-9" style={{ animationDelay: '300ms' }}>
              <WaitlistForm size="lg" onJoined={bumpCount} />
              <CountLine count={count} />
              <div className="mt-7">
                <a
                  href={PROTOTYPE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl border border-line px-6 py-3 text-[0.95rem] text-bone transition-colors duration-300 hover:border-mint/60 hover:text-mint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
                >
                  Try the live prototype
                  <span
                    className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    →
                  </span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <p className="mt-2.5 px-1 text-sm text-muted/80">
                  Runs on your phone. Bring earphones.
                </p>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="drift relative">
              <img
                src={`${IMG}/img/calmears-logo.png&w=900&fm=webp`}
                srcSet={`${IMG}/img/calmears-logo.png&w=900&fm=webp 900w, ${IMG}/img/calmears-logo.png&w=1200&fm=webp 1200w`}
                sizes="(min-width: 1024px) 48vw, 92vw"
                width={1200}
                height={1200}
                alt="CalmEars logo: a white line drawing of an ear with a calm, smiling face inside it, above the CalmEars name, on a soft blue background"
                className="w-full lg:scale-[1.22] lg:origin-left"
                style={{
                  maskImage:
                    'radial-gradient(62% 62% at 52% 50%, #000 58%, transparent 100%)',
                  WebkitMaskImage:
                    'radial-gradient(62% 62% at 52% 50%, #000 58%, transparent 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <TriggerMarquee />

      {/* ----------------------------------------------------------- console */}
      <section id="how" className="mx-auto max-w-[1180px] px-6 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="font-mono text-[0.7rem] tracking-[0.2em] text-mint uppercase">
              The idea
            </p>
            <h2 className="font-display mt-5 text-4xl leading-[1.08] tracking-[-0.015em] sm:text-5xl">
              Not noise cancelling.
              <span className="block text-muted italic">Sound triage.</span>
            </h2>
            <p className="mt-6 max-w-[46ch] leading-relaxed text-muted">
              Cancelling was built for aeroplane drone — a steady, predictable hum it
              can subtract. The sounds that undo you are the opposite: sudden,
              irregular, mid-range, and often two feet away at the dinner table.
            </p>
            <p className="mt-4 max-w-[46ch] leading-relaxed text-muted">
              So CalmEars is being built the other way around. Leave the room alone.
              Go after the handful of sounds that cross your line.
            </p>
            <p className="mt-6 text-sm text-bone/70">
              Try it — switch the filter off and watch what your brain has been doing
              all day.
            </p>
          </div>
          <div className="lg:col-span-7">
            <SoundConsole />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- steps */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 lg:pb-28">
        <div className="hairline h-px w-full" />
        <div className="mt-16 flex flex-col gap-14">
          {STEPS.map((step, index) => (
            <div
              key={step.n}
              className="grid gap-4 sm:grid-cols-[5rem_1fr] sm:gap-8"
              style={{ marginLeft: `${index * 3.5}%` }}
            >
              <p className="font-display text-4xl text-mint/70">{step.n}</p>
              <div className="max-w-[58ch]">
                <h3 className="font-display text-3xl leading-tight sm:text-[2.1rem]">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ stages */}
      <section id="stage" className="border-t border-line/60 bg-ink-2/60">
        <div className="mx-auto grid max-w-[1180px] gap-14 px-6 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-5">
            <p className="font-mono text-[0.7rem] tracking-[0.2em] text-mint uppercase">
              Where this actually is
            </p>
            <h2 className="font-display mt-5 text-4xl leading-[1.08] tracking-[-0.015em] sm:text-5xl">
              Honest about the stage we are at.
            </h2>
            <p className="mt-6 max-w-[44ch] leading-relaxed text-muted">
              You have probably been sold a fix for this before. We are not going to
              do that. Here is the whole picture, and the waitlist is how you find
              out when each part lands.
            </p>
            <img
              src={`${IMG}/img/earbuds-case.png&w=760&fm=webp`}
              srcSet={`${IMG}/img/earbuds-case.png&w=760&fm=webp 760w, ${IMG}/img/earbuds-case.png&w=1160&fm=webp 1160w`}
              sizes="(min-width: 1024px) 38vw, 92vw"
              width={1160}
              height={633}
              alt="A slate teal CalmEars charging case, open, with a single mint indicator light"
              className="mt-10 w-full rounded-2xl border border-line/60"
              loading="lazy"
            />
          </div>

          <ol className="lg:col-span-7 lg:pt-2">
            {STAGES.map((stage, index) => (
              <li
                key={stage.when}
                className="relative border-l border-line pb-11 pl-8 last:pb-0"
              >
                <span
                  className={`absolute -left-[5px] top-1.5 size-2.5 rounded-full ${
                    index === 0 ? 'bg-mint' : 'bg-line'
                  }`}
                  aria-hidden="true"
                />
                <p className="font-mono text-[0.7rem] tracking-[0.2em] text-muted uppercase">
                  {stage.when}
                </p>
                <h3 className="font-display mt-2 text-3xl leading-tight">
                  {stage.title}
                </h3>
                <p className="mt-3 max-w-[54ch] leading-relaxed text-muted">
                  {stage.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------- questions */}
      <section id="questions" className="mx-auto max-w-[1180px] px-6 py-20 lg:py-28">
        <h2 className="font-display mb-12 max-w-[20ch] text-4xl leading-[1.08] tracking-[-0.015em] sm:text-5xl">
          Questions people keep asking.
        </h2>
        <Faq />
      </section>

      {/* ----------------------------------------------------------- waitlist */}
      <section id="waitlist" className="relative overflow-hidden px-6 pb-24 lg:pb-32">
        <div
          className="halo bottom-[-14rem] left-1/2 size-[36rem] -translate-x-1/2 bg-mint/[0.1]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[760px] rounded-3xl border border-line bg-surface/40 px-6 py-14 text-center backdrop-blur-sm sm:px-14">
          <h2 className="font-display text-4xl leading-[1.05] tracking-[-0.015em] text-balance sm:text-[3.4rem]">
            Be in the room when these are real.
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] leading-relaxed text-muted">
            One email, sent when there is something to put in your ears. No
            newsletter, no countdown timers, no drip campaign.
          </p>
          <div className="mx-auto mt-9 max-w-[30rem] text-left">
            <WaitlistForm size="lg" onJoined={bumpCount} />
            <CountLine count={count} centered />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ footer */}
      <footer className="border-t border-line/60">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Wordmark className="text-base text-bone" />
            <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-muted">
              Built by people who have been told it is only chewing.
            </p>
          </div>
          <p className="text-sm text-muted/70">
            © {new Date().getFullYear()} CalmEars. Nothing here is a medical device
            or a medical claim.
          </p>
        </div>
      </footer>
    </main>
  )
}

/**
 * Only quotes a number once there is a real one worth quoting — a waitlist that
 * announces "3 people" undersells itself, and a fake number is worse.
 */
function CountLine({
  count,
  centered = false,
}: {
  count: number | null
  centered?: boolean
}) {
  const text =
    count !== null && count >= 25
      ? `${count.toLocaleString()} people are waiting for these.`
      : 'You will be one of the first — the list has only just opened.'

  return (
    <p
      className={`px-1 text-sm text-muted/80 ${centered ? 'text-center' : ''}`}
      aria-live="polite"
    >
      {text}
      <span className="text-muted/50"> No spam, ever.</span>
    </p>
  )
}
