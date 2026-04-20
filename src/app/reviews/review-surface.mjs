export function getReviewSurfaceTone({ recovery }) {
  return recovery
    ? {
        tone: 'recovery',
        title: '恢复复盘',
        className: 'border-amber-200 bg-amber-50',
      }
    : {
        tone: 'default',
        title: '待复盘',
        className: 'border-[var(--border-soft)] bg-white',
      }
}

export function getReviewFormCopy({ recovery }) {
  return recovery
    ? {
        resultLabel: '这次执行结果',
        actualLabel: '过程回顾',
        actualHint: '把这段间隔里真正发生的过程写下来，包括偏离、停顿和真实原因。',
        suggestionLabel: '下一步调整',
        suggestionHint: '写下下一轮更容易重新接住自己的办法，尽量具体、可执行。',
      }
    : {
        resultLabel: '这次执行结果',
        actualLabel: '过程回顾',
        actualHint: '把这次真正发生的过程写下来，包括偏差、卡住点和真实原因。',
        suggestionLabel: '下一步调整',
        suggestionHint: '写下下一次更容易做到的办法，尽量具体、可执行。',
      }
}

export function getReviewResultOptions() {
  return [
    { value: 'done' },
    { value: 'partial' },
    { value: 'failed' },
  ]
}