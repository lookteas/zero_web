'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createAwarenessCheck, saveAwarenessCheckChapterScores, submitAwarenessCheckChapter } from '@/lib/api'

export async function createAwarenessCheckAction() {
  try {
    await createAwarenessCheck()
  } catch {
    redirect('/me/awareness-check?error=1')
  }

  revalidatePath('/me/awareness-check')
  redirect('/me/awareness-check?created=1')
}

export async function saveAwarenessCheckChapterScoresAction(formData: FormData) {
  const chapterId = Number(formData.get('chapterId'))
  const awarenessIds = formData.getAll('awarenessId').map((value) => Number(value))
  const scores = awarenessIds.map((awarenessId) => ({
    awarenessId,
    selfScore: Number(formData.get(`selfScore-${awarenessId}`)),
  }))

  if (!Number.isFinite(chapterId) || chapterId <= 0 || scores.some((item) => !Number.isFinite(item.awarenessId) || !Number.isFinite(item.selfScore))) {
    redirect(`/me/awareness-check/chapters/${chapterId || ''}?error=1`)
  }

  try {
    await saveAwarenessCheckChapterScores(chapterId, scores)
  } catch {
    redirect(`/me/awareness-check/chapters/${chapterId}?error=1`)
  }

  revalidatePath('/me/awareness-check')
  revalidatePath(`/me/awareness-check/chapters/${chapterId}`)
  redirect(`/me/awareness-check/chapters/${chapterId}?saved=1`)
}

export async function submitAwarenessCheckChapterAction(formData: FormData) {
  const chapterId = Number(formData.get('chapterId'))
  const awarenessIds = formData.getAll('awarenessId').map((value) => Number(value))
  const scores = awarenessIds.map((awarenessId) => ({
    awarenessId,
    selfScore: Number(formData.get(`selfScore-${awarenessId}`)),
  }))

  if (!Number.isFinite(chapterId) || chapterId <= 0 || scores.some((item) => !Number.isFinite(item.awarenessId) || !Number.isFinite(item.selfScore))) {
    redirect('/me/awareness-check?error=1')
  }

  try {
    await saveAwarenessCheckChapterScores(chapterId, scores)
    await submitAwarenessCheckChapter(chapterId)
  } catch {
    redirect(`/me/awareness-check/chapters/${chapterId}?error=1`)
  }

  revalidatePath('/me/awareness-check')
  revalidatePath(`/me/awareness-check/chapters/${chapterId}`)
  redirect('/me/awareness-check?submitted=1')
}
