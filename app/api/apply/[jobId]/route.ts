import { v4 as uuidv4 } from 'uuid'
import { getUserId, unauthorized } from '@/lib/api-auth'
import {
  getJob,
  getApplications,
  putApplication,
  updateApplication,
} from '@/lib/data'
import type { ApplicationRecord, ApplicationStatus } from '@/lib/types'

export const runtime = 'nodejs'

/** Create a "pending" application record for a job (manual application opened). */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const userId = await getUserId()
    if (!userId) return unauthorized()

    const { jobId } = await params
    const job = await getJob(jobId)
    if (!job) {
      return Response.json({ error: 'Job not found.' }, { status: 404 })
    }

    // Avoid duplicate active applications for the same job.
    const existing = (await getApplications(userId)).find(
      (a) => a.jobId === jobId && a.status !== 'failed',
    )
    if (existing) {
      return Response.json({ application: existing, alreadyApplied: true })
    }

    const application: ApplicationRecord = {
      userId,
      applicationId: uuidv4(),
      jobId: job.jobId,
      jobTitle: job.title,
      company: job.company,
      jobUrl: job.url,
      source: job.source,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      notes: 'Manual application opened',
    }
    await putApplication(application)

    return Response.json({ application })
  } catch (err) {
    console.log('[v0] apply POST error:', (err as Error).message)
    return Response.json(
      { error: 'Failed to record application.' },
      { status: 500 },
    )
  }
}

/** Update the status of an existing application (applied | failed | pending). */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const userId = await getUserId()
    if (!userId) return unauthorized()

    const { jobId } = await params
    const body = (await req.json()) as {
      applicationId?: string
      status?: ApplicationStatus
    }

    if (!body.status || !['pending', 'applied', 'failed'].includes(body.status)) {
      return Response.json({ error: 'Invalid status.' }, { status: 400 })
    }

    const apps = await getApplications(userId)
    const target = body.applicationId
      ? apps.find((a) => a.applicationId === body.applicationId)
      : apps.find((a) => a.jobId === jobId)

    if (!target) {
      return Response.json({ error: 'Application not found.' }, { status: 404 })
    }

    const updated = await updateApplication(userId, target.applicationId, {
      status: body.status,
      notes:
        body.status === 'applied'
          ? 'Marked as applied'
          : body.status === 'failed'
            ? 'Marked as failed'
            : target.notes,
    })

    return Response.json({ application: updated })
  } catch (err) {
    console.log('[v0] apply PATCH error:', (err as Error).message)
    return Response.json(
      { error: 'Failed to update application.' },
      { status: 500 },
    )
  }
}
