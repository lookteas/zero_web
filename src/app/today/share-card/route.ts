import { buildTodayShareCardSvg } from '../today-share-card.mjs'

export const dynamic = 'force-dynamic'

const FALLBACK = {
  dateLabel: '今日',
  topicTitle: '今天先把正在练的这一点写清楚',
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const svg = buildTodayShareCardSvg({
    dateLabel: read(searchParams, 'dateLabel', FALLBACK.dateLabel),
    topicTitle: read(searchParams, 'topicTitle', FALLBACK.topicTitle),
    weakness: read(searchParams, 'weakness', FALLBACK.weakness),
    improvementPlan: read(searchParams, 'improvementPlan', FALLBACK.improvementPlan),
    verificationPath: read(searchParams, 'verificationPath', FALLBACK.verificationPath),
  })

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
