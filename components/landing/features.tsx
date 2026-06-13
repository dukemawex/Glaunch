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
      <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-orange">
        The toolkit
      </p>
      <h2 className="mt-3 text-balance text-center text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
        Three tools. One unfair advantage.
      </h2>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-2xl hover:shadow-black/40"
          >
            <span
              aria-hidden
              className={cn(
                'absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                f.accent === 'orange'
                  ? 'bg-gradient-to-r from-transparent via-brand-orange to-transparent'
                  : 'bg-gradient-to-r from-transparent via-brand-green to-transparent',
              )}
            />
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100',
                f.accent === 'orange'
                  ? 'bg-brand-orange/20'
                  : 'bg-brand-green/20',
              )}
            />
            <span
              className={cn(
                'inline-flex size-12 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110',
                f.accent === 'orange'
                  ? 'bg-brand-orange/15 text-brand-orange ring-brand-orange/20'
                  : 'bg-brand-green/15 text-brand-green ring-brand-green/20',
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
