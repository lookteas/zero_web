import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8')

test('admin page is reframed around awareness cycle instead of weekly voting', () => {
  assert.match(source, /getAdminAwarenessCycle/)
  assert.match(source, /awarenessCycle/)
  assert.match(source, /意识点活动/)
  assert.match(source, /活动启动日/)
  assert.match(source, /意识点数量/)
  assert.match(source, /本周主题/)
  assert.doesNotMatch(source, /当前领先主题/)
  assert.doesNotMatch(source, /票数第一会自动成为讨论主题/)
})

test('admin page uses operational dashboard surfaces', () => {
  assert.match(source, /const metricCards = \[/)
  assert.match(source, /grid gap-3 md:grid-cols-2 xl:grid-cols-5/)
  assert.match(source, /rounded-\[14px\] border border-cyan-900\/10 bg-white/)
  assert.match(source, /快速入口/)
  assert.match(source, /本周排期预览/)
  assert.doesNotMatch(source, /rounded-3xl/)
})
