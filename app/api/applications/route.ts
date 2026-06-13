import { getUserId, unauthorized } from '@/lib/api-auth'
import { getApplications } from '@/lib/data'

export const runtime = 'nodejs'

/** Fetch all applications for the signed-in user. */
export async function GET() {
  try {
    const userId = await getUserId()
    if (!userId) return unauthorized()

    const applications = await getApplications(userId)
    return Response.json({ applications })
  } catch (err) {
    console.log('[v0] GET applications error:', (err as Error).message)
    return Response.json(
      { error: 'Failed to load applications.' },
      { status: 500 },
    )
  }
}
