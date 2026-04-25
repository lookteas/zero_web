export function getAdminUserPageSummaryCards(summary = {}) {
  return [
    { label: '用户总数', value: String(summary.total ?? 0), description: '当前已注册进入系统的全部用户。' },
    { label: '启用用户', value: String(summary.active ?? 0), description: '状态为启用的用户，可继续正常使用系统。' },
    { label: '已绑邮箱', value: String(summary.withEmail ?? 0), description: '便于后续做通知或找回链路。' },
    { label: '已绑手机', value: String(summary.withMobile ?? 0), description: '便于后续补短信或手机号登录链路。' },
  ]
}

export function getAdminUsersEmptyStateCopy(filters = {}) {
  const hasFilters = Boolean(String(filters.keyword || '').trim()) || filters.status === 0 || filters.status === 1

  if (hasFilters) {
    return {
      title: '没有找到符合筛选条件的用户',
      description: '可以先清空筛选条件，再查看全部用户，或继续调整关键词和状态。',
      actionLabel: '查看全部用户',
    }
  }

  return {
    title: '还没有用户数据',
    description: '当前还没有可展示的注册用户，等前台有新用户注册后，这里会自动出现。',
    actionLabel: '刷新用户列表',
  }
}

export function getAdminUserActivityStats(user = {}) {
  return [
    {
      label: '已写主题',
      value: String(user.topicCount ?? 0),
      description: '当前已生成的每日主题记录数',
    },
  ]
}
