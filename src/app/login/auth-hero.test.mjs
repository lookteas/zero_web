import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { getAuthHeroContent } from './auth-hero.mjs'

const loginPage = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
const hasTokens = (source, tokens) => tokens.every((token) => source.includes(token))

test('getAuthHeroContent returns the approved growth-app auth structure', () => {
  const hero = getAuthHeroContent()

  assert.equal(hero.title, '慢一点，也没关系')
  assert.match(hero.description, /今天真正重要的一件事/)
  assert.deepEqual(hero.actions, ['登录', '注册'])
})

test('login page uses the latest split-panel auth composition', () => {
  assert.equal(hasTokens(loginPage, ['LoginExperience', 'loginAction={loginAction}', 'registerAction={registerAction}']), true)
  assert.equal(hasTokens(loginPage, ['searchParams', 'loginError', 'registerError']), true)
})

test('login experience keeps the new desktop/mobile visual details and real auth actions', () => {
  const loginExperience = readFileSync(new URL('./login-experience.tsx', import.meta.url), 'utf8')

  assert.equal(hasTokens(loginExperience, ['useState', 'showPassword', 'isLogin']), true)
  assert.equal(hasTokens(loginExperience, ['/login-illustration.png', '每日打卡', '习惯养成', '心境记录']), true)
  assert.equal(hasTokens(loginExperience, ['formAction={loginAction}', 'formAction={registerAction}']), true)
  assert.equal(hasTokens(loginExperience, ['login-error-alert', 'register-error-alert']), true)
  assert.equal(loginExperience.includes('framer-motion'), false)
  assert.equal(loginExperience.includes('lucide-react'), false)
})
