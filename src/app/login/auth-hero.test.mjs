import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { getAuthHeroContent } from './auth-hero.mjs'

const loginPage = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

test('getAuthHeroContent returns the approved growth-app auth structure', () => {
  const hero = getAuthHeroContent()

  assert.equal(hero.title, '慢一点，也没关系')
  assert.match(hero.description, /今天真正重要的一件事/)
  assert.deepEqual(hero.actions, ['登录', '注册'])
})

test('login page keeps the approved auth shell and floating form card', () => {
  assert.equal(
    loginPage.includes('className="overflow-hidden rounded-[34px] border border-[var(--border-soft)]/90 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur"'),
    true
  )
  assert.equal(loginPage.includes('className="app-auth-hero min-h-[18rem] px-6 pb-28 pt-8 md:min-h-[22rem] md:px-10 md:pb-32 md:pt-10"'), true)
  assert.equal(
    loginPage.includes('className="-mt-20 rounded-[30px] border border-white/80 bg-[rgba(255,255,255,0.94)] p-5 shadow-[0_20px_46px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur md:ml-2 md:max-w-md md:p-6"'),
    true
  )
})
