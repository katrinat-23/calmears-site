import { Plus } from 'lucide-react'

const QUESTIONS = [
  {
    q: 'What is misophonia, exactly?',
    a: 'A strong, involuntary reaction — anger, dread, the need to leave the room — to specific repeating sounds. Usually mouth and nose sounds, and often from the people closest to you. It is not fussiness, and being told to ignore it has never once worked.',
  },
  {
    q: 'How is this different from noise-cancelling earbuds?',
    a: 'Active noise cancelling is tuned for steady low drone: plane cabins, traffic, air conditioning. Misophonia triggers are the opposite — short, sharp, mid-to-high transients like a crunch, a click, a sniff. Those slip straight through most cancelling. CalmEars is being built to catch the transients instead.',
  },
  {
    q: 'Will I still be able to hear the conversation?',
    a: 'That is the whole point. Earplugs and loud music work by removing everything, which is why they cost you the dinner or the meeting. We are aiming to pull the trigger down and leave voices roughly where they are.',
  },
  {
    q: 'Can I choose which sounds get filtered?',
    a: 'That is the plan. Trigger lists are personal — one person cannot sit near cutlery, another cannot sit near a keyboard. The console higher up this page is that idea in miniature.',
  },
  {
    q: 'When can I actually buy them?',
    a: 'There is no date yet, and we would rather tell you that than invent a quarter. The hardware is at prototype stage. Everyone on this list hears the moment that changes.',
  },
  {
    q: 'What happens to my email address?',
    a: 'It sits in one database and receives one message: the launch. No newsletter, no sharing it with anyone else, and you can ask us to delete it whenever you like.',
  },
]

export function Faq() {
  return (
    <div className="divide-y divide-line/70 border-y border-line/70">
      {QUESTIONS.map(({ q, a }) => (
        <details key={q} className="group">
          <summary className="flex items-start justify-between gap-6 py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint">
            <h3 className="font-display text-2xl leading-snug text-bone transition-colors duration-300 group-hover:text-mint sm:text-[1.7rem]">
              {q}
            </h3>
            <span className="faq-sign mt-1.5 shrink-0 text-muted group-hover:text-mint">
              <Plus className="size-5" aria-hidden="true" />
            </span>
          </summary>
          <p className="max-w-[62ch] pr-10 pb-7 leading-relaxed text-muted">{a}</p>
        </details>
      ))}
    </div>
  )
}
