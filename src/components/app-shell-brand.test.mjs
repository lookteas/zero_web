import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./app-shell.tsx', import.meta.url), 'utf8')
const configSource = readFileSync(new URL('../../next.config.ts', import.meta.url), 'utf8')

test('app shell uses a full mobile workbench brand bar and desktop text brand', () => {
  assert.equal(source.includes('next/image'), false)
  assert.equal(source.includes('/logo.png?v='), false)
  assert.equal(source.includes('md:hidden'), true)
  assert.equal(source.includes('今日练习台'), true)
  assert.equal(source.includes('打卡'), true)
  assert.equal(source.includes('觉察'), true)
  assert.equal(source.includes('复盘'), true)
  assert.equal(source.includes('mobile-brand-marquee'), true)
  assert.equal(source.includes('text-[22px] font-bold tracking-[0.01em]'), true)
  assert.equal(source.includes('品牌标志'), false)
})

test('next image config keeps cache-busted logo whitelist available', () => {
  assert.equal(configSource.includes('localPatterns'), true)
  assert.equal(configSource.includes('pathname: "/logo.png"'), true)
  assert.equal(configSource.includes('search: "?v=20260420-1"'), true)
})
