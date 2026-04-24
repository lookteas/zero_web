import test from 'node:test'
import assert from 'node:assert/strict'

import { getAdminUserPageSummaryCards, getAdminUsersEmptyStateCopy } from './users-page.mjs'

test('getAdminUserPageSummaryCards returns the four admin overview cards', () => {
  const cards = getAdminUserPageSummaryCards({
    total: 12,
    active: 10,
    withEmail: 8,
    withMobile: 6,
  })

  assert.equal(cards.length, 4)
  assert.equal(cards[0].label, '用户总数')
  assert.equal(cards[0].value, '12')
  assert.equal(cards[1].label, '启用用户')
  assert.equal(cards[2].label, '已绑邮箱')
  assert.equal(cards[3].label, '已绑手机')
})

test('getAdminUsersEmptyStateCopy points admins back to registration and filters', () => {
  const copy = getAdminUsersEmptyStateCopy({ keyword: 'max', status: 1 })

  assert.match(copy.title, /没有找到/) 
  assert.match(copy.description, /筛选/)
  assert.match(copy.actionLabel, /查看全部用户/)
})
