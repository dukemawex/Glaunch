import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { DashboardPreview } from '@/components/landing/dashboard-preview'
import { TopJobs } from '@/components/landing/top-jobs'
import { Testimonials } from '@/components/landing/testimonials'
import { PricingSection } from '@/components/landing/pricing-section'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DashboardPreview />
        <TopJobs />
        <Testimonials />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
