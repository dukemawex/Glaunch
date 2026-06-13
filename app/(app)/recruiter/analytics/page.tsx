import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { BarChart3 } from 'lucide-react'
import { getRecruiterData } from '@/lib/recruiter'
import { AnalyticsCharts } from '@/components/recruiter/analytics-charts'

export const dynamic = 'force-dynamic'

export default async function RecruiterAnalyticsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { analytics, stats } = await getRecruiterData(userId)
  const { skills, countries, volume } = analytics
  const totalApplicants = stats.totalApplicants

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand-green">
          Recruiter
        </p>
        <h1 className="mt-1 flex items-center gap-3 text-3xl font-black tracking-tight sm:text-4xl">
          <BarChart3 className="size-8 text-brand-orange" />
          Applicant analytics
        </h1>
        <p className="mt-2 text-muted-foreground">
          {totalApplicants > 0
            ? `Insights across ${totalApplicants} applicant${totalApplicants === 1 ? '' : 's'} to your job listings.`
            : 'Post jobs and your applicant insights will appear here.'}
        </p>
      </div>

      <AnalyticsCharts
        skills={skills}
        countries={countries}
        volume={volume}
      />
    </div>
  )
}
