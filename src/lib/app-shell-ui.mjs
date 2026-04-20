export function getDesktopAccountAreaClassName() {
  return 'hidden md:flex items-center justify-end gap-3'
}

export function getBottomTabItemClassName(active) {
  const baseClassName = 'flex min-h-[50px] items-center justify-center rounded-2xl border px-1 text-center text-[11px] font-medium leading-tight transition'

  if (active) {
    return [
      baseClassName,
      'border-[color:rgba(19,111,99,0.16)]',
      'bg-[linear-gradient(180deg,rgba(232,244,238,0.98)_0%,rgba(219,238,229,0.96)_100%)]',
      'text-[var(--primary)]',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(19,111,99,0.08),0_10px_24px_rgba(19,111,99,0.16),0_3px_8px_rgba(15,23,42,0.06)]',
    ].join(' ')
  }

  return [
    baseClassName,
    'border-transparent',
    'bg-transparent',
    'text-[var(--foreground-soft)]',
    'hover:bg-[var(--surface-muted)]/75',
    'hover:text-[var(--foreground)]',
  ].join(' ')
}