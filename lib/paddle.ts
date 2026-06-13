import { Paddle, Environment } from '@paddle/paddle-node-sdk'
import type { UserPlan } from './types'

/**
 * Paddle (Sandbox / test mode) server client.
 * Auth via PADDLE_API_KEY. All checkouts run against the sandbox environment,
 * so the test card 4242 4242 4242 4242 (any future expiry, any CVC) approves
 * instantly.
 */
let paddleClient: Paddle | null = null

export function getPaddle(): Paddle {
  if (paddleClient) return paddleClient
  const apiKey = process.env.PADDLE_API_KEY
  if (!apiKey) {
    throw new Error('Payments are not configured: PADDLE_API_KEY is missing.')
  }
  paddleClient = new Paddle(apiKey, { environment: Environment.sandbox })
  return paddleClient
}

export type PlanId = Exclude<UserPlan, 'free'>

/** Maps an app plan to its Paddle sandbox price ID. */
export function priceIdForPlan(plan: PlanId): string {
  const map: Record<PlanId, string | undefined> = {
    recruiter: process.env.PADDLE_RECRUITER_PRICE_ID,
    premium: process.env.PADDLE_PREMIUM_PRICE_ID,
  }
  const priceId = map[plan]
  if (!priceId) {
    throw new Error(
      `No Paddle price configured for the ${plan} plan. Set ${
        plan === 'recruiter'
          ? 'PADDLE_RECRUITER_PRICE_ID'
          : 'PADDLE_PREMIUM_PRICE_ID'
      }.`,
    )
  }
  return priceId
}

/**
 * Creates a Paddle checkout transaction and returns its hosted checkout URL.
 */
export async function createCheckout(input: {
  userId: string
  email: string
  plan: PlanId
}): Promise<string> {
  const paddle = getPaddle()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  const transaction = await paddle.transactions.create({
    items: [{ priceId: priceIdForPlan(input.plan), quantity: 1 }],
    customData: { userId: input.userId, plan: input.plan, email: input.email },
    ...(appUrl
      ? { checkout: { url: `${appUrl}/dashboard?upgraded=true` } }
      : {}),
  })

  const url = transaction.checkout?.url
  if (!url) {
    throw new Error('Paddle did not return a checkout URL.')
  }
  return url
}
