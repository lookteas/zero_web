import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const todayPage = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

const hasTokens = (source, tokens) => tokens.every((token) => source.includes(token))

test('today page handles awareness cycle rest days', () => {
  assert.equal(todayPage.includes('本轮结束，休息整合中'), true)
  assert.equal(todayPage.includes('isRestDay'), true)
  assert.equal(todayPage.includes('/reviews'), true)
  assert.equal(todayPage.includes('/today/history'), true)
})

test('today rest days preserve query notices before the rest card', () => {
  const restBranch = todayPage.slice(todayPage.indexOf('if (task?.isRestDay)'), todayPage.indexOf('let awarenessLogs'))
  const noticeUsageCount = todayPage.split('<TodayQueryNotices query={query} />').length - 1

  assert.equal(todayPage.includes('function TodayQueryNotices('), true)
  assert.equal(noticeUsageCount, 2)
  assert.equal(restBranch.includes('<TodayQueryNotices query={query} />'), true)
  assert.equal(restBranch.indexOf('<TodayQueryNotices query={query} />') < restBranch.indexOf('<TodayRestStateCard task={task} />'), true)
})

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

test('today page exposes one merged awareness summary before the form', () => {
  assert.equal(todayPage.includes('\\u610f\\u8bc6\\u70b9\\u6458\\u8981'), true)
  assert.equal(todayPage.includes('\\u8be6\\u7ec6\\u8bf4\\u660e'), false)
  assert.equal(todayPage.includes('\\u5148\\u6293\\u4eca\\u5929\\u7684\\u6838\\u5fc3'), false)
  assert.equal(todayPage.includes('\\u5148\\u770b\\u6e05\\u4eca\\u5929\\u56f4\\u7ed5\\u4ec0\\u4e48\\u7ec3\\uff0c\\u518d\\u5f00\\u59cb\\u586b\\u5199'), true)
  assert.equal(todayPage.includes('text-[13px] font-semibold text-[var(--primary)]/80 md:text-[14px]'), true)
})

test('today awareness detail uses structured reading blocks for long content', () => {
  assert.equal(todayPage.includes('import { buildAwarenessDetailSections } from "./today-detail-reader.mjs";'), true)
  assert.equal(todayPage.includes('function AwarenessDetailReader('), true)
  assert.equal(todayPage.includes('buildAwarenessDetailSections({ summary, details })'), true)
  assert.equal(todayPage.includes('COPY.taskSummaryLabel'), true)
  assert.equal(todayPage.includes('summary-highlight'), true)
  assert.equal(todayPage.includes('summary-supporting'), true)
  assert.equal(todayPage.includes('rounded-[20px] border border-[rgba(19,111,99,0.12)] bg-[rgba(238,248,247,0.74)]'), true)
  assert.equal(todayPage.includes('COPY.detailLeadLabel'), false)
  assert.equal(todayPage.includes('COPY.detailListLabel'), true)
  assert.equal(todayPage.includes('COPY.detailMoreLabel'), true)
  assert.equal(todayPage.includes('COPY.detailExpandLabel'), true)
  assert.equal(todayPage.includes('COPY.detailCollapseLabel'), true)
  assert.equal(todayPage.includes('border-l-2 border-[rgba(19,111,99,0.18)]'), true)
  assert.equal(todayPage.includes('whitespace-pre-wrap text-sm leading-7'), false)
})

test('today page uses more compact mobile spacing between task detail and form blocks', () => {
  assert.equal(todayPage.includes('flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between'), true)
  assert.equal(todayPage.includes('mt-4 rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-white/92 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-5'), true)
  assert.equal(todayPage.includes('<AwarenessDetailReader summary={summary} details={details} />'), true)
  assert.equal(todayPage.includes('className="space-y-3.5 md:space-y-5"'), true)
  assert.equal(todayPage.includes('grid gap-3 pt-0.5 md:grid-cols-2'), true)
})

