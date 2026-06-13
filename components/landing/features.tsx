import { FileText, Target, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    icon: FileText,
    title: 'Resume AI',
    accent: 'orange' as const,
    body: 'Upload your CV and get an instant ATS score, extracted skills, and concrete rewrites that get you past the bots and in front of recruiters.',
  },
  {
    icon: Target,
    title: 'Smart Matching',
    accent: 'orange' as const,
    body: 'Our engine reads your profile and ranks real internships and entry-level roles by genuine fit — so you only apply where you can win.',
  },
  {
    icon: MessageSquare,
    title: 'Interview Coach',
    accent: 'green' as const,
    body: 'Practice role-specific questions, submit your answers, and get AI feedback with a score history so you walk in ready and confident.',
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
        Three tools. One unfair advantage.
      </h2>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex flex-col rounded-2xl border border-border bg-card p-7 transition-colors hover:border-border/80"
          >
            <span
              className={cn(
                'inline-flex size-12 items-center justify-center rounded-xl',
                f.accent === 'orange'
                  ? 'bg-brand-orange/15 text-brand-orange'
                  : 'bg-brand-green/15 text-brand-green',
              )}
            >
              <f.icon className="size-6" />
            </span>
            <h3 className="mt-5 text-xl font-bold">{f.title}</h3>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
