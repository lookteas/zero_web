import assert from 'node:assert/strict'
import test from 'node:test'

import { buildAwarenessDetailSections } from './today-detail-reader.mjs'

test('buildAwarenessDetailSections skips the detail lead when it repeats the summary', () => {
  const sections = buildAwarenessDetailSections({
    summary: '能够不受固有观念限制，愿意尝试接触新事物。',
    details: [
      '能够不受固有观念限制，愿意尝试接触新事物。',
      '量化数据： 人类普遍 40-60%。',
      '• 可以理解为：能够愿意尝试并不受固有观念限制，接纳并理解新的事物和观念。',
      '1- 转行经历：',
      '某个人一直从事多年的专业领域工作，有一天决定跳出这个舒适圈。',
    ].join('\n'),
  })

  assert.deepEqual(sections.lead, [
    '量化数据： 人类普遍 40-60%。',
    '可以理解为：能够愿意尝试并不受固有观念限制，接纳并理解新的事物和观念。',
  ])
  assert.equal(sections.groups[0].title, '转行经历')
  assert.equal(sections.groups[0].body[0], '某个人一直从事多年的专业领域工作，有一天决定跳出这个舒适圈。')
})

test('buildAwarenessDetailSections removes leading bullet markers from loose paragraphs', () => {
  const sections = buildAwarenessDetailSections({
    summary: '摘要。',
    details: [
      '摘要。',
      '· 第一条 loose 段落',
      '- 第二条 loose 段落',
      '• 第三条 loose 段落',
    ].join('\n'),
  })

  assert.deepEqual(sections.lead, ['第一条 loose 段落', '第二条 loose 段落'])
  assert.deepEqual(sections.groups[0].body, ['第三条 loose 段落'])
})

test('buildAwarenessDetailSections keeps a distinct detail lead after the summary', () => {
  const sections = buildAwarenessDetailSections({
    summary: '先看摘要。',
    details: '这是不同的详情第一段。\n量化数据：人类普遍 40-60%。',
  })

  assert.deepEqual(sections.lead, ['这是不同的详情第一段。', '量化数据：人类普遍 40-60%。'])
})
