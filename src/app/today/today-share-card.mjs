const COPY = {
  topicLabel: '\u4e3b\u9898\u6458\u8981',
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

const THEMES = [
  { bgA: '#FBF7EF', bgB: '#EEF6F0', paper: '#FFFDF8', border: '#E6DDD0', soft: '#F4EEE4', softBorder: '#E5D4BF', accent: '#D99B6A', accent2: '#2F8B70', label: '#728077', text: '#26372F', rule: '#ECE4D8', footer: '#9A8E82' },
  { bgA: '#F5F8EE', bgB: '#EFF7F4', paper: '#FFFFFA', border: '#DCE9D4', soft: '#EDF5E6', softBorder: '#D7E7CA', accent: '#8AAE72', accent2: '#4C8E7A', label: '#6F7F68', text: '#253528', rule: '#E3ECD9', footer: '#89907E' },
  { bgA: '#F5F7FB', bgB: '#EEF7F3', paper: '#FCFEFC', border: '#D9E4E2', soft: '#EAF1F3', softBorder: '#D5E1E5', accent: '#7BA7B2', accent2: '#3F8875', label: '#6C7D81', text: '#24343A', rule: '#E1E9E8', footer: '#879196' },
  { bgA: '#FFF5F1', bgB: '#F3F7EF', paper: '#FFFDFC', border: '#EADBD3', soft: '#F7EAE3', softBorder: '#E9D4C8', accent: '#D98972', accent2: '#629071', label: '#80736E', text: '#382C29', rule: '#EEE0D8', footer: '#9A847B' },
  { bgA: '#F8F4ED', bgB: '#F1F6EA', paper: '#FFFDF7', border: '#E5DCCB', soft: '#F2E9D9', softBorder: '#E3D2B9', accent: '#C99B5D', accent2: '#6E8F65', label: '#7D7567', text: '#342F26', rule: '#EAE0CF', footer: '#958873' },
  { bgA: '#F8F5FA', bgB: '#F0F6F1', paper: '#FFFDFE', border: '#E2DCE6', soft: '#F0EAF3', softBorder: '#DED4E6', accent: '#A887B7', accent2: '#578A72', label: '#79717E', text: '#302D36', rule: '#E8E1EA', footer: '#8E8492' },
  { bgA: '#F4F8F1', bgB: '#EEF7F0', paper: '#FEFFF9', border: '#DCE9D5', soft: '#EAF4E6', softBorder: '#D4E6CC', accent: '#78A56B', accent2: '#308775', label: '#6F7E68', text: '#243529', rule: '#E0EAD9', footer: '#858F7C' },
]

const FOOTERS = [
  '\u628a\u53d8\u5316\u8bb0\u4e0b\u6765\uff0c\u8ba9\u81ea\u5df1\u6162\u6162\u53d8\u6e05\u6670',
  '\u6bcf\u5929\u770b\u89c1\u4e00\u70b9\uff0c\u5c31\u5728\u6162\u6162\u957f\u51fa\u529b\u91cf',
  '\u5c0f\u5c0f\u7684\u89c9\u5bdf\uff0c\u4e5f\u4f1a\u628a\u751f\u6d3b\u5f80\u524d\u63a8\u4e00\u6b65',
  '\u4eca\u5929\u7684\u7ec3\u4e60\uff0c\u662f\u660e\u5929\u66f4\u7a33\u7684\u81ea\u5df1',
  '\u5148\u628a\u4e00\u4ef6\u5c0f\u4e8b\u505a\u6e05\u695a\uff0c\u4eba\u5c31\u4f1a\u53d8\u5f97\u7a33\u4e00\u70b9',
  '\u613f\u4f60\u5728\u4eca\u5929\uff0c\u591a\u4e00\u70b9\u770b\u89c1\u81ea\u5df1\u7684\u8010\u5fc3',
  '\u8bb0\u5f55\u4e0d\u662f\u4e3a\u4e86\u5b8c\u7f8e\uff0c\u662f\u4e3a\u4e86\u66f4\u8bda\u5b9e\u5730\u524d\u8fdb',
]

function dayIndex(taskDate = '') {
  const digits = String(taskDate).replace(/\D/g, '')
  const source = digits || '0'
  let total = 0

  for (const char of source) {
    total += Number(char) || 0
  }

  return total
}

function pickDaily(items, taskDate) {
  return items[dayIndex(taskDate) % items.length]
}

function textUnits(value) {
  return Array.from(String(value || '')).reduce((total, char) => total + charWidth(char), 0)
}

function fitFontSize(value, options) {
  const { maxUnits, maxSize, minSize } = options
  const units = textUnits(value)

  if (units <= maxUnits) {
    return maxSize
  }

  return Math.max(minSize, Math.floor((maxUnits / units) * maxSize))
}

function textLines(value, options = {}) {
  const { x = 104, y, fill = '#2A352E', size = 28, weight = 500, lineGap = 43, maxUnits = 31, maxLines = 3 } = options
  const lines = wrapText(value, maxUnits, maxLines)
  const tspans = lines
    .map((item, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineGap}">${escapeXml(item)}</tspan>`)
    .join('')

  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" font-family="${FONT_STACK}">${tspans}</text>`
}

function section(label, value, y, theme) {
  return `
    <circle cx="106" cy="${y - 8}" r="5" fill="${theme.accent}"/>
    <text x="126" y="${y}" fill="${theme.label}" font-size="21" font-weight="500" font-family="${FONT_STACK}">${escapeXml(label)}</text>
    ${textLines(value, { y: y + 50 })}
    <line x1="104" y1="${y + 154}" x2="976" y2="${y + 154}" stroke="${theme.rule}" stroke-width="2"/>
  `
}

export function buildTodayShareCardSvg(payload) {
  const topicLabel = decodeEscaped(COPY.topicLabel)
  const weaknessLabel = decodeEscaped(COPY.weaknessLabel)
  const planLabel = decodeEscaped(COPY.planLabel)
  const verificationLabel = decodeEscaped(COPY.verificationLabel)
  const theme = pickDaily(THEMES, payload.taskDate)
  const footer = decodeEscaped(pickDaily(FOOTERS, payload.taskDate))
  const titleSize = fitFontSize(payload.topicTitle, { maxUnits: 18, maxSize: 46, minSize: 36 })
  const summarySize = fitFontSize(payload.topicSummary, { maxUnits: 23, maxSize: 29, minSize: 24 })

  return `
    <svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1080" y2="1350" gradientUnits="userSpaceOnUse">
          <stop stop-color="${theme.bgA}"/>
          <stop offset="1" stop-color="${theme.bgB}"/>
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="${theme.accent}"/>
          <stop offset="1" stop-color="${theme.accent2}"/>
        </linearGradient>
      </defs>
      <rect width="1080" height="1350" rx="40" fill="url(#bg)"/>
      <rect x="40" y="40" width="1000" height="1270" rx="34" fill="${theme.paper}" fill-opacity="0.96" stroke="${theme.border}"/>
      <path d="M832 82C890 96 940 139 972 198" stroke="${theme.accent}" stroke-width="3" stroke-linecap="round" opacity="0.28"/>
      <circle cx="928" cy="142" r="48" fill="${theme.soft}"/>
      <circle cx="928" cy="142" r="19" fill="${theme.accent}" fill-opacity="0.28"/>
      <text x="104" y="126" fill="${theme.label}" font-size="23" font-weight="500" font-family="${FONT_STACK}">${escapeXml(payload.dateLabel)}</text>
      <text x="104" y="194" fill="${theme.text}" font-size="${titleSize}" font-weight="700" font-family="${FONT_STACK}">${escapeXml(payload.topicTitle)}</text>
      <rect x="104" y="232" width="74" height="4" rx="2" fill="url(#accent)"/>
      <text x="104" y="316" fill="${theme.label}" font-size="21" font-weight="500" font-family="${FONT_STACK}">${escapeXml(topicLabel)}</text>
      <rect x="104" y="342" width="680" height="84" rx="24" fill="${theme.soft}" stroke="${theme.softBorder}"/>
      <circle cx="144" cy="384" r="8" fill="${theme.accent2}"/>
      <text x="166" y="394" fill="${theme.text}" font-size="${summarySize}" font-weight="600" font-family="${FONT_STACK}">${escapeXml(payload.topicSummary)}</text>
      <line x1="104" y1="478" x2="976" y2="478" stroke="${theme.rule}" stroke-width="2"/>
      ${section(weaknessLabel, payload.weakness, 548, theme)}
      ${section(planLabel, payload.improvementPlan, 770, theme)}
      ${section(verificationLabel, payload.verificationPath, 992, theme)}
      <text x="104" y="1244" fill="${theme.footer}" font-size="26" font-weight="600" font-family="${FONT_STACK}">${escapeXml(footer)}</text>
    </svg>
  `.trim()
}

export function buildTodayShareCardQuery(payload) {
  const searchParams = new URLSearchParams()
  searchParams.set('taskDate', payload.taskDate || '')
  searchParams.set('dateLabel', payload.dateLabel)
  searchParams.set('topicTitle', payload.topicTitle)
  searchParams.set('topicSummary', payload.topicSummary)
  searchParams.set('weakness', payload.weakness)
  searchParams.set('improvementPlan', payload.improvementPlan)
  searchParams.set('verificationPath', payload.verificationPath)
  return searchParams.toString()
}
