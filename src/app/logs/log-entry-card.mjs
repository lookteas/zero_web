export function getLogEntryPrimaryLine(entry) {
  return entry.summary?.trim() || entry.remark?.trim() || '这次先记下一个当下的变化'
}
