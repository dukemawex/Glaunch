'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface NamedCount {
  name: string
  count: number
}

interface VolumePoint {
  date: string
  count: number
}

export function AnalyticsCharts({
  skills,
  countries,
  volume,
}: {
  skills: NamedCount[]
  countries: NamedCount[]
  volume: VolumePoint[]
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Top applicant skills</CardTitle>
          <CardDescription>
            Most common skills across your applicant pool
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <EmptyState />
          ) : (
            <ChartContainer
              config={{
                count: { label: 'Applicants', color: 'var(--chart-1)' },
              }}
              className="max-h-72 w-full"
            >
              <BarChart
                accessibilityLayer
                data={skills}
                layout="vertical"
                margin={{ left: 12 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" dataKey="count" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top candidate countries</CardTitle>
          <CardDescription>Where your applicants are based</CardDescription>
        </CardHeader>
        <CardContent>
          {countries.length === 0 ? (
            <EmptyState />
          ) : (
            <ChartContainer
              config={{
                count: { label: 'Applicants', color: 'var(--chart-2)' },
              }}
              className="max-h-72 w-full"
            >
              <BarChart
                accessibilityLayer
                data={countries}
                layout="vertical"
                margin={{ left: 12 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" dataKey="count" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Application volume over time</CardTitle>
          <CardDescription>
            Applications received to your job listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {volume.length === 0 ? (
            <EmptyState />
          ) : (
            <ChartContainer
              config={{
                count: { label: 'Applications', color: 'var(--chart-1)' },
              }}
              className="max-h-72 w-full"
            >
              <LineChart
                accessibilityLayer
                data={volume}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
      No applicant data yet. Data appears as students apply to your jobs.
    </div>
  )
}
