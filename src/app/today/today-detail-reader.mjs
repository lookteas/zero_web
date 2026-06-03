function normalizeParagraph(value) {
  return String(value || '')
    .replace(/\s+/g, '')
    .replace(/[。！？；，,.;:：]+$/g, '')
    .trim()
}

function isRepeatedSummaryLine(line, summary) {
  const normalizedLine = normalizeParagraph(line)
  const normalizedSummary = normalizeParagraph(summary)

  return normalizedLine !== '' && normalizedLine === normalizedSummary
}

function cleanDisplayLine(line) {
  return String(line || '').replace(/^[·•\-]\s*/, '').trim()
}

function splitDenseDetailText(text) {
  const normalized = String(text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length > 1 || normalized.length <= 180) {
    return lines
  }

  const sentences = normalized.match(/[^。！？；]+[。！？；]?/g) || [normalized]
  const paragraphs = []
  let current = ''

  for (const sentence of sentences.map((item) => item.trim()).filter(Boolean)) {
    if (current && current.length + sentence.length > 120) {
      paragraphs.push(current)
      current = sentence
    } else {
      current = current ? `${current}${sentence}` : sentence
    }
  }

  if (current) {
    paragraphs.push(current)
  }

  return paragraphs
}

function getDetailGroupTitle(line) {
  const numbered = line.match(/^((?:\d+|[一二三四五六七八九十]+)\s*[-、.．]\s*)(.+)$/)
  const bullet = line.match(/^[·•\-]\s*(.+)$/)
  const rawTitle = numbered?.[2] || bullet?.[1] || ''
  const title = rawTitle.trim()

  if (!title) {
    return ''
  }

  if (title.length <= 36 && /[:：]$/.test(title)) {
    return title.replace(/[:：]$/, '')
  }

  if (numbered && title.length <= 24) {
    return title
  }

  return ''
}

export function buildAwarenessDetailSections({ summary, details }) {
  const lines = splitDenseDetailText(details).filter((line, index) => index !== 0 || !isRepeatedSummaryLine(line, summary))
  const lead = []
  const groups = []
  const more = []
  let currentGroup = null

  for (const line of lines) {
    const groupTitle = getDetailGroupTitle(line)

    if (groupTitle) {
      currentGroup = { title: groupTitle, body: [] }
      groups.push(currentGroup)
      continue
    }

    const displayLine = cleanDisplayLine(line)

    if (currentGroup) {
      currentGroup.body.push(displayLine)
      continue
    }

    if (lead.length < 2) {
      lead.push(displayLine)
    } else {
      more.push(displayLine)
    }
  }

  if (groups.length === 0 && more.length > 0) {
    const promoted = more.splice(0, 3)
    groups.push({ title: '分段理解', body: promoted })
  }

  return { lead, groups, more }
}
