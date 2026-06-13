import { EventName } from '@paddle/paddle-node-sdk'
import { getPaddle } from '@/lib/paddle'
import { updateUser } from '@/lib/data'
import type { UserPlan } from '@/lib/types'

export const runtime = 'nodejs'

/**
 * Paddle webhook (sandbox). Verifies the signature with the webhook secret,
 * then upgrades the user's plan on transaction.completed using the userId we
 * embedded in customData at checkout.
 */
export async function POST(req: Request) {
  try {
    const secret = process.env.PADDLE_WEBHOOK_SECRET
    if (!secret) {
      console.log('[v0] paddle webhook: missing PADDLE_WEBHOOK_SECRET')
      return Response.json({ error: 'Webhook not configured.' }, { status: 500 })
    }

    const signature = req.headers.get('paddle-signature') ?? ''
    const rawBody = await req.text()

    const paddle = getPaddle()
    const event = await paddle.webhooks.unmarshal(rawBody, secret, signature)

    if (!event) {
      return Response.json({ error: 'Invalid signature.' }, { status: 401 })
    }

    if (event.eventType === EventName.TransactionCompleted) {
      const data = event.data as {
        customData?: { userId?: string; plan?: string } | null
      }
      const custom = data.customData ?? {}
      const userId = custom.userId
      const plan: UserPlan = custom.plan === 'premium' ? 'premium' : 'recruiter'

      if (userId) {
        await updateUser(userId, { plan })
        console.log(`[v0] paddle webhook: upgraded ${userId} -> ${plan}`)
      }
    }

    return Response.json({ received: true })
  } catch (err) {
    console.log('[v0] paddle webhook error:', (err as Error).message)
    return Response.json({ error: 'Webhook handling failed.' }, { status: 500 })
  }
}
