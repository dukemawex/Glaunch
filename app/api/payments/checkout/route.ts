import { getAuthedUser, unauthorized } from '@/lib/api-auth'
import { getUser } from '@/lib/data'
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

    // Pull the freshest email from the user's DynamoDB profile, falling back
    // to the Clerk email.
    const profile = await getUser(authed.userId)
    const email = profile?.email || authed.email
    if (!email) {
      return Response.json(
        { error: 'A verified email is required to start checkout.' },
        { status: 400 },
      )
    }

    const checkoutUrl = await createCheckout({
      userId: authed.userId,
      email,
      plan: planId as PlanId,
    })
    return Response.json({ checkoutUrl, url: checkoutUrl })
  } catch (err) {
    console.log('[v0] checkout error:', (err as Error).message)
    return Response.json(
      { error: (err as Error).message || 'Could not start checkout.' },
      { status: 500 },
    )
  }
}
