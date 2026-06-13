/**
 * Seed the jobs into the single DynamoDB table.
 *
 * Run with:  pnpm tsx scripts/seed-jobs.ts
 *
 * Requires the following env vars (provided by the Vercel AWS + DynamoDB
 * integration at runtime, or set locally for a one-off run):
 *   DYNAMODB_TABLE_NAME
 *   AWS_REGION
 *   AWS_ROLE_ARN          (OIDC role) — or a local AWS credential profile
 *
 * If you cannot run this locally, hit the guarded API route instead:
 *   POST /api/admin/seed   with header  x-seed-secret: <SEED_SECRET>
 */
import { putJob } from '../lib/data'
import { SEED_JOBS } from '../lib/seed-data'

async function main() {
  if (!process.env.DYNAMODB_TABLE_NAME) {
    throw new Error('DYNAMODB_TABLE_NAME is not set.')
  }

  console.log(`Seeding ${SEED_JOBS.length} jobs into "${process.env.DYNAMODB_TABLE_NAME}"...`)

  let ok = 0
  for (const job of SEED_JOBS) {
    try {
      await putJob(job)
      ok += 1
      console.log(`  ✓ ${job.company} — ${job.title}`)
    } catch (err) {
      console.error(`  ✗ ${job.company} — ${job.title}:`, (err as Error).message)
    }
  }

  console.log(`Done. Seeded ${ok}/${SEED_JOBS.length} jobs.`)
  process.exit(ok === SEED_JOBS.length ? 0 : 1)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
