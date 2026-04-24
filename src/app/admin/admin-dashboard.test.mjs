import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getAdminDiscussionSummary,
  getAdminTopicStats,
  getAdminVoteLeader,
  loadAdminDashboardData,
} from './admin-dashboard.mjs'

test('getAdminTopicStats counts active and inactive topics', () => {
  const stats = getAdminTopicStats([
    { id: 1, status: 1 },
    { id: 2, status: 0 },
    { id: 3, status: 1 },
  ])

  assert.deepEqual(stats, {
    total: 3,
    active: 2,
    inactive: 1,
  })
})

test('getAdminVoteLeader returns highest voted candidate', () => {
  const leader = getAdminVoteLeader({
    candidates: [
      { id: 1, topicTitle: '表达能力', voteCount: 3, sortNo: 2 },
      { id: 2, topicTitle: '情绪稳定', voteCount: 5, sortNo: 1 },
    ],
  })

  assert.equal(leader?.topicTitle, '情绪稳定')
})

test('getAdminDiscussionSummary formats meeting metadata', () => {
  const summary = getAdminDiscussionSummary({
    meetingTime: '2026-04-18 20:00:00',
    meetingLink: 'https://meeting.tencent.com/dm/demo',
    status: 'published',
  })

  assert.equal(summary.timeLabel, '周六 20:00')
  assert.equal(summary.providerLabel, '腾讯会议')
  assert.equal(summary.statusLabel, '已发布')
  assert.equal(summary.hasMeetingLink, true)
})

test('getAdminDiscussionSummary falls back when meeting link is empty', () => {
  const summary = getAdminDiscussionSummary({
    meetingTime: '',
    meetingLink: '',
    status: 'draft',
  })

  assert.equal(summary.timeLabel, '周六 20:00')
  assert.equal(summary.providerLabel, '未设置')
  assert.equal(summary.statusLabel, '草稿')
  assert.equal(summary.hasMeetingLink, false)
})

test('loadAdminDashboardData keeps admin dashboard usable when vote and discussion loading fail', async () => {
  const data = await loadAdminDashboardData({
    listAdminTopics: async () => [{ id: 1, title: '表达能力', status: 1 }],
    getCurrentWeeklyVote: async () => {
      throw new Error('Request failed: 400')
    },
    getCurrentDiscussion: async () => {
      throw new Error('Request failed: 400')
    },
  })

  assert.equal(data.topics.length, 1)
  assert.deepEqual(data.vote.candidates, [])
  assert.equal(data.discussion.discussionTitle, '待补充本周讨论')
  assert.equal(data.discussion.status, 'draft')
  assert.equal(data.warnings.length, 1)
  assert.match(data.warnings[0], /主题设置/)
})
