import { getUserId } from '@/lib/api-auth'
import { redirect } from 'next/navigation'
import { getMatches } from '@/lib/data'
import { InterviewCoach } from '@/components/interview/interview-coach'

export const dynamic = 'force-dynamic'

export default async function InterviewPage() {
  const userId = await getUserId()
  if (!userId) redirect('/sign-in')

  const matches = await getMatches(userId)

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-green">
          Interview Coach
        </p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
          Practice until you&apos;re ready.
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pick a role from your matches, answer AI-generated questions, and get
          scored feedback with improved answers — so you walk in confident.
        </p>
      </header>

      <InterviewCoach matches={matches} />
    </main>
  )
}
