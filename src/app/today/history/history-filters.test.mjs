import test from 'node:test'
import assert from 'node:assert/strict'

import { resolveHistoryFilters } from './history-filters.mjs'

test('resolveHistoryFilters defaults to last 7 days', () => {
  const filters = resolveHistoryFilters({}, new Date('2026-04-16T08:00:00+08:00'))

  assert.equal(filters.startDate, '2026-04-10')
  assert.equal(filters.endDate, '2026-04-16')
  assert.equal(filters.keyword, '')
})

test('resolveHistoryFilters preserves explicit query values', () => {
  const filters = resolveHistoryFilters({ startDate: '2026-04-01', endDate: '2026-04-09', keyword: '复盘' }, new Date('2026-04-16T08:00:00+08:00'))

  assert.equal(filters.startDate, '2026-04-01')
  assert.equal(filters.endDate, '2026-04-09')
  assert.equal(filters.keyword, '复盘')
})
