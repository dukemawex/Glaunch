import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { Logo } from '@/components/logo'
import { OnboardingForm } from '@/components/onboarding-form'
import { getUser } from '@/lib/data'

export default async function OnboardingPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [user, existing] = await Promise.all([currentUser(), getUser(userId)])

  // Already onboarded — skip straight to the dashboard.
  if (existing && (existing.profileComplete ?? 0) >= 50) {
    redirect('/dashboard')
  }

  const defaultName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || ''
  const defaultEmail = user?.emailAddresses?.[0]?.emailAddress ?? ''

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 py-12">
      <Logo />
      <div className="mt-8 w-full max-w-lg">
        <h1 className="text-balance text-3xl font-black tracking-tight">
          Let&apos;s set up your launchpad
        </h1>
        <p className="mt-2 text-pretty text-muted-foreground">
          Tell us a little about you so we can tailor matches, resume feedback,
          and interview prep.
        </p>
        <div className="mt-8">
          <OnboardingForm defaultName={defaultName} defaultEmail={defaultEmail} />
        </div>
      </div>
    </main>
  )
}
