import { getUserId, unauthorized } from '@/lib/api-auth'
import { getMatches } from '@/lib/data'

export const runtime = 'nodejs'

/** Returns the user's stored matches and whether they are fresh (<24h). */
export async function GET() {
  try {
    const userId = await getUserId()
    if (!userId) return unauthorized()

    const matches = await getMatches(userId)
    const newest = matches.reduce<number>((acc, m) => {
      const t = new Date(m.createdAt).getTime()
      return Number.isFinite(t) && t > acc ? t : acc
    }, 0)
    const fresh = newest > 0 && Date.now() - newest < 24 * 60 * 60 * 1000

    return Response.json({ matches, fresh })
  } catch (err) {
    console.log('[v0] GET matches error:', (err as Error).message)
    return Response.json({ error: 'Failed to load matches.' }, { status: 500 })
  }
}
