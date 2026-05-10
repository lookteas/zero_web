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

