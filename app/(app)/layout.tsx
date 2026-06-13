import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { AppNav } from '@/components/app-nav'
import { getUser, upsertUserBootstrap } from '@/lib/data'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let user = await getUser(userId)

  // First time we see this Clerk user — create a baseline record.
  if (!user) {
    const clerk = await currentUser()
    user = await upsertUserBootstrap({
      userId,
      email: clerk?.emailAddresses?.[0]?.emailAddress ?? '',
      fullName:
        [clerk?.firstName, clerk?.lastName].filter(Boolean).join(' ') || '',
    })
  }

  if ((user.profileComplete ?? 0) < 10) {
    redirect('/onboarding')
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav plan={user.plan} />
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </div>
  )
}
