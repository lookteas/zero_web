'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { actionErrorCopy, resolveActionErrorMessage } from '@/app/action-copy.mjs'
import { createCurrentWeeklyVoteRecord } from '@/lib/api'

export async function submitVoteAction(formData: FormData) {
  const candidateId = Number(formData.get('candidateId'))

  try {
    await createCurrentWeeklyVoteRecord(candidateId)
  } catch (error) {
    const params = new URLSearchParams()
    params.set('error', resolveActionErrorMessage(error, actionErrorCopy.voteSubmitFailed))
    redirect(`/vote?${params.toString()}`)
  }

  revalidatePath('/vote')
  revalidatePath('/discussion')
  revalidatePath('/')
  redirect('/vote?voted=1')
}
