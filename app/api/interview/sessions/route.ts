import { v4 as uuidv4 } from 'uuid'
import { getUserId, unauthorized } from '@/lib/api-auth'
import { putSession, getSessions } from '@/lib/data'
import type { InterviewSessionRecord } from '@/lib/types'

export const runtime = 'nodejs'

/** Persist a completed interview session. */
export async function POST(req: Request) {
  try {
    const userId = await getUserId()
    if (!userId) return unauthorized()

    const body = (await req.json()) as {
      jobTitle?: string
      questions?: unknown
      answers?: unknown
      scores?: unknown
      feedback?: unknown
      overallScore?: number
    }

    if (!body.jobTitle) {
      return Response.json({ error: 'A job title is required.' }, { status: 400 })
    }

    const session: InterviewSessionRecord = {
      userId,
      sessionId: uuidv4(),
      jobTitle: body.jobTitle,
      questions: JSON.stringify(body.questions ?? []),
      answers: JSON.stringify(body.answers ?? []),
      scores: JSON.stringify(body.scores ?? []),
      feedback: JSON.stringify(body.feedback ?? []),
      overallScore: Math.max(0, Math.min(100, Math.round(body.overallScore ?? 0))),
      completedAt: new Date().toISOString(),
    }
    await putSession(session)

    return Response.json({ session })
  } catch (err) {
    console.log('[v0] save session error:', (err as Error).message)
    return Response.json({ error: 'Failed to save session.' }, { status: 500 })
  }
}

/** List completed interview sessions for the user. */
export async function GET() {
  try {
    const userId = await getUserId()
    if (!userId) return unauthorized()

    const sessions = await getSessions(userId)
    return Response.json({ sessions })
  } catch (err) {
    console.log('[v0] list sessions error:', (err as Error).message)
    return Response.json({ error: 'Failed to load sessions.' }, { status: 500 })
  }
}
