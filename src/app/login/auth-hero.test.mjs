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

test('login page fills the desktop hero with a calm growth visual', () => {
  assert.equal(hasTokens(loginPage, ['auth-growth-visual', 'auth-growth-path', 'auth-growth-card', 'auth-growth-summary']), true)
  assert.equal(loginPage.includes('今日觉察'), true)
  assert.equal(loginPage.includes('复盘提醒'), true)
})
