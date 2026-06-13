'use client'

import { useState, useRef } from 'react'
import {
  Upload,
  FileText,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { ScoreRing } from './score-ring'
import { cn } from '@/lib/utils'
import type { ResumeAnalysis } from '@/lib/types'

const ACCEPTED = ['.pdf', '.docx']

function isValid(file: File) {
  const name = file.name.toLowerCase()
  return ACCEPTED.some((ext) => name.endsWith(ext))
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const BREAKDOWN_LABELS: Record<string, string> = {
  formatting: 'Formatting',
  keywords: 'Keywords',
  experience: 'Experience',
  education: 'Education',
}

export function ResumeAnalyzer({
  initialAnalysis,
}: {
  initialAnalysis: ResumeAnalysis | null
}) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(
    initialAnalysis,
  )
  const inputRef = useRef<HTMLInputElement>(null)

  function selectFile(f: File | null) {
    if (!f) return
    if (!isValid(f)) {
      toast.error('Only PDF and DOCX files are supported.')
      return
    }
    setFile(f)
  }

  async function analyze() {
    if (!file) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setAnalysis(data.analysis as ResumeAnalysis)
      toast.success('Resume analyzed successfully.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          selectFile(e.dataTransfer.files?.[0] ?? null)
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors',
          dragging
            ? 'border-brand-orange bg-brand-orange/5'
            : 'border-border bg-card hover:border-brand-orange',
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
          <Upload className="h-6 w-6" />
        </span>
        {file ? (
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-brand-orange" />
            <span className="font-medium">{file.name}</span>
            <span className="text-muted-foreground">
              ({formatSize(file.size)})
            </span>
          </div>
        ) : (
          <div>
            <p className="font-bold">Drag &amp; drop your CV here</p>
            <p className="text-sm text-muted-foreground">
              or click to browse — PDF or DOCX
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <button
        type="button"
        onClick={analyze}
        disabled={!file || loading}
        className="flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-orange px-4 font-bold text-brand-orange-foreground transition-colors hover:bg-brand-orange/90 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing your resume...
          </>
        ) : (
          'Analyze Resume'
        )}
      </button>

      {loading && <AnalysisSkeleton />}

      {!loading && analysis && <AnalysisResult analysis={analysis} />}
    </div>
  )
}

function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-48 animate-pulse rounded-2xl border border-border bg-card" />
      <div className="h-40 animate-pulse rounded-2xl border border-border bg-card" />
    </div>
  )
}

function AnalysisResult({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Score + breakdown */}
      <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex justify-center">
          <ScoreRing score={analysis.atsScore} />
        </div>
        <div className="flex flex-col gap-4">
          {Object.entries(analysis.scoreBreakdown).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {BREAKDOWN_LABELS[key] ?? key}
                </span>
                <span className="text-muted-foreground">{value}/100</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-brand-orange"
                  style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-bold">Extracted Skills</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.extractedSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No skills detected.
              </p>
            ) : (
              analysis.extractedSkills.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-brand-green/15 px-3 py-1 text-sm font-medium text-brand-green"
                >
                  {s}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-bold">Missing Keywords</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.missingKeywords.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Great — no critical keywords missing.
              </p>
            ) : (
              analysis.missingKeywords.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-destructive/15 px-3 py-1 text-sm font-medium text-destructive"
                >
                  {s}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Weak sections */}
      {analysis.weakSections.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-bold">Sections to Improve</h3>
          <div className="mt-4 flex flex-col gap-4">
            {analysis.weakSections.map((w, i) => (
              <div
                key={`${w.section}-${i}`}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="h-4 w-4 text-brand-orange" />
                  {w.section}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Issue: </span>
                  {w.issue}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-brand-green">Fix: </span>
                  {w.fix}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewrite */}
      <RewritePanel rewrite={analysis.rewrite} />
    </div>
  )
}

function RewritePanel({
  rewrite,
}: {
  rewrite: ResumeAnalysis['rewrite']
}) {
  const tabs = ['Summary', 'Experience', 'Skills'] as const
  const [active, setActive] = useState<(typeof tabs)[number]>('Summary')
  const [copied, setCopied] = useState(false)

  const content =
    active === 'Summary'
      ? rewrite.summary
      : active === 'Experience'
        ? rewrite.experience.join('\n\n')
        : rewrite.skills.join(', ')

  function copy() {
    navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">AI Rewrite</h3>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:border-brand-orange"
        >
          {copied ? (
            <Check className="h-4 w-4 text-brand-green" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          Copy
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(t)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              active === t
                ? 'bg-brand-orange text-brand-orange-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-border bg-background p-4">
        {active === 'Experience' ? (
          <ul className="flex flex-col gap-2">
            {rewrite.experience.map((e, i) => (
              <li key={i} className="text-sm leading-relaxed text-muted-foreground">
                • {e}
              </li>
            ))}
          </ul>
        ) : active === 'Skills' ? (
          <div className="flex flex-wrap gap-2">
            {rewrite.skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-secondary px-3 py-1 text-sm"
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {rewrite.summary}
          </p>
        )}
      </div>
    </div>
  )
}
