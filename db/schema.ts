import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

/**
 * Everyone who has asked to hear from us when CalmEars is ready.
 * Email only, by design — the signup form asks for nothing else.
 */
export const waitlistSignups = pgTable('waitlist_signups', {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})
