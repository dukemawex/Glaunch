import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Logo className="mb-6" />
      <p className="text-5xl font-black text-brand-orange">404</p>
      <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className={cn(
          buttonVariants({ size: 'lg' }),
          'mt-6 bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90',
        )}
      >
        Back to home
      </Link>
    </main>
  )
}
