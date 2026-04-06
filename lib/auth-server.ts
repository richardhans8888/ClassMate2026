import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/lib/prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    // Better Auth sets sameSite: 'lax' and validates CSRF on mutating requests by default.
    // No additional CSRF plugin is required.
  },
})
