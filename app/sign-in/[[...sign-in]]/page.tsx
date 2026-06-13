import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <Link href="/">
        <Logo />
      </Link>
      <SignIn
        appearance={{
          elements: {
            rootBox: 'w-full flex justify-center',
            card: 'bg-card border border-border shadow-xl',
          },
        }}
      />
    </main>
  )
}
