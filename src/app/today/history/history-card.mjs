export function getHistoryCardSummary(task) {
  return (
    task.weakness ||
    task.improvementPlan ||
    task.verificationPath ||
    task.reflectionNote ||
    '这条记录还没写下具体内容'
  )
}
