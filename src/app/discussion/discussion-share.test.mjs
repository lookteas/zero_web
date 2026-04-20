import test from 'node:test'
import assert from 'node:assert/strict'

import { buildDiscussionShareCardQuery, formatDiscussionTimeLabel } from './discussion-share.mjs'

test('formatDiscussionTimeLabel formats saturday evening clearly', () => {
  assert.equal(formatDiscussionTimeLabel('2026-04-18 20:00:00'), '周六 20:00')
})

test('buildDiscussionShareCardQuery keeps core share fields', () => {
  const query = buildDiscussionShareCardQuery({
    discussionTitle: '本周讨论：沉迷拔出能力',
    topicTitle: '沉迷拔出能力',
    meetingTime: '2026-04-18 20:00:00',
    weekStartDate: '2026-04-13',
  })

  assert.match(query, /discussionTitle=/)
  assert.match(query, /topicTitle=/)
  assert.match(query, /timeLabel=%E5%91%A8%E5%85%AD(?:\+|%20)20%3A00/)
})
