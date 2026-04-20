import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const todayPage = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

test('today keeps awareness history collapsed by default', () => {
  assert.equal(todayPage.includes('\\u4eca\\u65e5\\u89c9\\u5bdf\\u8bb0\\u5f55'), true)
  assert.equal(todayPage.includes('<details'), true)
  assert.equal(todayPage.includes('<details open'), false)
})

test('today page uses condensed 3-layer structure', () => {
  assert.equal(todayPage.includes('TodaySharePanel'), true)
  assert.equal(todayPage.includes('\\u4eca\\u5929\\u4e3b\\u9898'), true)
  assert.equal(todayPage.includes('\\u5f00\\u59cb\\u586b\\u5199\\u4eca\\u5929\\u7684\\u7ec3\\u4e60'), true)
  assert.equal(todayPage.includes('\\u4eca\\u65e5\\u89c9\\u5bdf\\u8bb0\\u5f55'), true)
  assert.equal(todayPage.includes('\\u4eca\\u5929\\u8981\\u5b8c\\u6210\\u76843\\u4ef6\\u4e8b'), false)
  assert.equal(todayPage.includes('\\u628a\\u4eca\\u5929\\u6700\\u60f3\\u7ec3\\u7684\\u4e00\\u70b9\\u5199\\u6e05\\u695a'), false)
})

test('today page exposes title summary and detail guidance before the form', () => {
  assert.equal(todayPage.includes('\\u610f\\u8bc6\\u70b9\\u6458\\u8981'), true)
  assert.equal(todayPage.includes('\\u8be6\\u7ec6\\u8bf4\\u660e'), true)
  assert.equal(todayPage.includes('\\u5148\\u770b\\u6e05\\u4eca\\u5929\\u56f4\\u7ed5\\u4ec0\\u4e48\\u7ec3\\uff0c\\u518d\\u5f00\\u59cb\\u586b\\u5199'), true)
  assert.equal(todayPage.includes('text-[13px] font-semibold text-[var(--primary)]/80 md:text-[14px]'), true)
})

test('today page uses more compact mobile spacing between task detail and form blocks', () => {
  assert.equal(todayPage.includes('flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between'), true)
  assert.equal(todayPage.includes('mt-4 rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-white/92 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-5'), true)
  assert.equal(todayPage.includes('className="space-y-3"'), true)
  assert.equal(todayPage.includes('className="space-y-3.5 md:space-y-5"'), true)
  assert.equal(todayPage.includes('grid gap-3 pt-0.5 md:grid-cols-2'), true)
})

test('today page uses share-panel surfaces for detail and form sections', () => {
  assert.equal(todayPage.includes('rounded-[28px] border border-[rgba(204,219,212,0.92)]'), true)
  assert.equal(todayPage.includes('rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-white/92'), true)
  assert.equal(todayPage.includes('rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,248,0.94)_100%)]'), true)
})
test('today page removes old section-card wrapper around detail and form blocks', () => {
  assert.equal(todayPage.includes('SectionCard title={COPY.topicCardTitle}'), false)
  assert.equal(todayPage.includes('SectionCard title={COPY.formTitle}'), false)
  assert.equal(todayPage.includes('border-b border-[rgba(205,219,212,0.72)] bg-[radial-gradient(circle_at_top_left,rgba(35,133,117,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,250,248,0.9)_100%)]'), true)
})

test('today page keeps submitted tasks editable within 24 hours', () => {
  assert.equal(todayPage.includes('task.status === "submitted" && !task.canEditContent ? ('), true)
  assert.equal(todayPage.includes('TodaySubmittedSummaryCard'), true)
  assert.equal(todayPage.includes('task.canEditContent'), true)
  assert.equal(todayPage.includes('submittedEditableCollapsedHint'), true)
  assert.equal(todayPage.includes('submittedEditableNotice'), false)
  assert.equal(todayPage.includes('submittedEditableToggle'), false)
  assert.equal(todayPage.includes('rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,248,0.94)_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] md:p-5 group'), true)
  assert.equal(todayPage.includes('<details open'), false)
  assert.equal(todayPage.includes('flex items-center justify-between gap-3 rounded-[18px] border border-[rgba(41,122,106,0.1)] bg-[rgba(248,252,250,0.88)] px-3.5 py-2.5 text-[12px]'), true)
  assert.equal(todayPage.includes('action={saveTodayTaskAction}'), true)
})


