import Link from 'next/link'
import {
  Briefcase,
  Users,
  TrendingUp,
  Globe,
  ArrowUpRight,
  BarChart3,
} from 'lucide-react'
import { getRecruiterData } from '@/lib/recruiter'
import { ScoreBadge } from '@/components/recruiter/score-badge'

export async function RecruiterDashboard({
  userId,
  fullName,
}: {
  userId: string
  fullName: string
}) {
  const { stats, applicants } = await getRecruiterData(userId)
  const firstName = (fullName || 'there').split(' ')[0]
  const topApplicants = applicants.slice(0, 5)

  const statCards = [
    { label: 'Jobs Posted', value: stats.totalJobs, icon: Briefcase },
    { label: 'Total Applicants', value: stats.totalApplicants, icon: Users },
    { label: 'Avg Match Score', value: `${stats.avgMatchScore}%`, icon: TrendingUp },
    { label: 'Countries Reached', value: stats.countries, icon: Globe },
  ]

  const actions = [
    {
      href: '/recruiter/jobs',
      label: 'Post a Job',
      desc: 'Publish a new opening',
      icon: Briefcase,
    },
    {
      href: '/recruiter/pipeline',
      label: 'View Pipeline',
      desc: 'AI-ranked candidates',
      icon: Users,
    },
    {
      href: '/recruiter/analytics',
      label: 'Analytics',
      desc: 'Applicant insights',
      icon: BarChart3,
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand-orange">
          Recruiter Workspace
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Welcome back, {firstName}.
          </h1>
          <span className="rounded-full bg-brand-orange/15 px-3 py-1 text-sm font-bold text-brand-orange">
            Recruiter plan
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <Icon className="h-4 w-4 text-brand-orange" />
              </div>
              <p className="mt-3 text-3xl font-black">{s.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {actions.map((a) => {
          const Icon = a.icon
          return (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-brand-orange"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold">{a.label}</p>
                  <p className="text-sm text-muted-foreground">{a.desc}</p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-brand-orange" />
            </Link>
          )
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Top Candidates</h2>
          <Link
            href="/recruiter/pipeline"
            className="text-sm font-semibold text-brand-orange hover:underline"
          >
            View pipeline
          </Link>
        </div>
        <div className="mt-4">
          {topApplicants.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No applicants yet. Post a job to start receiving AI-ranked
                candidates.
              </p>
              <Link
                href="/recruiter/jobs"
                className="mt-3 inline-block text-sm font-semibold text-brand-orange hover:underline"
              >
                Post your first job →
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {topApplicants.map((a) => (
                <li
                  key={a.applicationId}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{a.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {a.jobTitle} · {a.country}
                    </p>
                  </div>
                  <ScoreBadge score={a.matchScore} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
