'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const FIELD =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-orange focus:outline-none'

export function PostJobForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    setLoading(true)
    try {
      const res = await fetch('/api/recruiter/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Could not post job')
      toast.success('Job posted. Candidates can now apply.')
      form.reset()
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
    >
      <h2 className="text-lg font-bold">Post a new job</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Job title
          <input name="title" required placeholder="Frontend Engineer" className={FIELD} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Company
          <input name="company" required placeholder="Acme Inc." className={FIELD} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Location
          <input name="location" placeholder="Remote (Global)" className={FIELD} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Sector
          <input name="sector" placeholder="Fintech" className={FIELD} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
          Application URL
          <input
            name="url"
            type="url"
            placeholder="https://company.com/careers/123"
            className={FIELD}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
          Skills / tags (comma separated)
          <input
            name="tags"
            placeholder="React, TypeScript, SQL"
            className={FIELD}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
          Description
          <textarea
            name="description"
            rows={4}
            placeholder="What the role involves and who you're looking for..."
            className={FIELD}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center rounded-lg bg-brand-orange px-4 text-sm font-bold text-brand-orange-foreground transition-colors hover:bg-brand-orange/90 disabled:opacity-60 sm:w-auto sm:self-start sm:px-8"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publish job'}
      </button>
    </form>
  )
}
