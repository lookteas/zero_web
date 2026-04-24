export const authErrorCopy = Object.freeze({
  loginFailed: '登录失败，请重新检查账号和密码。',
  registerFailed: '注册失败，请确认账号可用，且密码不少于 6 位。',
  adminLoginFailed: '管理员登录失败，请检查账号和密码是否正确。',
})

export const actionErrorCopy = Object.freeze({
  todaySubmitFailed: '提交前请先把当前卡点、改进行动和验证方式填写完整。',
  topicSaveFailed: '主题保存失败，请稍后再试',
  discussionSaveFailed: '保存讨论失败',
  userSaveFailed: '保存用户资料失败，请稍后再试',
  voteSubmitFailed: '投票暂时失败，请稍后再试',
})

export function resolveActionErrorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback
}
