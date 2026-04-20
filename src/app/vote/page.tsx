import { getApiDataUnavailableHint, getApiUnavailableCopy } from '@/app/api-copy.mjs'
import Link from 'next/link'

import { AppShell } from '@/components/app-shell'
import { SectionCard } from '@/components/section-card'
import { requireLogin } from '@/lib/auth'
import { getCurrentWeeklyVote } from '@/lib/api'

import { submitVoteAction } from './actions'
import { VoteDialogs } from './vote-dialogs'

type VotePageProps = {
  searchParams: Promise<{ voted?: string; error?: string }>
}

export default async function VotePage({ searchParams }: VotePageProps) {
  await requireLogin()

  const query = await searchParams

  let vote
  try {
    vote = await getCurrentWeeklyVote()
  } catch {
    const apiUnavailable = getApiUnavailableCopy(getApiDataUnavailableHint('投票数据'))

    return (
      <AppShell title="每周投票" description={apiUnavailable.pageDescription}>
        <SectionCard title={apiUnavailable.cardTitle} description={apiUnavailable.cardDescription}>
          <p className="text-sm text-slate-600">{apiUnavailable.hint}</p>
        </SectionCard>
      </AppShell>
    )
  }

  const candidates = Array.isArray(vote.candidates) ? vote.candidates : []
  const leader = candidates[0]
  const votingClosed = vote.status === 'closed'
  const disableVoting = votingClosed || vote.todayHasVoted

  return (
    <AppShell title="每周投票" description="每周一到周五可以投票；投的是下一个周六到周五的 7 个主题，票数最高的话题会自动进入周六晚讨论。">
      {query.voted ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">投票已记录，今天的投票资格已使用。</section> : null}
      {query.error ? <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{query.error}</section> : null}

      <SectionCard title="本周投票" description="每个账号每天只能投 1 次，投票时间为周一到周五。">
        <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">投票周期</p>
            <p className="mt-1 font-medium text-slate-900">开始：{vote.voteStartAt}</p>
            <p className="mt-1 text-slate-600">截止：{vote.voteEndAt}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">当前领先</p>
            <p className="mt-1 font-medium text-slate-900">{leader?.topicTitle || '暂无领先主题'}</p>
            <p className="mt-1 text-slate-600">{leader ? `${leader.voteCount} 票，当前排名第一` : '还没有用户投票'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">我的今日状态</p>
            <p className="mt-1 font-medium text-slate-900">{vote.todayHasVoted ? '今天已投票' : '今天还可以投 1 次'}</p>
            <p className="mt-1 text-slate-600">{vote.todayHasVoted ? `投票时间：${vote.todayVotedAt}` : '投完后会自动展示投票详情'}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="space-y-1 text-sm text-slate-700">
            <p className="font-medium text-slate-900">投票详情 / 我的投票记录</p>
            <p>默认收起，需要时再点开弹窗查看，保证页面信息不过载。</p>
          </div>
          <VoteDialogs vote={vote} />
        </div>

        <div className="mt-5 space-y-3">
          {candidates.map((item) => {
            const isLatestChoice = vote.userCandidateId === item.id
            const isTodayChoice = vote.todayCandidateId === item.id
            const isLeader = leader?.id === item.id

            return (
              <div key={item.id} className={`rounded-2xl border p-4 ${isTodayChoice ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-white'}`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-900">{item.topicTitle}</p>
                      {item.topicDateLabel ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{item.topicDateLabel}</span> : null}
                      {isLeader ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">当前领先</span> : null}
                      {isTodayChoice ? <span className="rounded-full bg-sky-100 px-3 py-1 text-xs text-sky-700">我今天投的</span> : null}
                      {!isTodayChoice && isLatestChoice ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">我最近一次投票</span> : null}
                    </div>
                    <p className="text-sm text-slate-600">{item.topicSummary}</p>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <p className="text-sm font-medium text-slate-700">已获 {item.voteCount} 票</p>
                    <form action={submitVoteAction}>
                      <input type="hidden" name="candidateId" value={item.id} />
                      <button type="submit" disabled={disableVoting} className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${disableVoting ? 'cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-700'}`}>
                        {votingClosed ? '本周投票已结束' : vote.todayHasVoted ? '今日已投票' : '投这一票'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard title="继续往下" description="投完票后，可以直接进入本周讨论页查看最终主题和会议安排。">
        <div className="flex flex-wrap gap-3">
          <Link href="/discussion" className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-sky-300 hover:text-sky-700">去看每周讨论</Link>
        </div>
      </SectionCard>
    </AppShell>
  )
}
