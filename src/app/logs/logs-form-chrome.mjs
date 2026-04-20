const fieldChromeMap = {
  event: {
    label: '\u53d1\u751f\u4e86\u4ec0\u4e48',
    pillClassName: 'border-[rgba(19,111,99,0.12)] bg-[rgba(240,249,245,0.92)] text-[var(--primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.86)]',
    dotClassName: 'rounded-full border border-[rgba(19,111,99,0.14)] bg-[radial-gradient(circle_at_50%_50%,rgba(19,111,99,0.6)_0%,rgba(19,111,99,0.22)_48%,rgba(255,255,255,0.96)_100%)] shadow-[0_0_0_4px_rgba(223,242,233,0.48)]',
    panelClassName: 'border-[rgba(216,230,225,0.88)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(246,251,248,0.98)_100%)]',
  },
  change: {
    label: '\u6211\u5f53\u65f6\u7684\u72b6\u6001',
    pillClassName: 'border-[rgba(71,85,105,0.12)] bg-[rgba(248,250,252,0.94)] text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]',
    dotClassName: 'rounded-full border border-[rgba(71,85,105,0.14)] bg-[radial-gradient(circle_at_50%_50%,rgba(71,85,105,0.58)_0%,rgba(71,85,105,0.18)_48%,rgba(255,255,255,0.96)_100%)] shadow-[0_0_0_4px_rgba(226,232,240,0.52)]',
    panelClassName: 'border-[rgba(226,232,240,0.88)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(248,250,252,0.98)_100%)]',
  },
  note: {
    label: '\u7559\u7ed9\u81ea\u5df1\u7684\u63d0\u9192',
    pillClassName: 'border-[rgba(120,113,108,0.12)] bg-[rgba(250,248,245,0.94)] text-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
    dotClassName: 'rounded-full border border-[rgba(120,113,108,0.14)] bg-[radial-gradient(circle_at_50%_50%,rgba(120,113,108,0.56)_0%,rgba(120,113,108,0.18)_48%,rgba(255,255,255,0.96)_100%)] shadow-[0_0_0_4px_rgba(245,245,244,0.72)]',
    panelClassName: 'border-[rgba(231,229,228,0.88)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(250,249,247,0.98)_100%)]',
  },
}

export function getLogsFieldChrome(field) {
  return fieldChromeMap[field]
}
