import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { MapPin, Tag } from 'lucide-react'
import { getRecruiterJobs } from '@/lib/data'
import { PostJobForm } from '@/components/recruiter/post-job-form'

export default async function RecruiterJobsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const jobs = await getRecruiterJobs(userId)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand-orange">
          Job Postings
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
          Post & manage your openings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Published jobs appear in student matching and feed your candidate
          pipeline.
        </p>
      </div>

      <PostJobForm />

      <div>
        <h2 className="text-lg font-bold">
          Your jobs{' '}
          <span className="text-muted-foreground">({jobs.length})</span>
        </h2>
        <div className="mt-4 grid gap-4">
          {jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              You haven&apos;t posted any jobs yet. Use the form above to
              publish your first opening.
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.jobId}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.company}
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-green/15 px-3 py-1 text-xs font-bold text-brand-green">
                    Active
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4" />
                    {job.sector}
                  </span>
                  <span>
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </span>
                </div>
                {job.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
