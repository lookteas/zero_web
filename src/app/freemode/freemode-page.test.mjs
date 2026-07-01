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
  assert.equal(freeModeWorkbench.includes('先选章节，再选意识点'), true)
  assert.equal(freeModeWorkbench.includes('selectedChapterId'), true)
  assert.equal(freeModeWorkbench.includes('selectedAwarenessId'), true)
  assert.equal(freeModeWorkbench.includes('chapter.points.length'), true)
  assert.equal(freeModeWorkbench.includes('开始这次练习'), true)
})

test('free mode workbench keeps the mobile learning flow compact', () => {
  assert.equal(freeModeWorkbench.includes('overflow-x-auto'), true)
  assert.equal(freeModeWorkbench.includes('snap-x'), true)
  assert.equal(freeModeWorkbench.includes('max-h-[320px]'), true)
  assert.equal(freeModeWorkbench.includes('查看完整说明'), true)
  assert.equal(freeModeWorkbench.includes('max-h-[280px]'), true)
})

test('free mode recent practice cards surface the awareness summary', () => {
  assert.equal(freeModeWorkbench.includes('练习方向'), true)
  assert.equal(freeModeWorkbench.includes('practice.awarenessSummary'), true)
  assert.equal(freeModeWorkbench.includes('这条意识点暂无摘要。'), true)
})
