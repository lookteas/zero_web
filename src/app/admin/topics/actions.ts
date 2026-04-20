'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { actionErrorCopy, resolveActionErrorMessage } from '@/app/action-copy.mjs'
import { createAdminTopic, updateAdminTopic } from '@/lib/api'
import { requireAdmin } from '@/lib/admin-auth'

function returnWeekStartQuery(formData: FormData) {
  const weekStart = String(formData.get('returnWeekStart') ?? '').trim()
  return weekStart ? `&weekStart=${encodeURIComponent(weekStart)}` : ''
}

function topicPayload(formData: FormData) {
  return {
    title: String(formData.get('title') ?? '').trim(),
    summary: String(formData.get('summary') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    orderNo: Number(formData.get('orderNo') ?? 0),
    status: Number(formData.get('status') ?? 0),
    scheduleDate: String(formData.get('scheduleDate') ?? '').trim(),
  }
}

export async function createTopicAction(formData: FormData) {
  await requireAdmin()
  const returnWeekQuery = returnWeekStartQuery(formData)

  try {
    await createAdminTopic(topicPayload(formData))
  } catch (error) {
    redirect(`/admin/topics?error=${encodeURIComponent(resolveActionErrorMessage(error, actionErrorCopy.topicSaveFailed))}${returnWeekQuery}`)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/topics')
  revalidatePath('/today')
  revalidatePath('/vote')
  redirect(`/admin/topics?saved=1${returnWeekQuery}`)
}

export async function updateTopicAction(formData: FormData) {
  await requireAdmin()
  const topicId = Number(formData.get('topicId') ?? 0)
  const returnWeekQuery = returnWeekStartQuery(formData)

  try {
    await updateAdminTopic(topicId, topicPayload(formData))
  } catch (error) {
    redirect(`/admin/topics?error=${encodeURIComponent(resolveActionErrorMessage(error, actionErrorCopy.topicSaveFailed))}${returnWeekQuery}`)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/topics')
  revalidatePath('/today')
  revalidatePath('/vote')
  redirect(`/admin/topics?updated=1${returnWeekQuery}`)
}
