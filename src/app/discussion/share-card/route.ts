export const dynamic = 'force-dynamic'

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function firstLine(value: string, fallback: string) {
  const trimmed = value.trim()
  return escapeXml(trimmed || fallback)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const discussionTitle = firstLine(searchParams.get('discussionTitle') || '', '本周讨论')
  const topicTitle = firstLine(searchParams.get('topicTitle') || '', '本周讨论主题待定')
  const timeLabel = firstLine(searchParams.get('timeLabel') || '', '周六 20:00')
  const weekStartDate = firstLine(searchParams.get('weekStartDate') || '', '')
  const description = firstLine(searchParams.get('description') || '', '票数最高的话题，将自动成为本周讨论主题。')

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0F172A"/>
          <stop offset="1" stop-color="#1E293B"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" rx="36" fill="url(#bg)"/>
      <rect x="48" y="48" width="1104" height="534" rx="28" fill="#F8FAFC" fill-opacity="0.08" stroke="#CBD5E1" stroke-opacity="0.18"/>
      <text x="84" y="118" fill="#93C5FD" font-size="30" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif">Zero · 每周讨论</text>
      <text x="84" y="208" fill="#FFFFFF" font-size="58" font-weight="700" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif">${discussionTitle}</text>
      <text x="84" y="290" fill="#E2E8F0" font-size="34" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif">主题：${topicTitle}</text>
      <text x="84" y="350" fill="#E2E8F0" font-size="30" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif">时间：${timeLabel}</text>
      <text x="84" y="470" fill="#CBD5E1" font-size="28" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif">${description}</text>
      <rect x="84" y="514" width="286" height="56" rx="28" fill="#E0F2FE"/>
      <text x="112" y="550" fill="#0F172A" font-size="26" font-weight="700" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif">默认开聊：周六晚 8 点</text>
      <text x="862" y="550" fill="#94A3B8" font-size="24" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif">${weekStartDate ? `投票周：${weekStartDate}` : ''}</text>
    </svg>
  `.trim()

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
