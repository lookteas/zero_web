'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { submitDailyTask, updateDailyTask } from '@/lib/api'

export async function saveTodayTaskAction(formData: FormData) {
  const taskId = Number(formData.get('taskId'))
  const weakness = String(formData.get('weakness') ?? '')
  const improvementPlan = String(formData.get('improvementPlan') ?? '')
  const verificationPath = String(formData.get('verificationPath') ?? '')

  await updateDailyTask(taskId, {
    weakness,
    improvementPlan,
    verificationPath,
  })

  revalidatePath('/today')
  revalidatePath('/')
  redirect('/today?saved=1')
}

export async function submitTodayTaskAction(formData: FormData) {
  const taskId = Number(formData.get('taskId'))

  try {
    await submitDailyTask(taskId)
  } catch {
    redirect('/today?error=1')
  }

  revalidatePath('/today')
  revalidatePath('/')
  revalidatePath('/reviews')
  redirect('/today?submitted=1')
}