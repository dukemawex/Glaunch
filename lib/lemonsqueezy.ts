export type PlanId = 'premium' | 'recruiter'

/**
 * Maps an internal plan id to its Lemon Squeezy variant id.
 * Variant ids are configured via environment variables.
 */
function variantForPlan(planId: PlanId): string | undefined {
  if (planId === 'premium') return process.env.LEMON_SQUEEZY_VARIANT_PREMIUM
  if (planId === 'recruiter') return process.env.LEMON_SQUEEZY_VARIANT_RECRUITER
  return undefined
}

/**
 * Create a Lemon Squeezy hosted checkout and return its URL.
 * Embeds the Clerk userId + plan in custom checkout data so the webhook
 * can attribute the purchase to the right account.
 */
export async function createCheckout(
  userId: string,
  email: string,
  planId: PlanId,
): Promise<string> {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY
  const storeId = process.env.LEMON_SQUEEZY_STORE_ID
  const variantId = variantForPlan(planId)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  if (!apiKey || !storeId) {
    throw new Error('Lemon Squeezy is not configured (missing API key or store id).')
  }
  if (!variantId) {
    throw new Error(
      `No Lemon Squeezy variant configured for the "${planId}" plan.`,
    )
  }

  const payload = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          email,
          custom: { user_id: userId, plan: planId },
        },
        product_options: {
          redirect_url: `${appUrl}/dashboard?upgraded=1`,
        },
      },
      relationships: {
        store: { data: { type: 'stores', id: String(storeId) } },
        variant: { data: { type: 'variants', id: String(variantId) } },
      },
    },
  }

  const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.log('[v0] Lemon Squeezy checkout error:', detail)
    throw new Error('Could not create a checkout session. Please try again.')
  }

  const json = await res.json()
  const url: string | undefined = json?.data?.attributes?.url
  if (!url) throw new Error('Checkout URL missing from Lemon Squeezy response.')
  return url
}
