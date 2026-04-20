'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { apiBaseUrl } from '@/lib/env'

import { requestAuth } from './auth-request.mjs'

function isEmail(value: string) {
  return value.includes('@')
}

function isMobile(value: string) {
  return /^1\d{10}$/.test(value)
}

async function setLoginCookies(json: { data: { user: { id: number | string; account: string } } }) {
  const cookieStore = await cookies()
  cookieStore.set('zero_user_id', String(json.data.user.id), { httpOnly: true, path: '/' })
  cookieStore.set('zero_user_account', String(json.data.user.account), { httpOnly: true, path: '/' })
}

export async function loginAction(formData: FormData) {
  const account = String(formData.get('account') ?? '').trim()
  const password = String(formData.get('password') ?? '').trim()

  if (password.length < 6) {
    redirect('/login?loginError=1')
  }

  const json = await requestAuth(apiBaseUrl, '/auth/login', { account, password })

  if (!json) {
    redirect('/login?loginError=1')
  }

  await setLoginCookies(json)
  redirect('/')
}

export async function registerAction(formData: FormData) {
  const account = String(formData.get('account') ?? '').trim()
  const password = String(formData.get('password') ?? '').trim()
  const nickname = String(formData.get('nickname') ?? '').trim()

  if (password.length < 6) {
    redirect('/login?registerError=1')
  }

  if (!isEmail(account) && !isMobile(account) && account.length <= 3) {
    redirect('/login?registerError=1')
  }

  const payload: Record<string, string> = {
    account,
    password,
    nickname: nickname || account,
  }

  if (isEmail(account)) {
    payload.email = account
  }

  if (isMobile(account)) {
    payload.mobile = account
  }

  const json = await requestAuth(apiBaseUrl, '/auth/register', payload)

  if (!json) {
    redirect('/login?registerError=1')
  }

  await setLoginCookies(json)
  redirect('/')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('zero_user_id')
  cookieStore.delete('zero_user_account')
  redirect('/login')
}
