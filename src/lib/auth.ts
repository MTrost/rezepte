import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../db/schema'

export function createAuth(db: D1Database) {
  const drizzleDb = drizzle(db, { schema })

  return betterAuth({
    database: drizzleAdapter(drizzleDb, {
      provider: 'sqlite',
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    trustedOrigins: [
      'http://localhost:3000',
      'https://rezepte.pages.dev',
    ],
  })
}

export type Auth = ReturnType<typeof createAuth>
