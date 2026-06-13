import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getRecruiterData } from '@/lib/recruiter'
import { ScoreBadge } from '@/components/recruiter/score-badge'

const STATUS_STYLES: Record<string, string> = {
  applied: 'bg-brand-green/15 text-brand-green',
  pending: 'bg-yellow-500/15 text-yellow-500',
  failed: 'bg-destructive/15 text-destructive',
}

export default async function RecruiterPipelinePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { applicants, stats } = await getRecruiterData(userId)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand-orange">
          Candidate Pipeline
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
          {stats.totalApplicants} applicant
          {stats.totalApplicants === 1 ? '' : 's'}, AI-ranked
        </h1>
        <p className="mt-2 text-muted-foreground">
          Every applicant to your jobs, sorted by their AI match score.
        </p>
      </div>

      {applicants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No applicants yet. Once students apply to your posted jobs,
          they&apos;ll appear here ranked by fit.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Candidate</th>
                  <th className="px-5 py-3 font-medium">Applied for</th>
                  <th className="px-5 py-3 font-medium">Top skills</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Match</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((a) => (
                  <tr
                    key={a.applicationId}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold">{a.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.country}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{a.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.company}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {a.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                        {a.skills.length === 0 && (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          STATUS_STYLES[a.status] ?? 'bg-secondary'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ScoreBadge score={a.matchScore} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
