import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const homePage = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')
const freeModePage = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
const freeModeWorkbench = readFileSync(new URL('./freemode-workbench.tsx', import.meta.url), 'utf8')
const freeModeActions = readFileSync(new URL('./actions.ts', import.meta.url), 'utf8')
const apiSource = readFileSync(new URL('../../lib/api.ts', import.meta.url), 'utf8')

test('home page exposes free mode entry', () => {
  assert.equal(homePage.includes('自由模式'), true)
  assert.equal(homePage.includes('href="/freemode"'), true)
})

test('free mode page keeps the independent route and fallback surface', () => {
  assert.equal(freeModePage.includes('listFreemodeChapters'), true)
  assert.equal(freeModePage.includes('listFreemodePractices'), true)
  assert.equal(freeModePage.includes('自由模式记录已保存到下方「最近独立练习」，不会计入今天的打卡。'), true)
  assert.equal(apiSource.includes('/free-mode/practices'), true)
})

test('free mode workbench uses a compact selection board instead of a mobile list', () => {
  assert.equal(freeModeWorkbench.includes('选择今天的练习区域'), true)
  assert.equal(freeModeWorkbench.includes('练习区域'), true)
  assert.equal(freeModeWorkbench.includes('grid grid-cols-3 gap-2'), true)
  assert.equal(freeModeWorkbench.includes('aspect-[1.02]'), true)
  assert.equal(freeModeWorkbench.includes('md:aspect-auto'), true)
  assert.equal(freeModeWorkbench.includes('md:min-h-[116px]'), true)
  assert.equal(freeModeWorkbench.includes('九个章节'), false)
  assert.equal(freeModeWorkbench.includes('从 9 个区域中先选择一个章节'), false)
})

test('free mode workbench still selects a chapter and then a point', () => {
  assert.equal(freeModeWorkbench.includes('selectedChapterId'), true)
  assert.equal(freeModeWorkbench.includes('selectedAwarenessId'), true)
  assert.equal(freeModeWorkbench.includes('chapter.points.length'), true)
  assert.equal(freeModeWorkbench.includes('grid grid-cols-2'), true)
  assert.equal(freeModeWorkbench.includes('actionPanelRef'), true)
  assert.equal(freeModeWorkbench.includes('scrollActionPanelIntoView'), true)
  assert.equal(freeModeWorkbench.includes('window.setTimeout'), true)
  assert.equal(freeModeWorkbench.includes('detailPanelRef'), true)
  assert.equal(freeModeWorkbench.includes('scrollIntoView'), true)
  assert.equal(freeModeWorkbench.includes('进入练习'), true)
  assert.equal(freeModeWorkbench.includes('返回选择'), true)
  assert.equal(freeModeWorkbench.includes('aria-pressed'), true)
})

test('free mode workbench separates selection from focused practice', () => {
  assert.equal(freeModeWorkbench.includes('selectionMode'), true)
  assert.equal(freeModeWorkbench.includes('hasSelectedPoint'), true)
  assert.equal(freeModeWorkbench.includes('detail-panel'), true)
  assert.equal(freeModeWorkbench.includes('practicePanelRef'), true)
  assert.equal(freeModeWorkbench.includes('!selectionMode'), true)
  assert.equal(freeModeWorkbench.includes('保存本次觉察练习'), true)
  assert.equal(freeModeWorkbench.includes('disabled={practiceNote.trim().length < 8}'), true)
  assert.equal(freeModeWorkbench.includes('保存前至少写下一句具体觉察。'), true)
})

test('free mode practice page shows the selected point title before details and notes', () => {
  assert.equal(freeModeWorkbench.includes('本次练习点'), true)
  assert.equal(freeModeWorkbench.includes('{currentPoint.title}'), true)
  assert.equal(freeModeWorkbench.includes('今日问题'), false)
  assert.equal(freeModeWorkbench.includes('结合这个点，记录一个今天能看见的具体场景。'), false)
})

test('free mode focused practice reuses the today detail reader style', () => {
  assert.equal(freeModeWorkbench.includes('buildAwarenessDetailSections'), true)
  assert.equal(freeModeWorkbench.includes('function AwarenessDetailReader('), true)
  assert.equal(freeModeWorkbench.includes('summary-highlight'), true)
  assert.equal(freeModeWorkbench.includes('summary-supporting'), true)
  assert.equal(freeModeWorkbench.includes('rounded-[18px] bg-[rgba(238,248,247,0.72)] px-4 py-4 md:rounded-[20px] md:border md:border-[rgba(19,111,99,0.12)]'), true)
  assert.equal(freeModeWorkbench.includes('border-t border-[rgba(210,221,215,0.72)] pt-4 first:border-t-0 first:pt-0 md:rounded-[20px] md:border'), true)
  assert.equal(freeModeWorkbench.includes('延伸说明'), true)
  assert.equal(freeModeWorkbench.includes('whitespace-pre-wrap text-[13px] leading-7'), false)
})

test('free mode recent practice cards surface the awareness summary', () => {
  assert.equal(freeModeWorkbench.includes('练习方向'), true)
  assert.equal(freeModeWorkbench.includes('practice.awarenessSummary'), true)
  assert.equal(freeModeWorkbench.includes('这条意识点暂无摘要。'), true)
  assert.equal(freeModeWorkbench.includes('selectionMode && !showRecentOnMobile ? "hidden md:block"'), true)
})

test('free mode save success points users to recent practices', () => {
  assert.equal(freeModePage.includes('已保存到下方「最近独立练习」'), true)
  assert.equal(freeModePage.includes('showRecentOnMobile={Boolean(query.created)}'), true)
  assert.equal(freeModeWorkbench.includes('showRecentOnMobile'), true)
  assert.equal(freeModeWorkbench.includes('recentPanelRef'), true)
  assert.equal(freeModeWorkbench.includes('scrollRecentPanelIntoView'), true)
  assert.equal(freeModeWorkbench.includes('刚刚保存成功，最新记录会显示在这里。'), true)
  assert.equal(freeModeWorkbench.includes('id="recent-practices"'), true)
  assert.equal(freeModeActions.includes('/freemode?created=1#recent-practices'), true)
})
