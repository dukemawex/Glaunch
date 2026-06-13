import { putJob, getActiveJobs } from '@/lib/data'
import { SEED_JOBS } from '@/lib/seed-data'
import { getUserId } from '@/lib/api-auth'

export const runtime = 'nodejs'

/**
 * Idempotent jobs seeder. Authorised either by a signed-in user (so a logged-in
 * admin can bootstrap data) or by an x-seed-secret header matching SEED_SECRET.
 */
export async function POST(req: Request) {
  try {
    const secret = req.headers.get('x-seed-secret')
    const userId = await getUserId()
    const secretOk = !!process.env.SEED_SECRET && secret === process.env.SEED_SECRET

    if (!userId && !secretOk) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let seeded = 0
    for (const job of SEED_JOBS) {
      await putJob(job)
      seeded += 1
    }

    return Response.json({ seeded })
  } catch (err) {
    console.log('[v0] seed error:', (err as Error).message)
    return Response.json(
      { error: 'Failed to seed jobs. Check DynamoDB configuration.' },
      { status: 500 },
    )
  }
}

/** Returns how many active jobs currently exist. */
export async function GET() {
  try {
    const jobs = await getActiveJobs()
    return Response.json({ count: jobs.length })
  } catch (err) {
    console.log('[v0] seed status error:', (err as Error).message)
    return Response.json({ error: 'Failed to read jobs.' }, { status: 500 })
  }
}
