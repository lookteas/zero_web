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

test('login page keeps the approved auth shell and floating form card', () => {
  assert.equal(hasTokens(loginPage, ['rounded-[34px]', 'border-[var(--border-soft)]/90', 'bg-white/85']), true)
  assert.equal(hasTokens(loginPage, ['app-auth-hero', 'pb-28', 'md:pb-32']), true)
  assert.equal(hasTokens(loginPage, ['-mt-20 rounded-[30px]', 'border-white/80', 'bg-[rgba(255,255,255,0.94)]']), true)
})

test('login page fills the desktop hero with a premium abstract visual', () => {
  assert.equal(hasTokens(loginPage, ['auth-premium-visual', 'auth-premium-orb', 'auth-premium-glass', 'auth-premium-ribbon']), true)
  assert.equal(hasTokens(loginPage, ['top-0', 'bottom-0', 'right-0', 'md:w-[52%]']), true)
  assert.equal(loginPage.includes('bottom-8 right-8 top-8'), false)
  assert.equal(loginPage.includes('auth-growth-path'), false)
  assert.equal(loginPage.includes('复盘提醒'), false)
})
