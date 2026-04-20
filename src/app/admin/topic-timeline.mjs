const DAY_MS = 24 * 60 * 60 * 1000

function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function parseDate(value) {
  const parsed = new Date(`${String(value || '').trim()}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : normalizeDate(parsed)
}

function formatDate(date) {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`
}

function weekdayLabel(date) {
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
}

export function getDefaultTimelineStart(now = new Date()) {
  const today = normalizeDate(now)
  const day = today.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(today.getTime() + mondayOffset * DAY_MS)
  const saturday = new Date(monday.getTime() + 5 * DAY_MS)
  return formatDate(saturday)
}

export function parseTimelineStart(value, now = new Date()) {
  const parsed = parseDate(value)
  return parsed ? formatDate(parsed) : getDefaultTimelineStart(now)
}

export function shiftTimelineStart(start, offsetDays) {
  const parsed = parseDate(start)
  if (!parsed) {
    return start
  }
  return formatDate(new Date(parsed.getTime() + offsetDays * DAY_MS))
}

export function buildTopicTimeline(topics = [], start) {
  const timelineStart = parseDate(start)
  if (!timelineStart) {
    return []
  }

  const topicMap = new Map(
    (Array.isArray(topics) ? topics : [])
      .filter((item) => item?.scheduleDate)
      .map((item) => [String(item.scheduleDate), item]),
  )

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(timelineStart.getTime() + index * DAY_MS)
    const dateKey = formatDate(date)
    const topic = topicMap.get(dateKey) || null

    return {
      date: dateKey,
      weekdayLabel: weekdayLabel(date),
      topic,
      missing: !topic,
    }
  })
}

export function getTimelineSummary(slots = []) {
  const total = Array.isArray(slots) ? slots.length : 0
  const missing = (Array.isArray(slots) ? slots : []).filter((item) => item?.missing).length

  return {
    total,
    scheduled: total - missing,
    missing,
  }
}
