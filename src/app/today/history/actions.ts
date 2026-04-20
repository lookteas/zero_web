'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { updateDailyTask } from '@/lib/api'

import { buildHistoryQueryString } from './history-filters.mjs'

function historyFiltersFromFormData(formData: FormData) {
  return {
    startDate: String(formData.get('startDate') ?? ''),
    endDate: String(formData.get('endDate') ?? ''),
    keyword: String(formData.get('keyword') ?? ''),
  }
}

export async function saveHistoryTaskAction(formData: FormData) {
  const taskId = Number(formData.get('taskId'))
  const filters = historyFiltersFromFormData(formData)

  await updateDailyTask(taskId, {
    weakness: String(formData.get('weakness') ?? ''),
    improvementPlan: String(formData.get('improvementPlan') ?? ''),
    verificationPath: String(formData.get('verificationPath') ?? ''),
  })

  revalidatePath('/today')
  revalidatePath('/today/history')
  revalidatePath('/')
  redirect(`/today/history${buildHistoryQueryString(filters, { saved: '1', openTask: String(taskId) })}#task-${taskId}`)
}

export async function saveHistoryReflectionAction(formData: FormData) {
  const taskId = Number(formData.get('taskId'))
  const filters = historyFiltersFromFormData(formData)

  await updateDailyTask(taskId, {
    reflectionNote: String(formData.get('reflectionNote') ?? ''),
  })

  revalidatePath('/today/history')
  revalidatePath('/')
  redirect(`/today/history${buildHistoryQueryString(filters, { reflected: '1', openTask: String(taskId) })}#task-${taskId}`)
}
