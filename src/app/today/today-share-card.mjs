const COPY = {
  cardTitle: '\u4eca\u5929\u7684\u610f\u8bc6\u5f3a\u5ea6\u63d0\u5347',
  topicLabel: '\u4eca\u65e5\u63d0\u5347\u70b9',
  weaknessLabel: '\u5f53\u524d\u5361\u70b9',
  planLabel: '\u6539\u8fdb\u884c\u52a8',
  verificationLabel: '\u9a8c\u8bc1\u65b9\u5f0f',
}

function decodeEscaped(value) {
  return JSON.parse(`"${value}"`)
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function line(label, value, y) {
  return `
    <text x="88" y="${y}" fill="#5B6B63" font-size="22" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif">${escapeXml(label)}</text>
    <foreignObject x="88" y="${y + 18}" width="904" height="106">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, PingFang SC, Microsoft YaHei, sans-serif; font-size: 34px; line-height: 1.45; color: #17221D; font-weight: 600; word-break: break-word;">${escapeXml(value)}</div>
    </foreignObject>
  `
}

export function buildTodayShareCardSvg(payload) {
  const cardTitle = decodeEscaped(COPY.cardTitle)
  const topicLabel = decodeEscaped(COPY.topicLabel)
  const weaknessLabel = decodeEscaped(COPY.weaknessLabel)
  const planLabel = decodeEscaped(COPY.planLabel)
  const verificationLabel = decodeEscaped(COPY.verificationLabel)

  return `
    <svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1080" y2="1350" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F5FAF7"/>
          <stop offset="1" stop-color="#ECF4F0"/>
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#1B7C68"/>
          <stop offset="1" stop-color="#155E51"/>
        </linearGradient>
      </defs>
      <rect width="1080" height="1350" rx="40" fill="url(#bg)"/>
      <rect x="40" y="40" width="1000" height="1270" rx="34" fill="#FFFFFF" fill-opacity="0.9" stroke="#DCE8E2"/>
      <text x="88" y="120" fill="#6B7E73" font-size="24" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif">${escapeXml(payload.dateLabel)}</text>
      <text x="88" y="198" fill="#17221D" font-size="54" font-weight="700" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif">${escapeXml(cardTitle)}</text>
      <rect x="88" y="236" width="88" height="4" rx="2" fill="url(#accent)"/>
      ${line(topicLabel, payload.topicTitle, 320)}
      ${line(weaknessLabel, payload.weakness, 530)}
      ${line(planLabel, payload.improvementPlan, 740)}
      ${line(verificationLabel, payload.verificationPath, 950)}
    </svg>
  `.trim()
}

export function buildTodayShareCardQuery(payload) {
  const searchParams = new URLSearchParams()
  searchParams.set('dateLabel', payload.dateLabel)
  searchParams.set('topicTitle', payload.topicTitle)
  searchParams.set('weakness', payload.weakness)
  searchParams.set('improvementPlan', payload.improvementPlan)
  searchParams.set('verificationPath', payload.verificationPath)
  return searchParams.toString()
}
