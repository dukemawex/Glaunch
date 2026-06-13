import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import {
  FileText,
  Target,
  Send,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react'
import { getUser, getMatches, getApplications, getSessions } from '@/lib/data'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  applied: 'bg-brand-green/15 text-brand-green',
  pending: 'bg-yellow-500/15 text-yellow-500',
  failed: 'bg-destructive/15 text-destructive',
}

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [user, matches, applications, sessions] = await Promise.all([
    getUser(userId),
    getMatches(userId),
    getApplications(userId),
    getSessions(userId),
  ])

  const firstName = (user?.fullName || 'there').split(' ')[0]
  const topMatches = matches.slice(0, 5)
  const recentApps = applications.slice(0, 5)

  const stats = [
    { label: 'ATS Score', value: user?.atsScore || 0, icon: TrendingUp },
    { label: 'Total Matches', value: matches.length, icon: Target },
    { label: 'Applications Sent', value: applications.length, icon: Send },
    { label: 'Interview Sessions', value: sessions.length, icon: MessageSquare },
  ]

  const actions = [
    { href: '/resume', label: 'Upload Resume', desc: 'Get your ATS score', icon: FileText },
    { href: '/matches', label: 'Find Matches', desc: 'Discover roles that fit', icon: Target },
    { href: '/interview', label: 'Practice Interview', desc: 'Train with AI coaching', icon: MessageSquare },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand-green">
          Your Command Center
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Welcome back, {firstName}.
          </h1>
          <span className="rounded-full bg-brand-green/15 px-3 py-1 text-sm font-bold text-brand-green">
            Profile {user?.profileComplete ?? 0}% complete
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top matched jobs */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Top Matched Jobs</h2>
            <Link
              href="/matches"
              className="text-sm font-semibold text-brand-orange hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {topMatches.length === 0 ? (
              <EmptyState
                text="No matches yet. Generate matches to see roles tailored to your profile."
                href="/matches"
                cta="Find matches"
              />
            ) : (
              topMatches.map((m) => (
                <div
                  key={m.matchId}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{m.jobTitle}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {m.company}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand-green/15 px-3 py-1 text-sm font-bold text-brand-green">
                    {m.matchScore}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent applications */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Applications</h2>
            <Link
              href="/apply"
              className="text-sm font-semibold text-brand-orange hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4">
            {recentApps.length === 0 ? (
              <EmptyState
                text="No applications yet. Apply to matched roles to track them here."
                href="/apply"
                cta="Go to applications"
              />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 text-right font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApps.map((a) => (
                    <tr key={a.applicationId} className="border-t border-border">
                      <td className="py-2.5">
                        <p className="font-medium">{a.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.company}
                        </p>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
                            STATUS_STYLES[a.status] ?? 'bg-secondary',
                          )}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-xs text-muted-foreground">
                        {new Date(a.appliedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
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
    </div>
  )
}

function EmptyState({
  text,
  href,
  cta,
}: {
  text: string
  href: string
  cta: string
}) {
  return (
    <div className="rounded-lg border border-dashed border-border p-6 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      <Link
        href={href}
        className="mt-3 inline-block text-sm font-semibold text-brand-orange hover:underline"
      >
        {cta} →
      </Link>
    </div>
  )
}
