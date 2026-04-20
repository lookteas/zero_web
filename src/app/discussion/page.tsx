import { getApiUnavailableCopy } from '@/app/api-copy.mjs'
import Image from 'next/image'
import Link from 'next/link'

import { AppShell } from '@/components/app-shell'
import { SectionCard } from '@/components/section-card'
import { requireLogin } from '@/lib/auth'
import { getCurrentDiscussion } from '@/lib/api'

import { buildDiscussionShareCardQuery, formatDiscussionTimeLabel } from './discussion-share.mjs'
import { resolveMeetingProvider } from './meeting-provider.mjs'

export default async function DiscussionPage() {
  await requireLogin()

  let discussion
  try {
    discussion = await getCurrentDiscussion()
  } catch {
    const apiUnavailable = getApiUnavailableCopy()

    return (
      <AppShell title="每周讨论" description={apiUnavailable.pageDescription}>
        <SectionCard title={apiUnavailable.cardTitle} description={apiUnavailable.cardDescription}>
          <p className="text-sm text-slate-600">{apiUnavailable.hint}</p>
        </SectionCard>
      </AppShell>
    )
  }

  const shareCardUrl = `/discussion/share-card${buildDiscussionShareCardQuery(discussion)}`
  const goals = (discussion.goals || '').split('\n').map((item) => item.trim()).filter(Boolean)
  const meetingProvider = resolveMeetingProvider(discussion.meetingLink)

  return (
    <AppShell title="每周讨论" description="讨论主题自动跟随每周投票第一名，默认周六晚 8 点开始。">
      <SectionCard title="这周聊什么" description="票数最高的话题会自动成为本周讨论主题，不需要再手动切换。">
        <div className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">本周主题</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{discussion.topicTitle}</p>
            <p className="mt-2 text-slate-600">{discussion.description || '这次围绕票数最高的话题，聊真实场景、卡点和下周还能怎么练。'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">讨论时间</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{formatDiscussionTimeLabel(discussion.meetingTime)}</p>
            <p className="mt-2 text-slate-600">默认从投票所在周的周六晚 8 点开始。</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 md:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">讨论目标</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700">当前入口：{meetingProvider.label}</span>
            </div>
            <div className="mt-2 space-y-2 text-slate-700">
              {goals.length > 0 ? goals.map((item) => <p key={item}>{item}</p>) : <p>先分享真实练习过程，再把最容易卡住的地方讲清楚，最后带走一个下周继续练的小动作。</p>}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">讨论入口支持三类跳转</p>
              <p className="mt-2">1. 腾讯会议  2. 飞书会议  3. 其他自定义会议链接。当前会根据链接自动识别并展示对应入口。</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/vote" className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700">回到每周投票</Link>
              {discussion.meetingLink ? <a href={discussion.meetingLink} target="_blank" rel="noreferrer" className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">{meetingProvider.actionText}</a> : null}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="分享卡片" description="这张图可以直接发到微信群和好友，也可以先保存再转发。">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <Image src={shareCardUrl} alt="每周讨论分享卡片" width={1200} height={630} className="h-auto w-full" unoptimized />
          </div>
          <div className="space-y-4 rounded-3xl border border-slate-200 p-4 text-sm text-slate-700">
            <div>
              <p className="font-medium text-slate-900">适合怎么用</p>
              <p className="mt-2">把这张卡片发到微信群、好友对话，或者保存到手机相册后再分享，都比较顺手。</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">默认分享文案</p>
              <p className="mt-2 whitespace-pre-line rounded-2xl bg-slate-50 p-3 text-slate-600">{discussion.shareText || `${discussion.discussionTitle}
主题：${discussion.topicTitle}
时间：${formatDiscussionTimeLabel(discussion.meetingTime)}`}</p>
            </div>
            <div className="grid gap-3">
              <a href={shareCardUrl} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-slate-700">打开分享图</a>
              <a href={shareCardUrl} download={`discussion-${discussion.weekStartDate}.svg`} className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-white">下载分享图</a>
            </div>
          </div>
        </div>
      </SectionCard>
    </AppShell>
  )
}
