'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.log('[v0] page error boundary:', error.message)
  }, [error])

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Logo className="mb-6" />
      <h1 className="text-2xl font-black sm:text-3xl">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        We hit an unexpected error while loading this page. Try again — if it
        keeps happening, refresh in a moment.
      </p>
      <Button
        onClick={reset}
        className="mt-6 bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
        size="lg"
      >
        Try again
      </Button>
    </main>
  )
}
