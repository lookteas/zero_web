'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createRecoveryReview, createReviewRecord } from '@/lib/api'

export async function submitReviewAction(formData: FormData) {
  const reviewItemId = Number(formData.get('reviewItemId'))
  const result = String(formData.get('result') ?? 'partial')
  const actualSituation = String(formData.get('actualSituation') ?? '')
  const suggestion = String(formData.get('suggestion') ?? '')

  await createReviewRecord(reviewItemId, {
    result,
    actualSituation,
    suggestion,
  })

  revalidatePath('/reviews')
  revalidatePath('/reviews/history')
  revalidatePath('/')
  redirect('/reviews?submitted=1')
}

export async function submitRecoveryReviewAction(formData: FormData) {
  const reviewItemIds = String(formData.get('reviewItemIds') ?? '')
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value > 0)
  const result = String(formData.get('result') ?? 'partial')
  const actualSituation = String(formData.get('actualSituation') ?? '')
  const suggestion = String(formData.get('suggestion') ?? '')

  await createRecoveryReview({
    reviewItemIds,
    result,
    actualSituation,
    suggestion,
  })

  revalidatePath('/reviews')
  revalidatePath('/reviews/history')
  revalidatePath('/')
  redirect('/reviews?submitted=1')
}
