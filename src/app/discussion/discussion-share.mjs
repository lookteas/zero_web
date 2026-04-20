function weekdayLabel(date) {
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
}

export function formatDiscussionTimeLabel(meetingTime) {
  const normalized = String(meetingTime || '').trim().replace(' ', 'T')
  const parsed = new Date(normalized)

  if (Number.isNaN(parsed.getTime())) {
    return '周六 20:00'
  }

  return `${weekdayLabel(parsed)} ${`${parsed.getHours()}`.padStart(2, '0')}:${`${parsed.getMinutes()}`.padStart(2, '0')}`
}

export function buildDiscussionShareCardQuery(discussion) {
  const params = new URLSearchParams()

  params.set('discussionTitle', discussion.discussionTitle || '本周讨论')
  params.set('topicTitle', discussion.topicTitle || '本周讨论')
  params.set('timeLabel', formatDiscussionTimeLabel(discussion.meetingTime))
  params.set('weekStartDate', discussion.weekStartDate || '')

  if (discussion.description) {
    params.set('description', discussion.description)
  }

  return `?${params.toString()}`
}
