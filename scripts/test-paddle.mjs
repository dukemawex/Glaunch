import { Paddle, Environment } from '@paddle/paddle-node-sdk'

const paddle = new Paddle(process.env.PADDLE_API_KEY, {
  environment: Environment.sandbox,
})

const PLAN = {
  name: 'Glaunch Premium (test)',
  description: 'Test inline price',
  amount: '500',
  interval: 'month',
}

try {
  const tx = await paddle.transactions.create({
    items: [
      {
        quantity: 1,
        price: {
          name: PLAN.name,
          description: PLAN.description,
          unitPrice: { amount: PLAN.amount, currencyCode: 'USD' },
          billingCycle: { interval: PLAN.interval, frequency: 1 },
          product: {
            name: PLAN.name,
            taxCategory: 'standard',
          },
        },
      },
    ],
    customData: { userId: 'test_user', plan: 'premium' },
    checkout: {
      url:
        (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') +
        '/dashboard?upgraded=true',
    },
  })
  console.log('[v0] transaction id:', tx.id)
  console.log('[v0] checkout url:', tx.checkout?.url)
  console.log('[v0] SUCCESS')
} catch (err) {
  console.log('[v0] PADDLE ERROR:', err?.message || err)
  if (err?.detail) console.log('[v0] detail:', err.detail)
}
