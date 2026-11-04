# CalmEars

Pre-launch waitlist site for **CalmEars** — earbuds being designed for people with
misophonia, built to trim trigger sounds (chewing, tapping, sniffling) without
sealing the wearer off from the room.

The product does not exist yet. The job of this site is to explain the idea
honestly and collect email addresses for launch day.

## What the site does

- A single landing page that explains the idea, the stage the hardware is at, and
  answers the questions people actually ask about misophonia products.
- An **interactive trigger console**: visitors pick their own trigger sounds and
  toggle the filter on and off to see what the earbuds are meant to do.
- A **waitlist form** (email only) that writes to a Netlify Database table, with
  duplicate addresses handled silently and every outcome reported inline.
- A live signup count, which only appears once the list passes 25 people so the
  page never advertises a small number or a fake one.

## Tech

| Layer | Choice |
|---|---|
| Framework | TanStack Start (React 19, file-based routing) |
| Build | Vite 7 |
| Styling | Tailwind CSS 4, tokens defined in `src/styles.css` |
| Data | Netlify Database (managed Postgres) via Drizzle ORM |
| Server logic | TanStack Start server functions |
| Images | Generated with Gemini via Netlify AI Gateway, served through Netlify Image CDN |
| Hosting | Netlify |

## Running locally

```bash
npm install
netlify dev --port 8889
```

`netlify dev` is the one to use — it emulates the database and the Image CDN, so
the form and the product photography both work. `npm run dev` alone will start
Vite but the waitlist writes will fail.

## Reading the waitlist

Signups land in the `waitlist_signups` table. To read them:

```bash
netlify db connect --query "select email, created_at from waitlist_signups order by created_at desc"
```

## Changing the schema

Edit `db/schema.ts`, then generate a migration — never hand-edit applied SQL:

```bash
npx drizzle-kit generate --name <describe_the_change>
```

Netlify applies migrations from `netlify/database/migrations/` automatically on
deploy.

## Regenerating the product imagery

`public/img/*.png` are concept renders produced through Netlify AI Gateway. The
art direction lives in `scripts/generate-images.mjs`:

```bash
npm run generate:images
```

## Copy worth reviewing before launch

The page deliberately avoids promising a ship date. Two places state the current
stage and should be updated as the hardware moves:

- the three stages in `STAGES` (`src/routes/index.tsx`)
- the "When can I actually buy them?" answer in `src/components/Faq.tsx`
