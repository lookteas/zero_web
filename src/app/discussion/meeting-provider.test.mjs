import test from 'node:test'
import assert from 'node:assert/strict'

import { resolveMeetingProvider } from './meeting-provider.mjs'

test('resolveMeetingProvider detects tencent meeting links', () => {
  assert.equal(resolveMeetingProvider('https://meeting.tencent.com/dm/abc').type, 'tencent')
})

test('resolveMeetingProvider detects feishu meeting links', () => {
  assert.equal(resolveMeetingProvider('https://vc.feishu.cn/j/123').type, 'feishu')
})

test('resolveMeetingProvider falls back to custom links', () => {
  assert.equal(resolveMeetingProvider('https://example.com/room').type, 'custom')
})
