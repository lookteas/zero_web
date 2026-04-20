export function getReviewHistoryCardSummary(record) {
  return record.summary || record.actualSituation || record.suggestion || record.topicSummary || '这条复盘还没有补充更多内容。'
}
