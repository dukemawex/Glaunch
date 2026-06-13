import { getAuthedUser, unauthorized } from '@/lib/api-auth'
import { getUser, putJob, getRecruiterJobs } from '@/lib/data'
import type { JobRecord } from '@/lib/types'

export const runtime = 'nodejs'

async function requireRecruiter() {
  const authed = await getAuthedUser()
  if (!authed) return { error: unauthorized() as Response }
  const user = await getUser(authed.userId)
  if (user?.plan !== 'recruiter') {
    return {
      error: Response.json(
        { error: 'Recruiter plan required.' },
        { status: 403 },
      ) as Response,
    }
  }
  return { authed, user }
}

export async function GET() {
  const ctx = await requireRecruiter()
  if ('error' in ctx) return ctx.error
  const jobs = await getRecruiterJobs(ctx.authed.userId)
  return Response.json({ jobs })
}

export async function POST(req: Request) {
  const ctx = await requireRecruiter()
  if ('error' in ctx) return ctx.error

  try {
    const body = (await req.json()) as Partial<{
      title: string
      company: string
      location: string
      url: string
      description: string
      tags: string
      sector: string
    }>

    const title = body.title?.trim()
    const company = body.company?.trim()
    if (!title || !company) {
      return Response.json(
        { error: 'Job title and company are required.' },
        { status: 400 },
      )
    }

    const tags = (body.tags ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const job: JobRecord = {
      jobId: `job-rec-${crypto.randomUUID()}`,
      source: 'Glaunch Recruiter',
      title,
      company,
      location: body.location?.trim() || 'Remote',
      url: body.url?.trim() || '',
      description: body.description?.trim() || '',
      tags,
      sector: body.sector?.trim() || 'General',
      postedAt: new Date().toISOString(),
      isActive: true,
      recruiterId: ctx.authed.userId,
    }

    await putJob(job)
    return Response.json({ job })
  } catch (err) {
    console.log('[v0] recruiter job create error:', (err as Error).message)
    return Response.json(
      { error: 'Could not create job posting.' },
      { status: 500 },
    )
  }
}
