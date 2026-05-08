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

function charWidth(char) {
  return /[\u0000-\u00ff]/.test(char) ? 0.56 : 1
}

function wrapText(value, maxUnits = 25, maxLines = 3) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  const lines = []
  let current = ''
  let units = 0

  for (const char of text) {
    const width = charWidth(char)

    if (current && units + width > maxUnits) {
      lines.push(current)
      current = char
      units = width

      if (lines.length === maxLines) {
        break
      }
      continue
    }

    current += char
    units += width
  }

  if (current && lines.length < maxLines) {
    lines.push(current)
  }

  if (text && lines.length === maxLines) {
    const visibleText = lines.join('')
    if (visibleText.length < text.length) {
      lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[，。；、,.!?！？\s]+$/, '')}…`
    }
  }

  return lines.length > 0 ? lines : ['']
}

function line(label, value, y) {
  const lines = wrapText(value)
  const tspans = lines
    .map((item, index) => `<tspan x="88" dy="${index === 0 ? 0 : 48}">${escapeXml(item)}</tspan>`)
    .join('')

  return `
    <text x="88" y="${y}" fill="#5B6B63" font-size="22" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif">${escapeXml(label)}</text>
    <text x="88" y="${y + 60}" fill="#17221D" font-size="34" font-weight="600" font-family="Arial, PingFang SC, Microsoft YaHei, sans-serif">${tspans}</text>
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
