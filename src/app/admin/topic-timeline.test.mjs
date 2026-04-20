import test from 'node:test'
import assert from 'node:assert/strict'

import { buildTopicTimeline, getDefaultTimelineStart, getTimelineSummary, parseTimelineStart } from './topic-timeline.mjs'

test('getDefaultTimelineStart returns saturday in current vote window', () => {
  const start = getDefaultTimelineStart(new Date('2026-04-16T09:00:00'))
  assert.equal(start, '2026-04-18')
})

test('parseTimelineStart falls back to default when invalid', () => {
  const start = parseTimelineStart('bad-date', new Date('2026-04-16T09:00:00'))
  assert.equal(start, '2026-04-18')
})

test('buildTopicTimeline creates seven day slots and marks missing days', () => {
  const timeline = buildTopicTimeline([
    { id: 1, title: '主题 A', status: 1, scheduleDate: '2026-04-18' },
    { id: 2, title: '主题 B', status: 0, scheduleDate: '2026-04-20' },
  ], '2026-04-18')

  assert.equal(timeline.length, 7)
  assert.equal(timeline[0].date, '2026-04-18')
  assert.equal(timeline[0].topic?.title, '主题 A')
  assert.equal(timeline[2].topic?.title, '主题 B')
  assert.equal(timeline[1].missing, true)
  assert.equal(timeline[6].date, '2026-04-24')
})

test('getTimelineSummary counts scheduled and missing days', () => {
  const summary = getTimelineSummary([
    { date: '2026-04-18', missing: false },
    { date: '2026-04-19', missing: true },
    { date: '2026-04-20', missing: false },
  ])

  assert.deepEqual(summary, {
    total: 3,
    scheduled: 2,
    missing: 1,
  })
})
