'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createFreemodePractice, updateFreemodePractice } from '@/lib/api'

export async function createFreemodePracticeAction(formData: FormData) {
  const chapterId = Number(formData.get('chapterId'))
  const awarenessId = Number(formData.get('awarenessId'))
  const practiceNote = String(formData.get('practiceNote') ?? '').trim()

  if (!Number.isFinite(chapterId) || !Number.isFinite(awarenessId) || chapterId <= 0 || awarenessId <= 0) {
    redirect('/freemode?error=1')
  }

  let createdPracticeId = 0
  try {
    const created = await createFreemodePractice({
      chapterId,
      awarenessId,
      practiceNote: practiceNote || undefined,
    })
    createdPracticeId = created.practiceId
  } catch {
    redirect('/freemode?error=1')
  }

  revalidatePath('/freemode')
  redirect(`/freemode?created=1&practiceId=${createdPracticeId}#recent-practices`)
}

export async function updateFreemodePracticeAction(formData: FormData) {
  const practiceId = Number(formData.get('practiceId'))
  const practiceNote = String(formData.get('practiceNote') ?? '').trim()

  if (!Number.isFinite(practiceId) || practiceId <= 0) {
    redirect('/freemode?error=1')
  }

  try {
    await updateFreemodePractice(practiceId, {
      practiceNote: practiceNote || undefined,
    })
  } catch {
    redirect('/freemode?error=1')
  }

  revalidatePath('/freemode')
  redirect(`/freemode?updated=1&practiceId=${practiceId}#recent-practices`)
}
