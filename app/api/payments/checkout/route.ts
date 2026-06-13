import { getAuthedUser, unauthorized } from '@/lib/api-auth'
import { createCheckout, type PlanId } from '@/lib/paddle'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const authed = await getAuthedUser()
    if (!authed) return unauthorized()

    const body = (await req.json()) as { planId?: string }
    const planId = body.planId
    if (planId !== 'premium' && planId !== 'recruiter') {
      return Response.json({ error: 'Invalid plan selected.' }, { status: 400 })
    }

    if (!authed.email) {
      return Response.json(
        { error: 'A verified email is required to start checkout.' },
        { status: 400 },
      )
    }

    const url = await createCheckout({
      userId: authed.userId,
      email: authed.email,
      plan: planId as PlanId,
    })
    return Response.json({ url })
  } catch (err) {
    console.log('[v0] checkout error:', (err as Error).message)
    return Response.json(
      { error: (err as Error).message || 'Could not start checkout.' },
      { status: 500 },
    )
  }
}
