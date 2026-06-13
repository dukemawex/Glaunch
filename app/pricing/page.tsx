import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { PricingPlans } from '@/components/pricing-plans'
import { PricingUpgradeToast } from '@/components/pricing-upgrade-toast'

export const metadata: Metadata = {
  title: 'Pricing — Glaunch',
  description:
    'Free forever for students. Affordable premium coaching and recruiter plans. Your career, launched.',
}

export default function PricingPage() {
  return (
    <>
      <Suspense fallback={null}>
        <PricingUpgradeToast />
      </Suspense>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-green">
            Pricing
          </p>
          <h1 className="mt-3 text-balance text-4xl font-black sm:text-5xl">
            Free for students. Fair for everyone.
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground">
            Start free and upgrade only when you need more. No credit card
            required to launch your job search.
          </p>
        </div>

        <div className="mt-14">
          <PricingPlans />
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Questions about plans?{' '}
          <Link href="/" className="font-medium text-brand-orange hover:underline">
            Back to home
          </Link>
        </p>
      </main>
      <Footer />
    </>
  )
}
