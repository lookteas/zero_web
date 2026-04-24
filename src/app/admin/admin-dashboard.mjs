import { resolveMeetingProvider } from '../discussion/meeting-provider.mjs'

function createFallbackVote() {
  return {
    candidates: [],
  }
}

function createFallbackDiscussion() {
  return {
    discussionTitle: '待补充本周讨论',
    topicTitle: '本周话题待定',
    meetingTime: '',
    meetingLink: '',
    status: 'draft',
    adminRemark: '',
  }
}

export async function loadAdminDashboardData(loaders) {
  const [topicsResult, voteResult, discussionResult] = await Promise.allSettled([
    loaders.listAdminTopics(),
    loaders.getCurrentWeeklyVote(),
    loaders.getCurrentDiscussion(),
  ])

  const warnings = []
  const topics = topicsResult.status === 'fulfilled' ? topicsResult.value : []
  const vote = voteResult.status === 'fulfilled' ? voteResult.value : createFallbackVote()
  const discussion = discussionResult.status === 'fulfilled' ? discussionResult.value : createFallbackDiscussion()

  if (topicsResult.status === 'rejected') {
    warnings.push('主题列表暂时加载失败，后台其它入口仍可继续使用。')
  }

  if (voteResult.status === 'rejected' || discussionResult.status === 'rejected') {
    warnings.push('本周投票或讨论数据暂不可用，通常是因为周六到下周五的主题排期还没补齐。请先去主题设置补上排期。')
  }

  return {
    topics,
    vote,
    discussion,
    warnings,
  }
}

function weekdayLabel(date) {
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
}

function formatTimeLabel(meetingTime) {
  const parsed = new Date(String(meetingTime || '').trim().replace(' ', 'T'))
  if (Number.isNaN(parsed.getTime())) {
    return '周六 20:00'
  }

  return `${weekdayLabel(parsed)} ${`${parsed.getHours()}`.padStart(2, '0')}:${`${parsed.getMinutes()}`.padStart(2, '0')}`
}

export function getAdminTopicStats(topics = []) {
  const list = Array.isArray(topics) ? topics : []
  const active = list.filter((item) => Number(item?.status) === 1).length

  return {
    total: list.length,
    active,
    inactive: list.length - active,
  }
}

export function getAdminVoteLeader(vote) {
  if (!vote?.candidates?.length) {
    return null
  }

  return [...vote.candidates].sort((left, right) => {
    if ((right.voteCount || 0) !== (left.voteCount || 0)) {
      return (right.voteCount || 0) - (left.voteCount || 0)
    }

    return (left.sortNo || 0) - (right.sortNo || 0)
  })[0]
}

export function getAdminDiscussionSummary(discussion) {
  const meetingLink = String(discussion?.meetingLink || '').trim()
  const provider = meetingLink ? resolveMeetingProvider(meetingLink) : null
  const status = String(discussion?.status || '').trim().toLowerCase()

  return {
    timeLabel: formatTimeLabel(discussion?.meetingTime),
    providerLabel: provider?.label || '未设置',
    hasMeetingLink: Boolean(meetingLink),
    statusLabel: status === 'draft' ? '草稿' : '已发布',
  }
}
