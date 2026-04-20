import { apiBaseUrl } from '@/lib/env'

export const apiUnavailableCopy = Object.freeze({
  pageDescription: '暂时连不上后端接口。',
  cardTitle: '接口暂时不可用',
  cardDescription: '请先确认后端 API 服务已启动，再回来刷新。',
})

export const defaultApiUnavailableHint = `默认后端地址是 \`${apiBaseUrl}\`。`

export function getApiReachabilityHint(prefix = '请检查') {
  return `${prefix} \`${apiBaseUrl}\` 是否可访问。`
}

export function getApiDataUnavailableHint(subject) {
  return getApiReachabilityHint(`当前未能读取到${subject}，请检查`)
}

export function getApiUnavailableCopy(hint = defaultApiUnavailableHint) {
  return {
    ...apiUnavailableCopy,
    hint,
  }
}