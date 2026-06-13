'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

/**
 * Shows a toast when a non-recruiter is redirected here from a gated
 * /recruiter/* route (?upgrade=recruiter).
 */
export function PricingUpgradeToast() {
  const params = useSearchParams()

  useEffect(() => {
    if (params.get('upgrade') === 'recruiter') {
      toast.info('Upgrade to Recruiter to access this feature.')
    }
  }, [params])

  return null
}
