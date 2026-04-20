import { resolveMeetingProvider } from '../discussion/meeting-provider.mjs'

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
