import test from 'node:test'
import assert from 'node:assert/strict'

import { getHistoryCardSummary } from './history-card.mjs'

test('getHistoryCardSummary prefers weakness first', () => {
  const summary = getHistoryCardSummary({
    weakness: '当前卡点',
    improvementPlan: '今天怎么练',
    verificationPath: '今晚怎么验证',
    reflectionNote: '后记',
  })

  assert.equal(summary, '当前卡点')
})

test('getHistoryCardSummary falls back through remaining fields', () => {
  assert.equal(getHistoryCardSummary({ improvementPlan: '今天怎么练' }), '今天怎么练')
  assert.equal(getHistoryCardSummary({ verificationPath: '今晚怎么验证' }), '今晚怎么验证')
  assert.equal(getHistoryCardSummary({ reflectionNote: '后记' }), '后记')
})

test('getHistoryCardSummary uses readable fallback when all fields are empty', () => {
  const summary = getHistoryCardSummary({
    weakness: '',
    improvementPlan: '',
    verificationPath: '',
    reflectionNote: '',
  })

  assert.equal(summary, '这条记录还没写下具体内容')
})
