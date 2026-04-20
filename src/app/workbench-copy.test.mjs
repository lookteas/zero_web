import test from 'node:test'
import assert from 'node:assert/strict'

import { getWorkbenchPageCopy } from './workbench-copy.mjs'

test('getWorkbenchPageCopy returns distinct workbench tones for today logs and reviews', () => {
  const today = getWorkbenchPageCopy('today')
  const logs = getWorkbenchPageCopy('logs')
  const reviews = getWorkbenchPageCopy('reviews')

  assert.equal(today.formTitle, '整理今天这次打卡')
  assert.equal(logs.formTitle, '记下这次觉察')
  assert.equal(reviews.formTitle, '填写这次复盘')

  assert.match(today.formDescription, /今天最重要的一件事/)
  assert.match(logs.formDescription, /先记下来/)
  assert.match(reviews.formDescription, /先确认执行结果/)
})