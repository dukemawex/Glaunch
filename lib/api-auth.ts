import { auth, currentUser } from '@clerk/nextjs/server'

/**
 * Returns the authenticated Clerk userId, or null when unauthenticated.
 * In Next.js 16 / Clerk v7 `auth()` is async and must be awaited.
 */
export async function getUserId(): Promise<string | null> {
  const { userId } = await auth()
  return userId
}

/**
 * Returns userId + primary email for the signed-in user, or null.
 */
export async function getAuthedUser(): Promise<{
  userId: string
  email: string
  fullName: string
} | null> {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  return {
    userId,
    email: user?.emailAddresses?.[0]?.emailAddress ?? '',
    fullName: [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim(),
  }
}

export function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
