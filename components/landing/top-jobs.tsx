import Link from 'next/link'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { SEED_JOBS } from '@/lib/seed-data'

// Three representative real roles with illustrative fit scores for the preview.
const PREVIEW = [
  { jobId: 'job-paystack-frontend-engineer', score: 94 },
  { jobId: 'job-flutterwave-data-analyst', score: 88 },
  { jobId: 'job-andela-product-designer', score: 81 },
]

export function TopJobs() {
  const jobs = PREVIEW.map((p) => ({
    ...p,
    job: SEED_JOBS.find((j) => j.jobId === p.jobId)!,
  })).filter((x) => x.job)

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          Top matched jobs
        </h2>
        <Link
          href="/sign-up"
          className="text-sm font-semibold text-brand-orange hover:underline"
        >
          See your matches →
        </Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {jobs.map(({ job, score }) => (
          <div
            key={job.jobId}
            className="flex flex-col rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                {job.source}
              </span>
              <span className="rounded-full bg-brand-green/15 px-3 py-1 text-sm font-bold text-brand-green">
                {score}%
              </span>
            </div>
            <h3 className="mt-4 text-lg font-bold">{job.title}</h3>
            <p className="mt-1 font-medium text-muted-foreground">
              {job.company}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {job.location}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {job.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <Link
              href="/sign-up"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-orange hover:underline"
            >
              View role
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
