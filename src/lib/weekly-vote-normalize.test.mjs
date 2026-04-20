import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizeWeeklyVote } from './weekly-vote-normalize.mjs'

test('normalizeWeeklyVote fills missing optional fields safely', () => {
  const normalized = normalizeWeeklyVote({
    id: 1,
    weekStartDate: '2026-04-16',
    voteStartAt: '2026-04-16 00:00:00',
    voteEndAt: '2026-04-20 20:00:00',
    status: 'active',
    candidates: [],
  })

  assert.equal(normalized.todayHasVoted, false)
  assert.deepEqual(normalized.myRecords, [])
  assert.equal(normalized.todayCandidateId, 0)
})
