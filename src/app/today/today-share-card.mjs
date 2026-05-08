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

const FONT_STACK = "'Microsoft YaHei', 'PingFang SC', Arial, sans-serif"

function textLines(value, options = {}) {
  const { x = 104, y, fill = '#2A352E', size = 28, weight = 500, lineGap = 43, maxUnits = 31, maxLines = 3 } = options
  const lines = wrapText(value, maxUnits, maxLines)
  const tspans = lines
    .map((item, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineGap}">${escapeXml(item)}</tspan>`)
    .join('')

  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" font-family="${FONT_STACK}">${tspans}</text>`
}

function section(label, value, y) {
  return `
    <circle cx="106" cy="${y - 8}" r="5" fill="#D99B6A"/>
    <text x="126" y="${y}" fill="#728077" font-size="21" font-weight="500" font-family="${FONT_STACK}">${escapeXml(label)}</text>
    ${textLines(value, { y: y + 50 })}
    <line x1="104" y1="${y + 154}" x2="976" y2="${y + 154}" stroke="#ECE4D8" stroke-width="2"/>
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
          <stop stop-color="#FBF7EF"/>
          <stop offset="1" stop-color="#EEF6F0"/>
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#D99B6A"/>
          <stop offset="1" stop-color="#2F8B70"/>
        </linearGradient>
      </defs>
      <rect width="1080" height="1350" rx="40" fill="url(#bg)"/>
      <rect x="40" y="40" width="1000" height="1270" rx="34" fill="#FFFDF8" fill-opacity="0.96" stroke="#E6DDD0"/>
      <path d="M832 82C890 96 940 139 972 198" stroke="#E2C6A8" stroke-width="3" stroke-linecap="round" opacity="0.35"/>
      <circle cx="928" cy="142" r="48" fill="#F2E7D9"/>
      <circle cx="928" cy="142" r="19" fill="#D99B6A" fill-opacity="0.28"/>
      <text x="104" y="126" fill="#7D877F" font-size="23" font-weight="500" font-family="${FONT_STACK}">${escapeXml(payload.dateLabel)}</text>
      <text x="104" y="194" fill="#213229" font-size="46" font-weight="700" font-family="${FONT_STACK}">${escapeXml(cardTitle)}</text>
      <rect x="104" y="232" width="74" height="4" rx="2" fill="url(#accent)"/>
      <text x="104" y="316" fill="#728077" font-size="21" font-weight="500" font-family="${FONT_STACK}">${escapeXml(topicLabel)}</text>
      <rect x="104" y="342" width="516" height="76" rx="24" fill="#F4EEE4" stroke="#E5D4BF"/>
      <circle cx="144" cy="380" r="8" fill="#2F8B70"/>
      <text x="166" y="392" fill="#26372F" font-size="33" font-weight="700" font-family="${FONT_STACK}">${escapeXml(payload.topicTitle)}</text>
      <line x1="104" y1="470" x2="976" y2="470" stroke="#ECE4D8" stroke-width="2"/>
      ${section(weaknessLabel, payload.weakness, 542)}
      ${section(planLabel, payload.improvementPlan, 764)}
      ${section(verificationLabel, payload.verificationPath, 986)}
      <text x="104" y="1240" fill="#9A8E82" font-size="20" font-weight="500" font-family="${FONT_STACK}">${escapeXml(decodeEscaped('\\u628a\\u53d8\\u5316\\u8bb0\\u4e0b\\u6765\\uff0c\\u8ba9\\u81ea\\u5df1\\u6162\\u6162\\u53d8\\u6e05\\u6670'))}</text>
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
