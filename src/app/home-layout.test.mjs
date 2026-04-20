import test from 'node:test'
import assert from 'node:assert/strict'

import { getHomeSections, getHomeStatusItems } from './home-layout.mjs'

test('getHomeStatusItems keeps streak first and pending reviews second', () => {
  const items = getHomeStatusItems({ continuousDays: 12, pendingReviewCount: 3 })

  assert.deepEqual(items.map((item) => item.key), ['continuousDays', 'pendingReviewCount'])
  assert.equal(items[0].label, '连续打卡')
  assert.equal(items[1].label, '待复盘')
  assert.equal(items[0].value, '12 天')
  assert.equal(items[1].value, '3 条')
  assert.equal(items[0].metric, '12')
  assert.equal(items[0].unit, '天')
  assert.equal(items[1].metric, '3')
  assert.equal(items[1].unit, '条')
  assert.deepEqual(items[0].badges, [
    { label: '进行中', tone: 'primary' },
    { label: '已保持', tone: 'primary' },
  ])
  assert.deepEqual(items[1].badges, [
    { label: '先处理 1 条', tone: 'warning' },
  ])
  assert.equal(items[0].ornamentKind, 'orbit')
  assert.equal(items[1].ornamentKind, 'orbit')
})

test('getHomeSections keeps directive home order', () => {
  const sections = getHomeSections({ hasCycleSummary: true })

  assert.deepEqual(sections.map((section) => section.key), [
    'statusRow',
    'todayFocus',
  ])
})
