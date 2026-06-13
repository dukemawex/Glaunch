function colorFor(score: number) {
  if (score > 70) return '#22c55e'
  if (score >= 50) return '#e85d27'
  return '#ef4444'
}

export function ScoreRing({ score }: { score: number }) {
  const radius = 70
  const stroke = 12
  const normalized = radius - stroke / 2
  const circumference = 2 * Math.PI * normalized
  const clamped = Math.max(0, Math.min(100, score))
  const offset = circumference - (clamped / 100) * circumference
  const color = colorFor(clamped)

  return (
    <div className="relative flex h-[160px] w-[160px] items-center justify-center">
      <svg height={160} width={160} className="-rotate-90">
        <circle
          cx={80}
          cy={80}
          r={normalized}
          fill="transparent"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={80}
          cy={80}
          r={normalized}
          fill="transparent"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black" style={{ color }}>
          {clamped}
        </span>
        <span className="text-xs text-muted-foreground">ATS Score</span>
      </div>
    </div>
  )
}
