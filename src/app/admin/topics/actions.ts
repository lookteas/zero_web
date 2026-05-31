'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { actionErrorCopy, resolveActionErrorMessage } from '@/app/action-copy.mjs'
import { createAdminTopic, excludeAdminAwareness, insertAdminAwareness, updateAdminAwareness, updateAdminAwarenessCycle, updateAdminTopic } from '@/lib/api'
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

function pausedDatesPayload(formData: FormData) {
  return String(formData.get('pausedDates') ?? '')
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
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

export async function updateAwarenessCycleAction(formData: FormData) {
  await requireAdmin()
  const returnWeekQuery = returnWeekStartQuery(formData)
  const startDate = String(formData.get('startDate') ?? '').trim()
  const restDays = Number(formData.get('restDays') ?? 7)
  const pausedDates = pausedDatesPayload(formData)

  try {
    await updateAdminAwarenessCycle({ startDate, restDays, pausedDates })
  } catch (error) {
    redirect(`/admin/topics?error=${encodeURIComponent(resolveActionErrorMessage(error, actionErrorCopy.topicSaveFailed))}${returnWeekQuery}`)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/topics')
  revalidatePath('/today')
  redirect(`/admin/topics?cycleUpdated=1${returnWeekQuery}`)
}

export async function updateAwarenessAction(formData: FormData) {
  await requireAdmin()
  const awarenessId = Number(formData.get('awarenessId') ?? 0)
  const returnWeekQuery = returnWeekStartQuery(formData)
  const payload = {
    title: String(formData.get('title') ?? '').trim(),
    summary: String(formData.get('summary') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    effectiveDate: String(formData.get('effectiveDate') ?? '').trim(),
  }

  try {
    await updateAdminAwareness(awarenessId, payload)
  } catch (error) {
    redirect(`/admin/topics?error=${encodeURIComponent(resolveActionErrorMessage(error, actionErrorCopy.topicSaveFailed))}${returnWeekQuery}`)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/topics')
  revalidatePath('/today')
  redirect(`/admin/topics?updated=1${returnWeekQuery}`)
}

export async function excludeAwarenessAction(formData: FormData) {
  await requireAdmin()
  const awarenessId = Number(formData.get('awarenessId') ?? 0)
  const returnWeekQuery = returnWeekStartQuery(formData)
  const effectiveDate = String(formData.get('effectiveDate') ?? '').trim()

  try {
    await excludeAdminAwareness(awarenessId, { effectiveDate })
  } catch (error) {
    redirect(`/admin/topics?error=${encodeURIComponent(resolveActionErrorMessage(error, actionErrorCopy.topicSaveFailed))}${returnWeekQuery}`)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/topics')
  revalidatePath('/today')
  redirect(`/admin/topics?updated=1${returnWeekQuery}`)
}

export async function insertAwarenessAction(formData: FormData) {
  await requireAdmin()
  const returnWeekQuery = returnWeekStartQuery(formData)
  const existingAwarenessId = Number(formData.get('existingAwarenessId') ?? 0)
  const payload = {
    existingAwarenessId: existingAwarenessId > 0 ? existingAwarenessId : undefined,
    title: String(formData.get('title') ?? '').trim(),
    summary: String(formData.get('summary') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    effectiveDate: String(formData.get('effectiveDate') ?? '').trim(),
  }

  try {
    await insertAdminAwareness(payload)
  } catch (error) {
    redirect(`/admin/topics?error=${encodeURIComponent(resolveActionErrorMessage(error, actionErrorCopy.topicSaveFailed))}${returnWeekQuery}`)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/topics')
  revalidatePath('/today')
  redirect(`/admin/topics?updated=1${returnWeekQuery}`)
}
