import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('size-7', className)}
      role="img"
      aria-label="AfriLaunch logo"
      fill="none"
    >
      {/* orange rocket / upward triangle */}
      <path
        d="M16 2.5 L27 27 L16 21.5 L5 27 Z"
        fill="#e85d27"
      />
      <path d="M16 2.5 L16 21.5 L5 27 Z" fill="#c64a1c" />
    </svg>
  )
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string
  markClassName?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark className={markClassName} />
      <span className="text-lg font-black tracking-tight">
        <span className="text-foreground">Afri</span>
        <span className="text-brand-orange">Launch</span>
      </span>
    </span>
  )
}
