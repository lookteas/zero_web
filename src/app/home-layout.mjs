export function getHomeStatusItems(overview) {
  const continuousDays = overview.continuousDays ?? 0
  const pendingReviewCount = overview.pendingReviewCount ?? 0

  return [
    {
      key: 'continuousDays',
      label: '\u8fde\u7eed\u6253\u5361',
      value: `${continuousDays} \u5929`,
      metric: String(continuousDays),
      unit: '\u5929',
      badges: continuousDays > 0
        ? [
            { label: '\u8fdb\u884c\u4e2d', tone: /** @type {const} */ ('primary') },
            { label: '\u5df2\u4fdd\u6301', tone: /** @type {const} */ ('primary') },
          ]
        : [{ label: '\u4eca\u5929\u5f00\u59cb', tone: /** @type {const} */ ('primary') }],
      ornamentKind: /** @type {const} */ ('orbit'),
    },
    {
      key: 'pendingReviewCount',
      label: '\u5f85\u590d\u76d8',
      value: `${pendingReviewCount} \u6761`,
      metric: String(pendingReviewCount),
      unit: '\u6761',
      badges: pendingReviewCount > 0
        ? [{ label: '\u5148\u5904\u7406 1 \u6761', tone: /** @type {const} */ ('warning') }]
        : [{ label: '\u6682\u65f6\u6e05\u7a7a', tone: /** @type {const} */ ('primary') }],
      ornamentKind: /** @type {const} */ ('orbit'),
    },
  ]
}

export function getHomeSections() {
  return [
    { key: 'statusRow' },
    { key: 'todayFocus' },
  ]
}
