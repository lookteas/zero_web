const COPY = {
  todayFallback: '\u4eca\u5929\u5148\u628a\u6b63\u5728\u7ec3\u7684\u8fd9\u4e00\u70b9\u5199\u6e05\u695a',
  summaryFallback: '\u5148\u628a\u8fd9\u6761\u610f\u8bc6\u63d0\u5347\u70b9\u7684\u91cd\u70b9\u6982\u8981\u5199\u6e05\u695a',
  weaknessFallback: '\u4eca\u5929\u5148\u628a\u6ce8\u610f\u529b\u653e\u56de\u6b63\u5728\u7ec3\u7684\u8fd9\u4e00\u70b9',
  planFallback: '\u5148\u628a\u4eca\u5929\u51c6\u5907\u6267\u884c\u7684\u52a8\u4f5c\u8ba4\u771f\u505a\u5b8c',
  verificationFallback: '\u4eca\u665a\u56de\u770b\u65f6\u786e\u8ba4\u81ea\u5df1\u662f\u5426\u771f\u7684\u505a\u5230\u4e86',
  todayLabel: '\u4eca\u65e5',
  titleSuffix: '\u610f\u8bc6\u5f3a\u5ea6\u63d0\u5347',
  topicLabel: '\u4eca\u65e5\u63d0\u5347\u70b9\uff1a',
  summaryLabel: '\u6458\u8981\uff1a',
  weaknessLabel: '\u5f53\u524d\u5361\u70b9\uff1a',
  planLabel: '\u6539\u8fdb\u884c\u52a8\uff1a',
  verificationLabel: '\u9a8c\u8bc1\u65b9\u5f0f\uff1a',
}

function decodeEscaped(value) {
  return JSON.parse(`"${value}"`)
}

function toDateLabel(taskDate) {
  const [, month = '', day = ''] = String(taskDate || '').split('-')
  const safeMonth = String(Number(month) || '')
  const safeDay = String(Number(day) || '')

  if (!safeMonth || !safeDay) {
    return decodeEscaped(COPY.todayLabel)
  }

  return `${safeMonth}${decodeEscaped('\\u6708')}${safeDay}${decodeEscaped('\\u65e5')}`
}

function fill(value, fallback) {
  const trimmed = String(value || '').trim()
  return trimmed || decodeEscaped(fallback)
}

export function buildTodaySharePayload(task) {
  return {
    dateLabel: toDateLabel(task?.taskDate),
    topicTitle: fill(task?.topicTitle, COPY.todayFallback),
    topicSummary: fill(task?.topicSummary, COPY.summaryFallback),
    weakness: fill(task?.weakness, COPY.weaknessFallback),
    improvementPlan: fill(task?.improvementPlan, COPY.planFallback),
    verificationPath: fill(task?.verificationPath, COPY.verificationFallback),
  }
}

export function formatTodayShareText(payload) {
  return [
    `${payload.dateLabel}${decodeEscaped(COPY.titleSuffix)}`,
    '',
    `${decodeEscaped(COPY.topicLabel)}${payload.topicTitle}`,
    `${decodeEscaped(COPY.summaryLabel)}${payload.topicSummary}`,
    '',
    `${decodeEscaped(COPY.weaknessLabel)}\n${payload.weakness}`,
    '',
    `${decodeEscaped(COPY.planLabel)}\n${payload.improvementPlan}`,
    '',
    `${decodeEscaped(COPY.verificationLabel)}\n${payload.verificationPath}`,
  ].join('\n')
}
