const DAY_MS = 24 * 60 * 60 * 1000

const COPY = {
  title: '\u672c\u5468\u610f\u8bc6\u5f3a\u5ea6\u590d\u76d8',
  periodLabel: '\u5468\u671f\uff1a',
  pointLabel: '\u4e2a\u610f\u8bc6\u5f3a\u5ea6\u70b9\uff1a',
  reviewLabel: '\u590d\u76d8\u8981\u70b9\uff1a',
  restLabel: '\u4f11\u606f\u6574\u5408\uff1a',
  pausedLabel: '\u6682\u505c\u6574\u7406\uff1a',
  restStatus: '\u4f11\u606f\u6574\u5408',
  pausedStatus: '\u6682\u505c\u6574\u7406',
  noSummary: '\u56de\u770b\u8fd9\u4e00\u5929\u7684\u7ec3\u4e60\u611f\u53d7\u548c\u89c2\u5bdf\u3002',
  closing: '\u8bf7\u5927\u5bb6\u56de\u770b\u672c\u5468\u7684\u7ec3\u4e60\uff0c\u9009\u4e00\u4e2a\u6700\u6709\u89e6\u52a8\u7684\u70b9\u5199\u4e0b\u590d\u76d8\u3002',
}

function decodeEscaped(value) {
  return JSON.parse(`"${value}"`)
}

function parseDate(value) {
  const parsed = new Date(`${String(value || '').trim()}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDate(date) {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`
}

function weekdayLabel(dateValue) {
  const parsed = parseDate(dateValue)
  if (!parsed) {
    return ''
  }

  return ['\u5468\u65e5', '\u5468\u4e00', '\u5468\u4e8c', '\u5468\u4e09', '\u5468\u56db', '\u5468\u4e94', '\u5468\u516d'][parsed.getDay()]
}

function trimText(value) {
  return String(value || '').trim()
}

function getWeekEnd(weekStart, days) {
  const lastDay = Array.isArray(days) && days.length ? days[days.length - 1]?.date : ''
  if (lastDay) {
    return String(lastDay)
  }

  const parsed = parseDate(weekStart)
  return parsed ? formatDate(new Date(parsed.getTime() + 6 * DAY_MS)) : String(weekStart || '')
}

export function buildAdminWeeklySharePayload(cycleInfo = {}) {
  const weekDays = Array.isArray(cycleInfo.weekDays) ? cycleInfo.weekDays : []
  const weekStart = String(cycleInfo.weekStart || weekDays[0]?.date || '')

  return {
    weekStart,
    weekEnd: getWeekEnd(weekStart, weekDays),
    days: weekDays
      .map((day) => {
        const source = day?.topic || day
        const title = trimText(source?.title)
        const isPausedDay = Boolean(source?.isPausedDay || day?.isPausedDay)
        const isRestDay = Boolean(day?.rest || source?.isRestDay || day?.isRestDay)
        const statusLabel = isPausedDay
          ? decodeEscaped(COPY.pausedStatus)
          : isRestDay
            ? decodeEscaped(COPY.restStatus)
            : ''

        return {
          date: String(day?.date || ''),
          weekdayLabel: weekdayLabel(day?.date),
          title,
          summary: trimText(source?.summary),
          progressNo: source?.progressNo ? Number(source.progressNo) : source?.orderNo ? Number(source.orderNo) : null,
          isRestDay,
          isPausedDay,
          statusLabel,
        }
      })
      .filter((day) => day.date && (day.title || day.summary || day.statusLabel)),
  }
}

export function formatAdminWeeklyShareText(payload) {
  const lines = [
    decodeEscaped(COPY.title),
    `${decodeEscaped(COPY.periodLabel)}${payload.weekStart || ''} \uff5e ${payload.weekEnd || ''}`,
  ]

  for (const day of Array.isArray(payload.days) ? payload.days : []) {
    lines.push('')
    lines.push(`${day.weekdayLabel} ${day.date}`.trim())

    if (day.isPausedDay) {
      lines.push(`${decodeEscaped(COPY.pausedLabel)}${day.title}`)
      continue
    }

    if (day.isRestDay) {
      lines.push(`${decodeEscaped(COPY.restLabel)}${day.title}`)
      continue
    }

    const orderLabel = day.progressNo ? `\u7b2c ${day.progressNo} ` : ''
    lines.push(`${orderLabel}${decodeEscaped(COPY.pointLabel)}${day.title}`)
    lines.push(`${decodeEscaped(COPY.reviewLabel)}${day.summary || decodeEscaped(COPY.noSummary)}`)
  }

  lines.push('')
  lines.push(decodeEscaped(COPY.closing))

  return lines.join('\n')
}
