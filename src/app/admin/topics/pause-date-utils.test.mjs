import assert from 'node:assert/strict'
import test from 'node:test'

import { addDateRange, normalizePauseDates } from './pause-date-utils.mjs'

test('normalizePauseDates keeps valid iso dates sorted and unique', () => {
  assert.deepEqual(normalizePauseDates(['2026-05-03', 'bad', '2026-05-01', '2026-05-03']), [
    '2026-05-01',
    '2026-05-03',
  ])
})

test('addDateRange adds a single date or inclusive date range', () => {
  assert.deepEqual(addDateRange(['2026-05-02'], '2026-05-01', '2026-05-03'), [
    '2026-05-01',
    '2026-05-02',
    '2026-05-03',
  ])
  assert.deepEqual(addDateRange([], '2026-05-04', ''), ['2026-05-04'])
})

test('addDateRange supports reversed range input', () => {
  assert.deepEqual(addDateRange([], '2026-05-03', '2026-05-01'), [
    '2026-05-01',
    '2026-05-02',
    '2026-05-03',
  ])
})
