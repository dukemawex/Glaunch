'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

/**
 * Shows a success toast after returning from Paddle checkout (?upgraded=true),
 * then cleans the query param so a refresh doesn't repeat it.
 */
export function DashboardUpgradeToast() {
  const params = useSearchParams()
  const router = useRouter()
  const shown = useRef(false)

  useEffect(() => {
    if (params.get('upgraded') === 'true' && !shown.current) {
      shown.current = true
      toast.success(
        'Welcome to Glaunch Recruiter! Your account has been upgraded.',
      )
      router.replace('/dashboard')
    }
  }, [params, router])

  return null
}
