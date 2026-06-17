export async function GET() {
  return Response.json({
    paddle: {
      hasApiKey: Boolean(process.env.PADDLE_API_KEY),
      hasWebhookSecret: Boolean(process.env.PADDLE_WEBHOOK_SECRET),
      hasPremiumPriceId: Boolean(process.env.PADDLE_PREMIUM_PRICE_ID),
      hasRecruiterPriceId: Boolean(process.env.PADDLE_RECRUITER_PRICE_ID),
      appUrl: process.env.NEXT_PUBLIC_APP_URL || null,
    },
    env: {
      nodeEnv: process.env.NODE_ENV || null,
    },
  })
}
