import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { MatchesClient } from '@/components/matches/matches-client'
import { getMatches, getApplications } from '@/lib/data'

const ONE_DAY = 24 * 60 * 60 * 1000

export default async function MatchesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [allMatches, applications] = await Promise.all([
    getMatches(userId),
    getApplications(userId),
  ])

  // Only treat matches as fresh if generated within the last 24 hours.
  const fresh = allMatches.filter(
    (m) => Date.now() - new Date(m.createdAt).getTime() < ONE_DAY,
  )

  const appliedJobIds = applications.map((a) => a.jobId)

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight md:text-4xl">
        Smart Matching
      </h1>
      <p className="mt-2 text-muted-foreground">
        Real internships and entry-level roles ranked by genuine fit — so you
        only apply where you can win.
      </p>
      <div className="mt-8">
        <MatchesClient
          initialMatches={fresh}
          appliedJobIds={appliedJobIds}
        />
      </div>
    </div>
  )
}
