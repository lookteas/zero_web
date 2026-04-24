'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { actionErrorCopy, resolveActionErrorMessage } from '@/app/action-copy.mjs'
import { updateAdminUser } from '@/lib/api'
import { requireAdmin } from '@/lib/admin-auth'

function buildReturnQuery(formData: FormData) {
  const params = new URLSearchParams()
  const keyword = String(formData.get('returnKeyword') ?? '').trim()
  const status = String(formData.get('returnStatus') ?? '').trim()

  if (keyword) params.set('keyword', keyword)
  if (status === '0' || status === '1') params.set('status', status)

  const query = params.toString()
  return query ? `&${query}` : ''
}

function userPayload(formData: FormData) {
  return {
    nickname: String(formData.get('nickname') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    mobile: String(formData.get('mobile') ?? '').trim(),
    avatar: String(formData.get('avatar') ?? '').trim(),
    status: Number(formData.get('status') ?? 0),
  }
}

export async function updateUserAction(formData: FormData) {
  await requireAdmin()

  const userId = Number(formData.get('userId') ?? 0)
  const returnQuery = buildReturnQuery(formData)

  try {
    await updateAdminUser(userId, userPayload(formData))
  } catch (error) {
    redirect(`/admin/users?error=${encodeURIComponent(resolveActionErrorMessage(error, actionErrorCopy.userSaveFailed))}${returnQuery}`)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/users')
  redirect(`/admin/users?saved=1${returnQuery}`)
}
