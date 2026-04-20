'use server'

import { revalidatePath } from 'next/cache'

import { createDailyTaskLog } from '@/lib/api'
import { serializeAwarenessRecord } from '@/lib/awareness'

function getCurrentLogTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export async function createLogAction(formData: FormData) {
  const taskId = Number(formData.get('taskId'))
  const logTime = getCurrentLogTime()
  const topicTitle = String(formData.get('topicTitle') ?? '')
  const event = String(formData.get('event') ?? '')
  const change = String(formData.get('change') ?? '')
  const note = String(formData.get('note') ?? '')

  const awareness = serializeAwarenessRecord({
    topicTitle,
    person: '',
    event,
    object: '',
    emotion: '',
    change,
    note,
  })

  await createDailyTaskLog(taskId, {
    logTime,
    actionText: awareness.actionText,
    status: awareness.status,
    remark: awareness.remark,
  })

  revalidatePath('/logs')
  revalidatePath('/')
}
