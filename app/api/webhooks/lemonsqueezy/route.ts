import crypto from 'node:crypto'
import { updateUser } from '@/lib/data'
import type { UserPlan } from '@/lib/types'

export const runtime = 'nodejs'

/**
 * Lemon Squeezy webhook. Verifies the HMAC signature, then upgrades the user's
 * plan on order_created / subscription events using the custom user_id we
 * embedded at checkout.
 */
export async function POST(req: Request) {
  try {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
    if (!secret) {
      console.log('[v0] webhook: missing LEMON_SQUEEZY_WEBHOOK_SECRET')
      return Response.json({ error: 'Webhook not configured.' }, { status: 500 })
    }

    const rawBody = await req.text()
    const signature = req.headers.get('x-signature') ?? ''

    const digest = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')

    const valid =
      signature.length === digest.length &&
      crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))

    if (!valid) {
      return Response.json({ error: 'Invalid signature.' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)
    const eventName: string = event?.meta?.event_name ?? ''
    const custom = event?.meta?.custom_data ?? {}
    const userId: string | undefined = custom?.user_id
    const plan: string | undefined = custom?.plan

    const upgradeEvents = [
      'order_created',
      'subscription_created',
      'subscription_payment_success',
      'subscription_resumed',
    ]

    if (upgradeEvents.includes(eventName) && userId) {
      const newPlan: UserPlan = plan === 'recruiter' ? 'recruiter' : 'premium'
      await updateUser(userId, { plan: newPlan })
      console.log(`[v0] webhook: upgraded ${userId} -> ${newPlan}`)
    }

    const downgradeEvents = ['subscription_expired', 'subscription_cancelled']
    if (downgradeEvents.includes(eventName) && userId) {
      // Cancellation events still allow access until expiry; only expiry downgrades.
      if (eventName === 'subscription_expired') {
        await updateUser(userId, { plan: 'free' })
        console.log(`[v0] webhook: downgraded ${userId} -> free`)
      }
    }

    return Response.json({ received: true })
  } catch (err) {
    console.log('[v0] webhook error:', (err as Error).message)
    return Response.json({ error: 'Webhook handling failed.' }, { status: 500 })
  }
}
