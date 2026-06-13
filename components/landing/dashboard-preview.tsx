import { Lock } from 'lucide-react'

const STATS = [
  { label: 'ATS Score', value: '82' },
  { label: 'Matches', value: '37' },
  { label: 'Applications', value: '12' },
]

const TOP_MATCHES = [
  { title: 'Frontend Engineer', company: 'Paystack', score: 94 },
  { title: 'Data Analyst', company: 'Flutterwave', score: 88 },
  { title: 'Product Designer', company: 'Andela', score: 81 },
]

export function DashboardPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-green">
        Your command center
      </p>
      <h2 className="mt-3 text-center text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
        A dashboard that does the hustle with you
      </h2>

      <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* browser chrome */}
        <div className="flex items-center gap-3 border-b border-border bg-secondary/50 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-destructive/70" />
            <span className="size-3 rounded-full bg-brand-orange/70" />
            <span className="size-3 rounded-full bg-brand-green/70" />
          </div>
          <div className="flex flex-1 items-center justify-center gap-2 rounded-md bg-background/60 px-3 py-1.5 text-xs text-muted-foreground">
            <Lock className="size-3" />
            app.afrilaunch.io/dashboard
          </div>
        </div>

        {/* dashboard body */}
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-black sm:text-2xl">
              Welcome back, Amara O.
            </h3>
            <span className="rounded-full bg-brand-green/15 px-3 py-1 text-xs font-semibold text-brand-green">
              Profile 86% complete
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-secondary/40 p-4"
              >
                <p className="text-2xl font-black sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-muted-foreground">
              Top matched jobs
            </p>
            <div className="flex flex-col gap-2">
              {TOP_MATCHES.map((m) => (
                <div
                  key={m.title}
                  className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">{m.title}</p>
                    <p className="text-sm text-muted-foreground">{m.company}</p>
                  </div>
                  <span className="rounded-full bg-brand-green/15 px-3 py-1 text-sm font-bold text-brand-green">
                    {m.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
