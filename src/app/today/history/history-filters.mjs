function formatDate(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date, offset) {
  const next = new Date(date)
  next.setDate(next.getDate() + offset)
  return next
}

export function resolveHistoryFilters(searchParams = {}, now = new Date()) {
  const endDate = searchParams.endDate || formatDate(now)
  const startDate = searchParams.startDate || formatDate(addDays(now, -6))
  const keyword = searchParams.keyword || ''

  return {
    startDate,
    endDate,
    keyword,
  }
}

export function buildHistoryQueryString(filters, extra = {}) {
  const params = new URLSearchParams()
  const merged = { ...filters, ...extra }

  for (const [key, value] of Object.entries(merged)) {
    if (value) {
      params.set(key, String(value))
    }
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}
