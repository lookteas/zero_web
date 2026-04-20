export function resolveMeetingProvider(meetingLink = '') {
  const link = String(meetingLink || '').trim().toLowerCase()

  if (link.includes('meeting.tencent.com') || link.includes('voovmeeting.com') || link.startsWith('wemeet://') || link.startsWith('tencentmeeting://')) {
    return {
      type: 'tencent',
      label: '腾讯会议',
      actionText: '打开腾讯会议',
    }
  }

  if (link.includes('vc.feishu.cn') || link.includes('meet.feishu.cn') || link.startsWith('feishu://')) {
    return {
      type: 'feishu',
      label: '飞书会议',
      actionText: '打开飞书会议',
    }
  }

  return {
    type: 'custom',
    label: '自定义会议',
    actionText: '打开讨论入口',
  }
}
