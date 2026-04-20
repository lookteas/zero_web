import test from 'node:test'
import assert from 'node:assert/strict'

import { getLogsFieldChrome } from './logs-form-chrome.mjs'

test('getLogsFieldChrome returns lighter premium accents for event change and note', () => {
  const event = getLogsFieldChrome('event')
  const change = getLogsFieldChrome('change')
  const note = getLogsFieldChrome('note')

  assert.equal(event.label, '事')
  assert.equal(change.label, '变化')
  assert.equal(note.label, '补充')

  assert.notEqual(event.pillClassName, change.pillClassName)
  assert.notEqual(change.pillClassName, note.pillClassName)
  assert.match(event.dotClassName, /rounded-full/)
})