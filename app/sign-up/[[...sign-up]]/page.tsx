import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <Link href="/">
        <Logo />
      </Link>
      <div className="text-center">
        <h1 className="text-2xl font-black tracking-tight">
          Create your Glaunch account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your career, launched. Free forever for students.
        </p>
      </div>
      <SignUp
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