test('today page uses share-panel surfaces for detail and form sections', () => {
  assert.equal(hasTokens(todayPage, ['rounded-[30px]', 'border-[rgba(204,219,212,0.92)]', 'bg-[var(--surface)]']), true)
  assert.equal(hasTokens(todayPage, ['rounded-[24px]', 'border-[rgba(210,221,215,0.86)]', 'bg-white/92']), true)
  assert.equal(hasTokens(todayPage, ['rounded-[24px]', 'border-[rgba(210,221,215,0.86)]', 'bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,248,0.94)_100%)]']), true)
})

test('today writing workflow uses the clear workbench shell family', () => {
  assert.equal(todayPage.includes('function WorkbenchShell('), true)
  assert.equal(todayPage.includes('<WorkbenchShell badge={COPY.topicCardTitle}'), true)
  assert.equal(todayPage.includes('<WorkbenchShell badge={formPanelBadge}'), true)
  assert.equal(hasTokens(todayPage, ['rounded-[30px]', 'border-[rgba(204,219,212,0.92)]', 'bg-[var(--surface)]', 'shadow-[var(--shadow-card)]']), true)
  assert.equal(hasTokens(todayPage, ['bg-[var(--surface-muted)]', 'border-[var(--border-soft)]', 'text-[var(--foreground-soft)]']), true)
})

test('today writing modules stay distinct without heavy card depth', () => {
  assert.equal(hasTokens(todayPage, ['rounded-[18px]', 'shadow-[0_8px_18px_rgba(15,48,60,0.035)]', 'TodayFieldModule']), true)
  assert.equal(hasTokens(todayPage, ['min-h-[104px]', 'bg-white/95', 'focus:shadow-[0_0_0_4px_rgba(19,111,99,0.08)]']), true)
  assert.equal(todayPage.includes('shadow-[0_12px_26px_rgba(15,23,42,0.04)]'), false)
  assert.equal(todayPage.includes('action={saveTodayTaskAction}'), true)
  assert.equal(todayPage.includes('formAction={submitTodayTaskAction}'), true)
})
test('today page removes old section-card wrapper around detail and form blocks', () => {
  assert.equal(todayPage.includes('SectionCard title={COPY.topicCardTitle}'), false)
  assert.equal(todayPage.includes('SectionCard title={COPY.formTitle}'), false)
  assert.equal(hasTokens(todayPage, ['border-b', 'border-[var(--border-soft)]', 'bg-[var(--surface-muted)]']), true)
})

test('today page keeps submitted tasks editable within 72 hours', () => {
  assert.equal(todayPage.includes('task.status === "submitted" && !task.canEditContent ? ('), true)
  assert.equal(todayPage.includes('72 \\u5c0f\\u65f6\\u5185\\u53ef\\u7ee7\\u7eed\\u4fee\\u6539'), true)
  assert.equal(todayPage.includes('48 \\u5c0f\\u65f6\\u5185\\u53ef\\u7ee7\\u7eed\\u4fee\\u6539'), false)
  assert.equal(todayPage.includes('24 \\u5c0f\\u65f6\\u5185\\u53ef\\u7ee7\\u7eed\\u4fee\\u6539'), false)
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

test('today submit action saves current form fields before submitting', () => {
  const actionsSource = readFileSync(new URL('./actions.ts', import.meta.url), 'utf8')
  const submitActionStart = actionsSource.indexOf('export async function submitTodayTaskAction')
  const submitAction = actionsSource.slice(submitActionStart)

  assert.notEqual(submitActionStart, -1)
  assert.equal(submitAction.includes('weakness'), true)
  assert.equal(submitAction.includes('improvementPlan'), true)
  assert.equal(submitAction.includes('verificationPath'), true)
  assert.equal(submitAction.indexOf('await updateDailyTask(taskId') < submitAction.indexOf('await submitDailyTask(taskId)'), true)
})


