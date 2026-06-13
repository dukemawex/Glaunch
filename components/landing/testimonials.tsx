'use client'

import { useState } from 'react'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Testimonial = {
  quote: string
  name: string
  role: string
  country: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Glaunch rewrote my resume and my ATS score jumped from 54 to 89. Two weeks later I had an internship offer at a fintech.',
    name: 'Amara Okafor',
    role: 'Software Engineering Intern',
    country: 'Nigeria',
  },
  {
    quote:
      'I stopped spraying applications everywhere. Smart Matching showed me where I actually fit and my response rate tripled.',
    name: 'Sofia Reyes',
    role: 'Product Designer',
    country: 'Mexico',
  },
  {
    quote:
      'The interview coach asked me questions I actually got asked in my real interview. I went in prepared.',
    name: 'Arjun Mehta',
    role: 'Data Analyst',
    country: 'India',
  },
  {
    quote:
      'Got my first job offer 3 weeks after signing up. The AI resume rewrite was the game changer.',
    name: 'Lena Kowalski',
    role: 'Operations Analyst',
    country: 'Poland',
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
}

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const total = TESTIMONIALS.length

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total)
  const active = TESTIMONIALS[index]

  return (
    <section className="border-t border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-brand-green">
          Real Launches
        </p>
        <h2 className="mt-3 text-balance text-3xl font-black tracking-tight md:text-5xl">
          Careers launched around the world
        </h2>

        <div className="relative mt-12">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
            <Quote className="mx-auto h-10 w-10 text-brand-orange" aria-hidden />
            <blockquote className="mt-6 text-balance text-xl font-medium leading-relaxed text-foreground md:text-2xl">
              {`"${active.quote}"`}
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-base font-bold text-brand-orange-foreground">
                {initials(active.name)}
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">{active.name}</p>
                <p className="text-sm text-muted-foreground">
                  {active.role} · {active.country}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    'h-2.5 rounded-full transition-all',
                    i === index
                      ? 'w-6 bg-brand-orange'
                      : 'w-2.5 bg-border hover:bg-muted-foreground',
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
