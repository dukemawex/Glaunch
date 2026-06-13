export type UserRole = 'student' | 'recruiter'
export type UserPlan = 'free' | 'premium' | 'recruiter'
export type ApplicationStatus = 'pending' | 'applied' | 'failed'

export interface UserRecord {
  userId: string
  email: string
  fullName: string
  country: string
  university?: string
  graduationYear?: string
  fieldOfStudy?: string
  company?: string
  companySize?: string
  hiringRoles?: string
  role: UserRole
  plan: UserPlan
  atsScore: number
  profileComplete: number
  resumeText?: string
  extractedSkills?: string
  createdAt: string
}

export interface ScoreBreakdown {
  formatting: number
  keywords: number
  experience: number
  education: number
}

export interface WeakSection {
  section: string
  issue: string
  fix: string
}

export interface ResumeAnalysis {
  atsScore: number
  extractedSkills: string[]
  missingKeywords: string[]
  weakSections: WeakSection[]
  rewrite: {
    summary: string
    experience: string[]
    skills: string[]
  }
  scoreBreakdown: ScoreBreakdown
}

export interface ResumeRecord {
  userId: string
  resumeId: string
  fileName: string
  rawText: string
  extractedSkills: string
  atsScore: number
  aiRewriteSummary: string
  aiRewriteExperience: string
  aiRewriteSkills: string
  scoreBreakdown: string
  missingKeywords?: string
  weakSections?: string
  uploadedAt: string
}

export interface JobRecord {
  jobId: string
  source: string
  title: string
  company: string
  location: string
  url: string
  description: string
  tags: string[]
  sector: string
  postedAt: string
  isActive: boolean
}

export interface ApplicationRecord {
  userId: string
  applicationId: string
  jobId: string
  jobTitle: string
  company: string
  jobUrl: string
  source: string
  status: ApplicationStatus
  appliedAt: string
  notes: string
}

export interface MatchRecord {
  userId: string
  matchId: string
  jobId: string
  jobTitle: string
  company: string
  location: string
  source: string
  jobUrl: string
  matchScore: number
  reasons: string
  createdAt: string
}

export interface InterviewQuestion {
  id: string
  question: string
  type: 'behavioral' | 'technical' | 'situational'
  tip: string
}

export interface InterviewScore {
  score: number
  feedback: string
  improvedAnswer: string
  keyPoints: string[]
}

export interface InterviewSessionRecord {
  userId: string
  sessionId: string
  jobTitle: string
  questions: string
  answers: string
  scores: string
  feedback: string
  overallScore: number
  completedAt: string
}
