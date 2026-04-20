import test from 'node:test'
import assert from 'node:assert/strict'

import { getHomeWeeklyLeader, getHomeWeeklyStatus } from './home-weekly.mjs'

test('getHomeWeeklyLeader returns top vote candidate', () => {
  const leader = getHomeWeeklyLeader({
    candidates: [
      { id: 1, topicTitle: 'A', voteCount: 2 },
      { id: 2, topicTitle: 'B', voteCount: 5 },
    ],
  })

  assert.equal(leader?.topicTitle, 'B')
})

test('getHomeWeeklyStatus summarizes vote and discussion', () => {
  const summary = getHomeWeeklyStatus(
    { status: 'active', candidates: [{ id: 2, topicTitle: '沉迷拔出能力', voteCount: 5 }] },
    { topicTitle: '沉迷拔出能力', meetingTime: '2026-04-18 20:00:00' },
  )

  assert.match(summary, /沉迷拔出能力/)
  assert.match(summary, /周六 20:00/)
})
