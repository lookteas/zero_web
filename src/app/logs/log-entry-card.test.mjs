import test from 'node:test'
import assert from 'node:assert/strict'

import { getLogEntryPrimaryLine } from './log-entry-card.mjs'

test('getLogEntryPrimaryLine prefers parsed summary before fallback text', () => {
  assert.equal(getLogEntryPrimaryLine({ summary: '我发现自己又急了', remark: '备用文本' }), '我发现自己又急了')
  assert.equal(getLogEntryPrimaryLine({ summary: '', remark: '备用文本' }), '备用文本')
  assert.equal(getLogEntryPrimaryLine({ summary: '', remark: '' }), '这次先记下一个当下的变化')
})
