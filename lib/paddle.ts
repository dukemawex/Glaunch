import { Paddle, Environment } from '@paddle/paddle-node-sdk'
import type { UserPlan } from './types'

/**
 * Paddle (Sandbox / test mode) server client.
 *
 * Auth is via PADDLE_API_KEY only. We intentionally do NOT require pre-created
 * Paddle catalog price IDs — instead each checkout builds an inline
 * "non-catalog" price + product on the fly. That means the only secret you
 * need is the sandbox API key.
 *
 * All checkouts run against the sandbox environment, so the Paddle test card
 * 4242 4242 4242 4242 (any future expiry, any CVC) approves instantly.
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

/** Display + billing metadata for each paid plan. Amounts are in USD cents. */
const PLAN_CONFIG: Record<
  PlanId,
  { name: string; description: string; amountCents: string }
> = {
  premium: {
    name: 'Glaunch Premium Student',
    description:
      'Unlimited smart matches, unlimited interview coaching, AI resume rewrites, and priority application visibility.',
    amountCents: '500', // $5.00 / month
  },
  recruiter: {
    name: 'Glaunch Recruiter',
    description:
      'Post unlimited jobs, AI-ranked candidate pipeline, applicant analytics, and team seats.',
    amountCents: '1000', // $10.00 / month
  },
}

/**
 * Builds the `items` array for a transaction. If a catalog price ID env var is
 * present we use it; otherwise we fall back to an inline non-catalog price so
 * checkout works with just the API key.
 */
function itemsForPlan(plan: PlanId) {
  const envPriceId =
    plan === 'recruiter'
      ? process.env.PADDLE_RECRUITER_PRICE_ID
      : process.env.PADDLE_PREMIUM_PRICE_ID

  if (envPriceId) {
    return [{ priceId: envPriceId, quantity: 1 }]
  }

  const cfg = PLAN_CONFIG[plan]
  return [
    {
      quantity: 1,
      price: {
        name: cfg.name,
        description: cfg.description,
        unitPrice: { amount: cfg.amountCents, currencyCode: 'USD' as const },
        billingCycle: { interval: 'month' as const, frequency: 1 },
        product: {
          name: cfg.name,
          taxCategory: 'standard' as const,
        },
      },
    },
  ]
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
    items: itemsForPlan(input.plan),
    customData: { userId: input.userId, plan: input.plan, email: input.email },
    ...(appUrl
      ? { checkout: { url: `${appUrl}/dashboard?upgraded=true` } }
      : {}),
  })

  const url = transaction.checkout?.url
  if (!url) {
    throw new Error(
      'Paddle did not return a checkout URL. In the Paddle dashboard, set ' +
        'Checkout > Settings > Default payment link to your app URL.',
    )
  }
  return url
}
