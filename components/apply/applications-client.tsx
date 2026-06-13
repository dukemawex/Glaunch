'use client'

import { useState } from 'react'
import { ExternalLink, Loader2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { ApplicationRecord, ApplicationStatus } from '@/lib/types'

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  applied: 'bg-brand-green/15 text-brand-green',
  pending: 'bg-yellow-500/15 text-yellow-500',
  failed: 'bg-destructive/15 text-destructive',
}

const FILTERS: Array<{ label: string; value: ApplicationStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Applied', value: 'applied' },
  { label: 'Failed', value: 'failed' },
]

export function ApplicationsClient({
  initialApplications,
}: {
  initialApplications: ApplicationRecord[]
}) {
  const [apps, setApps] = useState(initialApplications)
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function updateStatus(
    app: ApplicationRecord,
    status: ApplicationStatus,
  ) {
    setUpdatingId(app.applicationId)
    try {
      const res = await fetch(`/api/apply/${encodeURIComponent(app.jobId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: app.applicationId, status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')
      setApps((prev) =>
        prev.map((a) =>
          a.applicationId === app.applicationId ? { ...a, status } : a,
        ),
      )
      toast.success(`Marked as ${status}.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setUpdatingId(null)
    }
  }

  const visible =
    filter === 'all' ? apps : apps.filter((a) => a.status === filter)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              filter === f.value
                ? 'bg-brand-orange text-brand-orange-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-semibold">No applications here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use Auto-Apply on the Matches page to start tracking applications.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="p-4 font-medium">Job Title</th>
                <th className="p-4 font-medium">Company</th>
                <th className="p-4 font-medium">Source</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => (
                <tr key={a.applicationId} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{a.jobTitle}</td>
                  <td className="p-4 text-muted-foreground">{a.company}</td>
                  <td className="p-4 text-muted-foreground">{a.source}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
                        STATUS_STYLES[a.status],
                      )}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(a.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={a.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View job"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors hover:border-brand-orange"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      {a.status !== 'applied' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(a, 'applied')}
                          disabled={updatingId === a.applicationId}
                          aria-label="Mark as applied"
                          className="flex h-8 items-center gap-1 rounded-lg bg-brand-green/15 px-2.5 text-xs font-semibold text-brand-green disabled:opacity-50"
                        >
                          {updatingId === a.applicationId ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Applied
                        </button>
                      )}
                      {a.status !== 'failed' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(a, 'failed')}
                          disabled={updatingId === a.applicationId}
                          aria-label="Mark as failed"
                          className="flex h-8 items-center gap-1 rounded-lg bg-destructive/15 px-2.5 text-xs font-semibold text-destructive disabled:opacity-50"
                        >
                          <X className="h-3.5 w-3.5" />
                          Failed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
