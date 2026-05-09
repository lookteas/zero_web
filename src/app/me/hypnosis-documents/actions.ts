'use server'

import { cookies } from 'next/headers'

import { apiBaseUrl } from '@/lib/env'

export async function analyzeHypnosisDocumentAction(formData: FormData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('zero_user_id')?.value

  const response = await fetch(`${apiBaseUrl}/hypnosis-documents/analyze`, {
    method: 'POST',
    headers: {
      ...(userId ? { 'X-User-Id': userId } : {}),
    },
    body: formData,
  })

  if (!response.ok) {
    return {
      ok: false,
      message: await response.text(),
    }
  }

  const json = await response.json() as {
    data: {
      speakers: Array<{ name: string; count: number }>
      date: string
      duration: string
    }
  }

  return {
    ok: true,
    data: json.data,
  }
}

export async function standardizeHypnosisDocumentAction(formData: FormData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('zero_user_id')?.value

  const response = await fetch(`${apiBaseUrl}/hypnosis-documents/standardize`, {
    method: 'POST',
    headers: {
      ...(userId ? { 'X-User-Id': userId } : {}),
    },
    body: formData,
  })

  if (!response.ok) {
    return {
      ok: false,
      message: await response.text(),
    }
  }

  const contentType = response.headers.get('content-type') || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  const disposition = response.headers.get('content-disposition') || ''
  const buffer = Buffer.from(await response.arrayBuffer())

  return {
    ok: true,
    contentType,
    disposition,
    base64: buffer.toString('base64'),
  }
}
