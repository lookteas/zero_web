import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./app-shell.tsx', import.meta.url), 'utf8')
const configSource = readFileSync(new URL('../../next.config.ts', import.meta.url), 'utf8')
const homeSource = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8')
const todaySource = readFileSync(new URL('../app/today/page.tsx', import.meta.url), 'utf8')
const reviewsSource = readFileSync(new URL('../app/reviews/page.tsx', import.meta.url), 'utf8')
const meSource = readFileSync(new URL('../app/me/page.tsx', import.meta.url), 'utf8')

test('app shell uses one mobile page theme with an ambient light band', () => {
  assert.equal(source.includes('next/image'), false)
  assert.equal(source.includes('/logo.png?v='), false)
  assert.equal(source.includes('md:hidden'), true)
  assert.equal(source.includes('mobileThemeTitle?: string'), true)
  assert.equal(source.includes('mobileThemeTitle ?? title'), true)
  assert.equal(source.includes('今日练习台'), false)
  assert.equal(source.includes('["打卡", "觉察", "复盘"].map'), false)
  assert.equal(source.includes('mobile-brand-marquee'), true)
  assert.equal(source.includes('mobile-brand-glowline'), true)
  assert.equal(source.includes('text-[22px] font-bold tracking-[0.01em]'), true)
  assert.equal(source.includes('品牌标志'), false)
})

test('next image config keeps cache-busted logo whitelist available', () => {
  assert.equal(configSource.includes('localPatterns'), true)
  assert.equal(configSource.includes('pathname: "/logo.png"'), true)
  assert.equal(configSource.includes('search: "?v=20260420-1"'), true)
})

test('main mobile theme titles use the requested page-specific copy', () => {
  assert.equal(homeSource.includes('mobileThemeTitle="顺其自然，大道至简"'), true)
  assert.equal(todaySource.includes('mobileThemeTitle="今日提升点"'), true)
  assert.equal(reviewsSource.includes('mobileThemeTitle="自我复盘"'), true)
  assert.equal(meSource.includes('mobileThemeTitle="个人中心"'), true)
})
