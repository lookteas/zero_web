import { buildTodayShareCardSvgWithLoginQr } from '../today-share-card-server.mjs'

export const dynamic = 'force-dynamic'

const FALLBACK = {
  dateLabel: '今日',
  topicTitle: '今天先把正在练的这一点写清楚',
  topicSummary: '先把这条意识提升点的重点概要写清楚',
  weakness: '今天先把当前卡点写具体',
  improvementPlan: '先把今天准备做的动作认真执行',
  verificationPath: '今晚回看时确认自己是否真的做到了',
}

function decodeEscaped(value: string) {
  return JSON.parse(`"${value}"`)
}

function read(searchParams: URLSearchParams, key: string, fallback: string) {
  const value = String(searchParams.get(key) || '').trim()
  return value || decodeEscaped(fallback)
}

function loginUrlFrom(request: Request, searchParams: URLSearchParams) {
  const explicitUrl = String(searchParams.get('loginUrl') || '').trim()

  if (explicitUrl) {
    return explicitUrl
  }

  const requestUrl = new URL(request.url)
  return new URL('/login', requestUrl.origin).toString()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const svg = buildTodayShareCardSvgWithLoginQr({
    taskDate: read(searchParams, 'taskDate', ''),
    dateLabel: read(searchParams, 'dateLabel', FALLBACK.dateLabel),
    topicTitle: read(searchParams, 'topicTitle', FALLBACK.topicTitle),
    topicSummary: read(searchParams, 'topicSummary', FALLBACK.topicSummary),
    weakness: read(searchParams, 'weakness', FALLBACK.weakness),
    improvementPlan: read(searchParams, 'improvementPlan', FALLBACK.improvementPlan),
    verificationPath: read(searchParams, 'verificationPath', FALLBACK.verificationPath),
    loginUrl: loginUrlFrom(request, searchParams),
  })

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
