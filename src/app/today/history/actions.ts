'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { updateDailyTask, submitDailyTask } from '@/lib/api'

export async function saveHistoryTaskAction(formData: FormData) {
  const taskId = Number(formData.get('taskId'))

  await updateDailyTask(taskId, {
    weakness: String(formData.get('weakness') ?? ''),
    improvementPlan: String(formData.get('improvementPlan') ?? ''),
    verificationPath: String(formData.get('verificationPath') ?? ''),
  })

  revalidatePath('/today')
  revalidatePath('/today/history')
  revalidatePath('/')
  redirect(`/today/history?saved=1&openTask=${taskId}#task-${taskId}`)
}

export async function submitHistoryTaskAction(formData: FormData) {
  const taskId = Number(formData.get('taskId'))

  try {
    await updateDailyTask(taskId, {
      weakness: String(formData.get('weakness') ?? ''),
      improvementPlan: String(formData.get('improvementPlan') ?? ''),
      verificationPath: String(formData.get('verificationPath') ?? ''),
    })
    await submitDailyTask(taskId)
  } catch {
    redirect(`/today/history?error=1&openTask=${taskId}#task-${taskId}`)
  }

  revalidatePath('/today')
  revalidatePath('/today/history')
  revalidatePath('/')
  revalidatePath('/reviews')
  redirect(`/today/history?submitted=1&openTask=${taskId}#task-${taskId}`)
}

export async function saveHistoryReflectionAction(formData: FormData) {
  const taskId = Number(formData.get('taskId'))

  await updateDailyTask(taskId, {
    reflectionNote: String(formData.get('reflectionNote') ?? ''),
  })

  revalidatePath('/today/history')
  revalidatePath('/')
  redirect(`/today/history?reflected=1&openTask=${taskId}#task-${taskId}`)
}
