import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { ResumeAnalyzer } from '@/components/resume/resume-analyzer'
import { getResumes } from '@/lib/data'
import type { ResumeAnalysis } from '@/lib/types'

function safeParse<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export default async function ResumePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const resumes = await getResumes(userId)
  const latest = resumes[0]

  let initialAnalysis: ResumeAnalysis | null = null
  if (latest) {
    initialAnalysis = {
      atsScore: latest.atsScore,
      extractedSkills: safeParse<string[]>(latest.extractedSkills, []),
      missingKeywords: safeParse<string[]>(latest.missingKeywords, []),
      weakSections: safeParse(latest.weakSections, []),
      rewrite: {
        summary: latest.aiRewriteSummary || '',
        experience: safeParse<string[]>(latest.aiRewriteExperience, []),
        skills: safeParse<string[]>(latest.aiRewriteSkills, []),
      },
      scoreBreakdown: safeParse(latest.scoreBreakdown, {
        formatting: 0,
        keywords: 0,
        experience: 0,
        education: 0,
      }),
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight md:text-4xl">
        Resume AI
      </h1>
      <p className="mt-2 text-muted-foreground">
        Upload your CV to get an instant ATS score, extracted skills, and
        concrete AI rewrites that get you past the bots.
      </p>
      <div className="mt-8">
        <ResumeAnalyzer initialAnalysis={initialAnalysis} />
      </div>
    </div>
  )
}
