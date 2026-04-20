const fieldChromeMap = {
  actualSituation: {
    label: '过程回顾',
    pillClassName: 'border-[rgba(100,116,139,0.12)] bg-[rgba(248,250,252,0.94)] text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]',
    dotClassName: 'rounded-full border border-[rgba(100,116,139,0.14)] bg-[radial-gradient(circle_at_50%_50%,rgba(100,116,139,0.58)_0%,rgba(100,116,139,0.18)_48%,rgba(255,255,255,0.96)_100%)] shadow-[0_0_0_4px_rgba(226,232,240,0.5)]',
    panelClassName: 'border-[rgba(226,232,240,0.82)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(249,250,251,0.98)_100%)]',
  },
  suggestion: {
    label: '下一步调整',
    pillClassName: 'border-[rgba(19,111,99,0.1)] bg-[rgba(244,250,247,0.94)] text-[var(--primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]',
    dotClassName: 'rounded-full border border-[rgba(19,111,99,0.12)] bg-[radial-gradient(circle_at_50%_50%,rgba(19,111,99,0.54)_0%,rgba(19,111,99,0.16)_48%,rgba(255,255,255,0.96)_100%)] shadow-[0_0_0_4px_rgba(223,242,233,0.42)]',
    panelClassName: 'border-[rgba(216,230,225,0.82)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(246,250,248,0.98)_100%)]',
  },
}

export function getReviewsFieldChrome(field) {
  return fieldChromeMap[field]
}