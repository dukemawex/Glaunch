import {
  putItem,
  getItem,
  queryByPK,
  queryGSI,
  updateItem,
  scanByEntity,
  keys,
  JOB_GSI1PK,
} from './dynamodb'
import type {
  UserRecord,
  ResumeRecord,
  JobRecord,
  ApplicationRecord,
  MatchRecord,
  InterviewSessionRecord,
} from './types'

/* strip internal single-table attributes before returning to callers */
function clean<T>(item: Record<string, unknown> | null): T | null {
  if (!item) return null
  const { PK, SK, GSI1PK, GSI1SK, entity, ...rest } = item
  return rest as T
}
function cleanList<T>(items: Record<string, unknown>[]): T[] {
  return items.map((i) => clean<T>(i) as T)
}

/* ---------------------------- Users ---------------------------- */

export async function getUser(userId: string): Promise<UserRecord | null> {
  const item = await getItem(keys.userPk(userId), keys.userProfileSk())
  return clean<UserRecord>(item)
}

export async function putUser(user: UserRecord): Promise<void> {
  await putItem({
    PK: keys.userPk(user.userId),
    SK: keys.userProfileSk(),
    entity: 'USER',
    ...user,
  })
}

export async function updateUser(
  userId: string,
  updates: Partial<UserRecord>,
): Promise<UserRecord | null> {
  const item = await updateItem(
    keys.userPk(userId),
    keys.userProfileSk(),
    updates as Record<string, unknown>,
  )
  return clean<UserRecord>(item)
}

/** Create a baseline user record on first sign-in if none exists yet. */
export async function upsertUserBootstrap(input: {
  userId: string
  email: string
  fullName: string
}): Promise<UserRecord> {
  const existing = await getUser(input.userId)
  if (existing) return existing

  const user: UserRecord = {
    userId: input.userId,
    email: input.email,
    fullName: input.fullName,
    country: '',
    university: '',
    graduationYear: '',
    fieldOfStudy: '',
    role: 'student',
    plan: 'free',
    atsScore: 0,
    profileComplete: 0,
    resumeText: '',
    extractedSkills: '[]',
    createdAt: new Date().toISOString(),
  }
  await putUser(user)
  return user
}

/* --------------------------- Resumes --------------------------- */

export async function putResume(resume: ResumeRecord): Promise<void> {
  await putItem({
    PK: keys.userPk(resume.userId),
    SK: keys.resumeSk(resume.resumeId),
    entity: 'RESUME',
    ...resume,
  })
}

export async function getResumes(userId: string): Promise<ResumeRecord[]> {
  const items = await queryByPK(keys.userPk(userId), 'RESUME#')
  return cleanList<ResumeRecord>(items).sort((a, b) =>
    b.uploadedAt.localeCompare(a.uploadedAt),
  )
}

/* ----------------------------- Jobs ---------------------------- */

export async function putJob(job: JobRecord): Promise<void> {
  await putItem({
    PK: keys.jobPk(job.jobId),
    SK: keys.jobSk(job.source),
    GSI1PK: JOB_GSI1PK,
    GSI1SK: job.postedAt,
    entity: 'JOB',
    ...job,
  })
}

export async function getActiveJobs(): Promise<JobRecord[]> {
  const items = await queryGSI(JOB_GSI1PK)
  return cleanList<JobRecord>(items)
    .filter((j) => j.isActive)
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
}

export async function getJob(jobId: string): Promise<JobRecord | null> {
  const items = await queryByPK(keys.jobPk(jobId))
  return clean<JobRecord>(items[0] ?? null)
}

/** All jobs posted by a specific recruiter, newest first. */
export async function getRecruiterJobs(
  recruiterId: string,
): Promise<JobRecord[]> {
  const items = await queryGSI(JOB_GSI1PK)
  return cleanList<JobRecord>(items)
    .filter((j) => j.recruiterId === recruiterId)
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
}

/* ------------------- Recruiter aggregate views ----------------- */

/** Every application across all students (recruiter pipeline source). */
export async function getAllApplications(): Promise<ApplicationRecord[]> {
  const items = await scanByEntity('APPLICATION')
  return cleanList<ApplicationRecord>(items)
}

/** Every match across all students (used to attach AI match scores). */
export async function getAllMatches(): Promise<MatchRecord[]> {
  const items = await scanByEntity('MATCH')
  return cleanList<MatchRecord>(items)
}

/** Every user profile (used for applicant country / name / skills). */
export async function getAllUsers(): Promise<UserRecord[]> {
  const items = await scanByEntity('USER')
  return cleanList<UserRecord>(items)
}

/* ------------------------- Applications ------------------------ */

export async function putApplication(app: ApplicationRecord): Promise<void> {
  await putItem({
    PK: keys.userPk(app.userId),
    SK: keys.applicationSk(app.applicationId),
    entity: 'APPLICATION',
    ...app,
  })
}

export async function getApplications(
  userId: string,
): Promise<ApplicationRecord[]> {
  const items = await queryByPK(keys.userPk(userId), 'APPLICATION#')
  return cleanList<ApplicationRecord>(items).sort((a, b) =>
    b.appliedAt.localeCompare(a.appliedAt),
  )
}

export async function updateApplication(
  userId: string,
  applicationId: string,
  updates: Partial<ApplicationRecord>,
): Promise<ApplicationRecord | null> {
  const item = await updateItem(
    keys.userPk(userId),
    keys.applicationSk(applicationId),
    updates as Record<string, unknown>,
  )
  return clean<ApplicationRecord>(item)
}

/* --------------------------- Matches --------------------------- */

export async function putMatch(match: MatchRecord): Promise<void> {
  await putItem({
    PK: keys.userPk(match.userId),
    SK: keys.matchSk(match.matchId),
    entity: 'MATCH',
    ...match,
  })
}

export async function getMatches(userId: string): Promise<MatchRecord[]> {
  const items = await queryByPK(keys.userPk(userId), 'MATCH#')
  return cleanList<MatchRecord>(items).sort((a, b) => b.matchScore - a.matchScore)
}

/* ---------------------- Interview Sessions --------------------- */

export async function putSession(
  session: InterviewSessionRecord,
): Promise<void> {
  await putItem({
    PK: keys.userPk(session.userId),
    SK: keys.sessionSk(session.sessionId),
    entity: 'SESSION',
    ...session,
  })
}

export async function getSessions(
  userId: string,
): Promise<InterviewSessionRecord[]> {
  const items = await queryByPK(keys.userPk(userId), 'SESSION#')
  return cleanList<InterviewSessionRecord>(items).sort((a, b) =>
    b.completedAt.localeCompare(a.completedAt),
  )
}
