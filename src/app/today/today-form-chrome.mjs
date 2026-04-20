const fieldChromeMap = {
  weakness: {
    label: '当前卡点',
    pillClassName: 'border-[rgba(71,85,105,0.16)] bg-[rgba(248,250,252,0.92)] text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.86)]',
    dotClassName: 'rounded-full border border-[rgba(71,85,105,0.18)] bg-[radial-gradient(circle_at_50%_50%,rgba(71,85,105,0.65)_0%,rgba(71,85,105,0.22)_48%,rgba(255,255,255,0.96)_100%)] shadow-[0_0_0_4px_rgba(226,232,240,0.58)]',
    panelClassName: 'border-[rgba(226,232,240,0.9)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)]',
  },
  improvementPlan: {
    label: '改进动作',
    pillClassName: 'border-[rgba(19,111,99,0.16)] bg-[rgba(237,246,242,0.92)] text-[var(--primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]',
    dotClassName: 'rounded-full border border-[rgba(19,111,99,0.18)] bg-[radial-gradient(circle_at_50%_50%,rgba(19,111,99,0.7)_0%,rgba(19,111,99,0.26)_48%,rgba(255,255,255,0.96)_100%)] shadow-[0_0_0_4px_rgba(221,242,233,0.62)]',
    panelClassName: 'border-[rgba(216,230,225,0.96)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(244,250,247,0.97)_100%)]',
  },
  verificationPath: {
    label: '验证方式',
    pillClassName: 'border-[rgba(120,113,108,0.16)] bg-[rgba(250,248,245,0.94)] text-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
    dotClassName: 'rounded-full border border-[rgba(120,113,108,0.16)] bg-[radial-gradient(circle_at_50%_50%,rgba(120,113,108,0.72)_0%,rgba(120,113,108,0.22)_48%,rgba(255,255,255,0.96)_100%)] shadow-[0_0_0_4px_rgba(245,245,244,0.9)]',
    panelClassName: 'border-[rgba(231,229,228,0.96)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(250,249,247,0.97)_100%)]',
  },
}

export function getTodayFieldChrome(field) {
  return fieldChromeMap[field]
}