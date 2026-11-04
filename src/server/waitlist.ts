import { createServerFn } from '@tanstack/react-start'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { waitlistSignups } from '../../db/schema.js'

const emailSchema = z.email().max(254)

export type JoinResult =
  | { status: 'joined' }
  | { status: 'already' }
  | { status: 'invalid' }
  | { status: 'error' }

export type CheckResult =
  | { status: 'new' }
  | { status: 'already' }
  | { status: 'invalid' }
  | { status: 'error' }

const emailInput = (data: { email: string }) => ({
  email: typeof data?.email === 'string' ? data.email : '',
})

/**
 * Reports whether an email is already on the waitlist, without writing.
 * The form uses this to decide whether to forward a signup to Netlify Forms
 * before saving it, so a failed Forms request can be retried cleanly.
 */
export const checkWaitlist = createServerFn({ method: 'POST' })
  .inputValidator(emailInput)
  .handler(async ({ data }): Promise<CheckResult> => {
    const email = data.email.trim().toLowerCase()

    if (!emailSchema.safeParse(email).success) {
      return { status: 'invalid' }
    }

    try {
      const existing = await db
        .select({ id: waitlistSignups.id })
        .from(waitlistSignups)
        .where(eq(waitlistSignups.email, email))
        .limit(1)
      return existing.length > 0 ? { status: 'already' } : { status: 'new' }
    } catch (error) {
      console.error('waitlist check failed', error)
      return { status: 'error' }
    }
  })

/**
 * Adds an email to the waitlist. Returns a result object rather than throwing
 * so the form can render every outcome inline.
 */
export const joinWaitlist = createServerFn({ method: 'POST' })
  .inputValidator(emailInput)
  .handler(async ({ data }): Promise<JoinResult> => {
    const email = data.email.trim().toLowerCase()

    if (!emailSchema.safeParse(email).success) {
      return { status: 'invalid' }
    }

    try {
      const inserted = await db
        .insert(waitlistSignups)
        .values({ email })
        .onConflictDoNothing({ target: waitlistSignups.email })
        .returning({ id: waitlistSignups.id })

      return inserted.length > 0 ? { status: 'joined' } : { status: 'already' }
    } catch (error) {
      console.error('waitlist signup failed', error)
      return { status: 'error' }
    }
  })

/**
 * How many people are on the list. Returns null when the count is unavailable
 * so the page can fall back to copy that does not quote a number.
 */
export const getWaitlistCount = createServerFn({ method: 'GET' }).handler(
  async (): Promise<number | null> => {
    try {
      const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(waitlistSignups)
      return row?.count ?? 0
    } catch (error) {
      console.error('waitlist count failed', error)
      return null
    }
  },
)
