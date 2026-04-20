'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { actionErrorCopy, resolveActionErrorMessage } from '@/app/action-copy.mjs'
import { createAdminDiscussion, updateAdminDiscussion } from '@/lib/api'
import { requireAdmin } from '@/lib/admin-auth'

function updatePayload(formData: FormData) {
  return {
    discussionTitle: String(formData.get('discussionTitle') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    goals: String(formData.get('goals') ?? '').trim(),
    meetingTime: String(formData.get('meetingTime') ?? '').trim(),
    meetingLink: String(formData.get('meetingLink') ?? '').trim(),
    shareText: String(formData.get('shareText') ?? '').trim(),
    status: String(formData.get('status') ?? 'published').trim(),
    adminRemark: String(formData.get('adminRemark') ?? '').trim(),
  }
}

export async function saveDiscussionAction(formData: FormData) {
  await requireAdmin()

  const discussionId = Number(formData.get('discussionId') ?? 0)

  try {
    if (discussionId > 0) {
      await updateAdminDiscussion(discussionId, updatePayload(formData))
    } else {
      await createAdminDiscussion({
        weekStartDate: String(formData.get('weekStartDate') ?? '').trim(),
        topicId: Number(formData.get('topicId') ?? 0),
        topicTitle: String(formData.get('topicTitle') ?? '').trim(),
        ...updatePayload(formData),
      })
    }
  } catch (error) {
    redirect(`/admin/discussions?error=${encodeURIComponent(resolveActionErrorMessage(error, actionErrorCopy.discussionSaveFailed))}`)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/discussions')
  revalidatePath('/discussion')
  revalidatePath('/')
  redirect('/admin/discussions?saved=1')
}