import { getAuthedUser, unauthorized } from '@/lib/api-auth'
import { getUser, putUser, updateUser } from '@/lib/data'
import type { UserRecord } from '@/lib/types'

export const runtime = 'nodejs'

/** Fetch the signed-in user's record, creating a default one on first access. */
export async function GET() {
  try {
    const authed = await getAuthedUser()
    if (!authed) return unauthorized()

    let user = await getUser(authed.userId)
    if (!user) {
      const fresh: UserRecord = {
        userId: authed.userId,
        email: authed.email,
        fullName: authed.fullName || 'New User',
        country: '',
        role: 'student',
        plan: 'free',
        atsScore: 0,
        profileComplete: 0,
        createdAt: new Date().toISOString(),
      }
      await putUser(fresh)
      user = fresh
    }

    return Response.json({ user })
  } catch (err) {
    console.log('[v0] GET profile error:', (err as Error).message)
    return Response.json({ error: 'Failed to load profile.' }, { status: 500 })
  }
}

/** Update editable fields on the user's record. */
export async function PATCH(req: Request) {
  try {
    const authed = await getAuthedUser()
    if (!authed) return unauthorized()

    const body = (await req.json()) as Partial<UserRecord>

    const allowed: (keyof UserRecord)[] = [
      'fullName',
      'country',
      'university',
      'graduationYear',
      'fieldOfStudy',
      'company',
      'companySize',
      'hiringRoles',
      'role',
      'profileComplete',
    ]
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    // Ensure a record exists before patching.
    const existing = await getUser(authed.userId)
    if (!existing) {
      const fresh: UserRecord = {
        userId: authed.userId,
        email: authed.email,
        fullName: (body.fullName as string) || authed.fullName || 'New User',
        country: (body.country as string) || '',
        role: (body.role as UserRecord['role']) || 'student',
        plan: 'free',
        atsScore: 0,
        profileComplete: (body.profileComplete as number) || 0,
        createdAt: new Date().toISOString(),
        university: body.university,
        graduationYear: body.graduationYear,
        fieldOfStudy: body.fieldOfStudy,
        company: body.company,
        companySize: body.companySize,
        hiringRoles: body.hiringRoles,
      }
      await putUser(fresh)
      return Response.json({ user: fresh })
    }

    const user = await updateUser(authed.userId, updates)
    return Response.json({ user })
  } catch (err) {
    console.log('[v0] PATCH profile error:', (err as Error).message)
    return Response.json({ error: 'Failed to update profile.' }, { status: 500 })
  }
}
