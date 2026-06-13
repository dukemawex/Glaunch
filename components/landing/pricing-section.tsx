import { PricingPlans } from '@/components/pricing-plans'

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
            Free for students. Fair for everyone.
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Start free and upgrade only when you need more firepower. No hidden
            fees, cancel anytime.
          </p>
        </div>
        <div className="mt-14">
          <PricingPlans />
        </div>
      </div>
    </section>
  )
}
