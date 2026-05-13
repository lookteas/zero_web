const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/
const dayMs = 24 * 60 * 60 * 1000

function isValidIsoDate(value) {
  if (!isoDatePattern.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function normalizePauseDates(values) {
  return Array.from(new Set(values.map((value) => String(value).trim()).filter(isValidIsoDate))).sort()
}

export function addDateRange(existingDates, startDate, endDate) {
  const start = String(startDate || '').trim()
  const end = String(endDate || '').trim()

  if (!isValidIsoDate(start)) {
    return normalizePauseDates(existingDates)
  }

  if (!isValidIsoDate(end)) {
    return normalizePauseDates([...existingDates, start])
  }

  const startTime = new Date(`${start}T00:00:00Z`).getTime()
  const endTime = new Date(`${end}T00:00:00Z`).getTime()
  const from = Math.min(startTime, endTime)
  const to = Math.max(startTime, endTime)
  const range = []

  for (let time = from; time <= to; time += dayMs) {
    range.push(new Date(time).toISOString().slice(0, 10))
  }

  return normalizePauseDates([...existingDates, ...range])
}
