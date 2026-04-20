const feedbackChromeMap = {
  successAlert: {
    className: 'border border-emerald-200/80 bg-[linear-gradient(180deg,rgba(248,253,250,0.96)_0%,rgba(239,250,244,0.96)_100%)] text-[var(--success-text)] shadow-[0_10px_24px_rgba(4,120,87,0.05)]',
    markerClassName: 'bg-[radial-gradient(circle_at_50%_50%,rgba(4,120,87,0.72)_0%,rgba(4,120,87,0.22)_55%,rgba(255,255,255,0.98)_100%)] shadow-[0_0_0_5px_rgba(220,252,231,0.9)]',
  },
  emptyState: {
    className: 'rounded-[22px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.98)_100%)] px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)]',
    eyebrowClassName: 'text-[11px] font-semibold tracking-[0.08em] text-[var(--foreground-faint)]',
    titleClassName: 'text-[14px] font-semibold text-[var(--foreground)] md:text-[15px]',
    bodyClassName: 'text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7',
  },
  secondaryButton: {
    className: 'border border-[rgba(199,219,212,0.95)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,252,250,0.98)_100%)] text-[var(--foreground)] shadow-[0_10px_24px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.92)] hover:border-[rgba(19,111,99,0.18)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(244,250,247,0.98)_100%)]',
  },
}

const emptyStateCopyMap = {
  todayLogs: {
    title: '今天还没有新的觉察记录',
    body: '继续做今天的练习，留意到变化时再去“觉察”页补一条，给之后回看的自己留个线索。',
  },
  logs: {
    title: '这里还没有觉察记录',
    body: '等你捕捉到第一条真实变化时，就从上面的工作区开始记下这一瞬间。',
  },
  reviews: {
    title: '现在还没到需要复盘的时候',
    body: '先把今天的打卡和觉察继续做好，系统会在真正到期时把最该先处理的一条带到这里。',
  },
}

export function getFeedbackChrome(kind) {
  return feedbackChromeMap[kind]
}

export function getEmptyStateCopy(kind) {
  return emptyStateCopyMap[kind]
}