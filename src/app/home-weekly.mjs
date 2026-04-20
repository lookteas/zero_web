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

export function getHomeWeeklyLeader(vote) {
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

export function getHomeWeeklyStatus(vote, discussion) {
  const leader = getHomeWeeklyLeader(vote)
  const topicTitle = discussion?.topicTitle || leader?.topicTitle || '本周话题待定'
  const timeLabel = formatTimeLabel(discussion?.meetingTime)

  if (vote?.status === 'closed') {
    return `本周讨论主题已确定：${topicTitle}，默认 ${timeLabel} 开始。`
  }

  return `当前领先话题是 ${topicTitle}，票数最高会在 ${timeLabel} 自动进入每周讨论。`
}
