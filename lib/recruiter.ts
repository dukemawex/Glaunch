import {
  getRecruiterJobs,
  getAllApplications,
  getAllMatches,
  getAllUsers,
} from './data'
import type { JobRecord } from './types'

export interface PipelineApplicant {
  applicationId: string
  userId: string
  name: string
  country: string
  jobId: string
  jobTitle: string
  company: string
  status: string
  appliedAt: string
  matchScore: number
  skills: string[]
}

export interface RecruiterAnalytics {
  skills: { name: string; count: number }[]
  countries: { name: string; count: number }[]
  volume: { date: string; count: number }[]
}

export interface RecruiterData {
  jobs: JobRecord[]
  applicants: PipelineApplicant[]
  analytics: RecruiterAnalytics
  stats: {
    totalJobs: number
    totalApplicants: number
    avgMatchScore: number
    countries: number
  }
}

function parseSkills(raw?: string): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

/**
 * Aggregates everything the recruiter dashboard needs: the recruiter's own
 * job posts, all applicants to those jobs (joined with AI match scores and
 * applicant profiles), and rolled-up analytics. Sorted by match score.
 */
export async function getRecruiterData(
  recruiterId: string,
): Promise<RecruiterData> {
  const [jobs, allApps, allMatches, allUsers] = await Promise.all([
    getRecruiterJobs(recruiterId),
    getAllApplications(),
    getAllMatches(),
    getAllUsers(),
  ])

  const jobIds = new Set(jobs.map((j) => j.jobId))

  const matchByUserJob = new Map<string, number>()
  for (const m of allMatches) {
    matchByUserJob.set(`${m.userId}:${m.jobId}`, m.matchScore)
  }

  const userById = new Map(allUsers.map((u) => [u.userId, u]))

  const applicants: PipelineApplicant[] = allApps
    .filter((a) => jobIds.has(a.jobId))
    .map((a) => {
      const profile = userById.get(a.userId)
      return {
        applicationId: a.applicationId,
        userId: a.userId,
        name: profile?.fullName || 'Anonymous Applicant',
        country: profile?.country || 'Unknown',
        jobId: a.jobId,
        jobTitle: a.jobTitle,
        company: a.company,
        status: a.status,
        appliedAt: a.appliedAt,
        matchScore: matchByUserJob.get(`${a.userId}:${a.jobId}`) ?? 0,
        skills: parseSkills(profile?.extractedSkills),
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)

  // --- analytics ---
  const skillCounts = new Map<string, number>()
  const countryCounts = new Map<string, number>()
  const volumeCounts = new Map<string, number>()

  for (const ap of applicants) {
    for (const s of ap.skills) {
      skillCounts.set(s, (skillCounts.get(s) ?? 0) + 1)
    }
    countryCounts.set(ap.country, (countryCounts.get(ap.country) ?? 0) + 1)
    const day = ap.appliedAt.slice(0, 10)
    volumeCounts.set(day, (volumeCounts.get(day) ?? 0) + 1)
  }

  const toSorted = (m: Map<string, number>, limit?: number) => {
    const arr = [...m.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
    return limit ? arr.slice(0, limit) : arr
  }

  const avgMatchScore = applicants.length
    ? Math.round(
        applicants.reduce((sum, a) => sum + a.matchScore, 0) /
          applicants.length,
      )
    : 0

  return {
    jobs,
    applicants,
    analytics: {
      skills: toSorted(skillCounts, 8),
      countries: toSorted(countryCounts, 8),
      volume: toSorted(volumeCounts).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    },
    stats: {
      totalJobs: jobs.length,
      totalApplicants: applicants.length,
      avgMatchScore,
      countries: countryCounts.size,
    },
  }
}
