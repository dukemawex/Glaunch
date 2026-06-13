import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getUser } from '@/lib/data'

/**
 * Gate for all /recruiter/* routes. Auth is enforced in middleware; here we
 * verify the plan. Non-recruiters are bounced to pricing with a flag the
 * pricing page turns into a toast.
 */
export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await getUser(userId)
  if (user?.plan !== 'recruiter') {
    redirect('/pricing?upgrade=recruiter')
  }

  return <>{children}</>
}
