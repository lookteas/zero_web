import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const logsPage = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

test('logs page uses condensed 3-layer structure', () => {
  assert.equal(logsPage.includes('\\u8fd9\\u6761\\u89c9\\u5bdf\\u548c\\u4eca\\u5929\\u4e3b\\u9898\\u7684\\u5173\\u7cfb'), true)
  assert.equal(logsPage.includes('\\u5f00\\u59cb\\u8bb0\\u5f55\\u8fd9\\u6b21\\u89c9\\u5bdf'), true)
  assert.equal(logsPage.includes('\\u6700\\u8fd1\\u8bb0\\u4e0b\\u7684\\u89c9\\u5bdf'), true)
  assert.equal(logsPage.includes('\\u8fd9\\u6b21\\u8bb0\\u5f55\\u4f1a\\u5199\\u54ea\\u4e9b\\u5185\\u5bb9'), false)
  assert.equal(logsPage.includes('\\u628a\\u5f53\\u4e0b\\u6700\\u771f\\u5b9e\\u7684\\u4e00\\u77ac\\u95f4\\u8bb0\\u4e0b\\u6765'), false)
  assert.equal(logsPage.includes('name="logTime"'), false)
  assert.equal(logsPage.includes('name="person"'), false)
  assert.equal(logsPage.includes('name="emotion"'), false)
  assert.equal(logsPage.includes('name="object"'), false)
})

test('logs page uses share-panel surfaces across relation form and history', () => {
  assert.equal(logsPage.includes('overflow-hidden rounded-[28px] border border-[rgba(204,219,212,0.92)]'), true)
  assert.equal(logsPage.includes('border-b border-[rgba(205,219,212,0.72)] bg-[radial-gradient(circle_at_top_left,rgba(35,133,117,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,250,248,0.9)_100%)]'), true)
  assert.equal(logsPage.includes('rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,248,0.94)_100%)]'), true)
})

test('logs page removes old section-card wrappers for the three main blocks', () => {
  assert.equal(logsPage.includes('SectionCard title={COPY.topicCardTitle}'), false)
  assert.equal(logsPage.includes('SectionCard title={COPY.formTitle}'), false)
  assert.equal(logsPage.includes('SectionCard title={COPY.historyTitle}'), false)
})
test('logs history entries use refined inner-card hierarchy', () => {
  assert.equal(logsPage.includes('rounded-[22px] border border-[rgba(210,221,215,0.86)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.95)_100%)] px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]'), true)
  assert.equal(logsPage.includes('flex flex-wrap items-center gap-2'), true)
  assert.equal(logsPage.includes('rounded-[18px] border border-[rgba(216,226,221,0.9)] bg-[rgba(243,249,246,0.82)] px-3 py-2'), true)
})
test('logs page replaces generic hero with a deep teal orbit hero section', () => {
  assert.equal(logsPage.includes('hideHero'), true)
  assert.equal(logsPage.includes('function LogsMoodHero('), true)
  assert.equal(logsPage.includes('logs-hero-orbit logs-hero-orbit-outer'), true)
  assert.equal(logsPage.includes('logs-hero-dot logs-hero-dot-1'), true)
  assert.equal(logsPage.includes('logs-hero app-surface relative overflow-hidden px-5 pt-6 pb-5 md:px-7 md:pt-7 md:pb-6'), true)
})