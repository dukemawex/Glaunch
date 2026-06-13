'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard,
  FileText,
  Target,
  Send,
  MessageSquare,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/resume', label: 'Resume AI', icon: FileText },
  { href: '/matches', label: 'Matches', icon: Target },
  { href: '/apply', label: 'Applications', icon: Send },
  { href: '/interview', label: 'Interview', icon: MessageSquare },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/dashboard">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const Icon = link.icon
            const active =
              pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand-orange/10 text-brand-orange'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <UserButton />
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-2 py-2 md:hidden">
        {LINKS.map((link) => {
          const Icon = link.icon
          const active =
            pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                active
                  ? 'bg-brand-orange/10 text-brand-orange'
                  : 'text-muted-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
