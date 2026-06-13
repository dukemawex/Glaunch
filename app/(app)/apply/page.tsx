import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { ApplicationsClient } from '@/components/apply/applications-client'
import { getApplications } from '@/lib/data'

export default async function ApplyPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const applications = await getApplications(userId)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Applications
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track every role you&apos;ve opened and keep your pipeline up to
            date.
          </p>
        </div>
        <Link
          href="/matches"
          className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-bold text-brand-orange-foreground transition-colors hover:bg-brand-orange/90"
        >
          Find more roles
        </Link>
      </div>
      <div className="mt-8">
        <ApplicationsClient initialApplications={applications} />
      </div>
    </div>
  )
}
