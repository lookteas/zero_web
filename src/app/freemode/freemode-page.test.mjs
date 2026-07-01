import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const homePage = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')
const freeModePage = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')
const freeModeWorkbench = readFileSync(new URL('./freemode-workbench.tsx', import.meta.url), 'utf8')
const apiSource = readFileSync(new URL('../../lib/api.ts', import.meta.url), 'utf8')

test('home page exposes free mode entry', () => {
  assert.equal(homePage.includes('自由模式'), true)
  assert.equal(homePage.includes('href="/freemode"'), true)
})

test('free mode page keeps the independent route and fallback surface', () => {
  assert.equal(freeModePage.includes('listFreemodeChapters'), true)
  assert.equal(freeModePage.includes('listFreemodePractices'), true)
  assert.equal(freeModePage.includes('自由模式记录已保存，不会计入今天的打卡。'), true)
  assert.equal(apiSource.includes('/free-mode/practices'), true)
})

test('free mode workbench groups awareness points by chapter and allows point selection', () => {
  assert.equal(freeModeWorkbench.includes('选择今天要练的章节和点位'), true)
  assert.equal(freeModeWorkbench.includes('selectedChapterId'), true)
  assert.equal(freeModeWorkbench.includes('selectedAwarenessId'), true)
  assert.equal(freeModeWorkbench.includes('chapter.points.length'), true)
  assert.equal(freeModeWorkbench.includes('进入练习'), true)
  assert.equal(freeModeWorkbench.includes('返回选择'), true)
  assert.equal(freeModeWorkbench.includes('aria-pressed'), true)
})

test('free mode workbench separates selection from focused practice', () => {
  assert.equal(freeModeWorkbench.includes('selectionMode'), true)
  assert.equal(freeModeWorkbench.includes('hasSelectedPoint'), true)
  assert.equal(freeModeWorkbench.includes('detail-panel'), true)
  assert.equal(freeModeWorkbench.includes('保存本次觉察练习'), true)
  assert.equal(freeModeWorkbench.includes('disabled={practiceNote.trim().length < 8}'), true)
  assert.equal(freeModeWorkbench.includes('保存前至少写下一句具体觉察。'), true)
})

test('free mode recent practice cards surface the awareness summary', () => {
  assert.equal(freeModeWorkbench.includes('练习方向'), true)
  assert.equal(freeModeWorkbench.includes('practice.awarenessSummary'), true)
  assert.equal(freeModeWorkbench.includes('这条意识点暂无摘要。'), true)
})
