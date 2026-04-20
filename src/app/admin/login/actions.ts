'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { apiBaseUrl } from '@/lib/env'

import { requestAuth } from '@/app/login/auth-request.mjs'

async function setAdminCookies(json: { data: { user: { id: number | string; account: string } } }) {
  const cookieStore = await cookies()
  cookieStore.set('zero_admin_id', String(json.data.user.id), { httpOnly: true, path: '/' })
  cookieStore.set('zero_admin_name', String(json.data.user.account), { httpOnly: true, path: '/' })
}

export async function adminLoginAction(formData: FormData) {
  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '').trim()

  if (!username || password.length < 6) {
    redirect('/admin/login?loginError=1')
  }

  const json = await requestAuth(apiBaseUrl, '/admin/auth/login', { username, password })
  if (!json) {
    redirect('/admin/login?loginError=1')
  }

  await setAdminCookies(json)
  redirect('/admin')
}

export async function adminLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('zero_admin_id')
  cookieStore.delete('zero_admin_name')
  redirect('/admin/login')
}
