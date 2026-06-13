import { cn } from '@/lib/utils'

/** Colored match-score pill: green (strong), orange (mid), muted (low). */
export function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 80
      ? 'bg-brand-green/15 text-brand-green'
      : score >= 50
        ? 'bg-brand-orange/15 text-brand-orange'
        : 'bg-secondary text-muted-foreground'

  return (
    <span
      className={cn(
        'shrink-0 rounded-full px-3 py-1 text-sm font-bold tabular-nums',
        tone,
      )}
    >
      {score}%
    </span>
  )
}
