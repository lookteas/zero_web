'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createFreemodePractice } from '@/lib/api'

export async function createFreemodePracticeAction(formData: FormData) {
  const chapterId = Number(formData.get('chapterId'))
  const awarenessId = Number(formData.get('awarenessId'))
  const practiceNote = String(formData.get('practiceNote') ?? '').trim()

  if (!Number.isFinite(chapterId) || !Number.isFinite(awarenessId) || chapterId <= 0 || awarenessId <= 0) {
    redirect('/freemode?error=1')
  }

  try {
    await createFreemodePractice({
      chapterId,
      awarenessId,
      practiceNote: practiceNote || undefined,
    })
  } catch {
    redirect('/freemode?error=1')
  }

  revalidatePath('/freemode')
  redirect('/freemode?created=1#recent-practices')
}
