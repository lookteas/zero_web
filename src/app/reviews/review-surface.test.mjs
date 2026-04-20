import test from 'node:test'
import assert from 'node:assert/strict'

import { getReviewFormCopy, getReviewResultOptions, getReviewSurfaceTone } from './review-surface.mjs'

test('getReviewSurfaceTone distinguishes recovery review cards', () => {
  assert.equal(getReviewSurfaceTone({ recovery: false }).tone, 'default')
  assert.equal(getReviewSurfaceTone({ recovery: true }).tone, 'recovery')
})

test('getReviewFormCopy returns the approved workbench labels', () => {
  const normal = getReviewFormCopy({ recovery: false })
  const recovery = getReviewFormCopy({ recovery: true })

  assert.equal(normal.resultLabel, '这次执行结果')
  assert.equal(normal.actualLabel, '过程回顾')
  assert.equal(normal.suggestionLabel, '下一步调整')
  assert.match(normal.actualHint, /真正发生的过程/)
  assert.match(normal.suggestionHint, /具体、可执行/)

  assert.equal(recovery.actualLabel, '过程回顾')
  assert.equal(recovery.suggestionLabel, '下一步调整')
  assert.match(recovery.actualHint, /这段间隔里/)
  assert.match(recovery.suggestionHint, /重新接住自己/)
})

test('getReviewResultOptions keeps the three direct result choices in order', () => {
  assert.deepEqual(
    getReviewResultOptions().map((item) => item.value),
    ['done', 'partial', 'failed'],
  )
})