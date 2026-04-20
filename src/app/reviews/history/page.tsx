import type { ReactNode } from 'react'

import { AppShell } from '@/components/app-shell'
import { getApiUnavailableCopy } from '@/app/api-copy.mjs'
import { PrimaryButton, PrimaryLinkButton } from '@/components/primary-button'
import { SectionCard } from '@/components/section-card'
import { listReviewHistoryRecords } from '@/lib/api'
import { requireLogin } from '@/lib/auth'
import { reviewResultLabelMap } from '@/lib/labels'

import { getReviewHistoryCardSummary } from './history-card.mjs'
import { buildReviewHistoryQueryString, resolveReviewHistoryFilters } from './history-filters.mjs'

type ReviewsHistoryPageProps = {
  searchParams: Promise<{ startDate?: string; endDate?: string; keyword?: string; open?: string }>
}

const reviewStageLabelMap: Record<string, string> = {
  day3: '第 3 天复盘',
  day7: '第 7 天复盘',
  day30: '第 30 天复盘',
}

function formatQuickRange(days: number) {
  const now = new Date()
  const start = new Date(now)
  start.setDate(start.getDate() - (days - 1))

  return {
    startDate: `${start.getFullYear()}-${`${start.getMonth() + 1}`.padStart(2, '0')}-${`${start.getDate()}`.padStart(2, '0')}`,
    endDate: `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, '0')}-${`${now.getDate()}`.padStart(2, '0')}`,
  }
}

function ResultPill({ result }: { result: string }) {
  const isDone = result === 'done'
  const isFailed = result === 'failed'

  const className = isDone
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : isFailed
      ? 'border-rose-200 bg-rose-50 text-rose-700'
      : 'border-amber-200 bg-amber-50 text-amber-700'

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-medium leading-5 ${className}`}>
      {reviewResultLabelMap[result] || result}
    </span>
  )
}

function MetaPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-1 text-[12px] font-medium leading-5 text-[var(--foreground-soft)]">
      {children}
    </span>
  )
}

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[22px] border border-[var(--border-soft)] bg-white/88 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <p className="text-[13px] font-semibold text-[var(--foreground)] md:text-sm">{title}</p>
      <div className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">{children}</div>
    </div>
  )
}

export default async function ReviewsHistoryPage({ searchParams }: ReviewsHistoryPageProps) {
  await requireLogin()

  const query = await searchParams
  const filters = resolveReviewHistoryFilters(query)
  const openRecordId = Number(query.open || 0)

  let records
  try {
    records = await listReviewHistoryRecords(filters)
  } catch {
    const apiUnavailable = getApiUnavailableCopy()

    return (
      <AppShell title="复盘历史" description={apiUnavailable.pageDescription}>
        <SectionCard title={apiUnavailable.cardTitle} description={apiUnavailable.cardDescription}>
          <p className="text-sm text-[var(--foreground-soft)]">{apiUnavailable.hint}</p>
        </SectionCard>
      </AppShell>
    )
  }

  const last7Query = buildReviewHistoryQueryString({ ...formatQuickRange(7), keyword: filters.keyword })
  const last30Query = buildReviewHistoryQueryString({ ...formatQuickRange(30), keyword: filters.keyword })
  const resetQuery = buildReviewHistoryQueryString({})

  return (
    <AppShell title="复盘历史" description="默认先看最近 30 天，卡片默认折叠，只先展示时间、主题和摘要。">
      <SectionCard title="筛选复盘记录" description="需要时按时间范围和关键词回看过去提交过的复盘。">
        <div className="flex flex-wrap gap-3">
          <PrimaryLinkButton href={`/reviews/history${last7Query}`} variant="secondary" block={false}>
            最近 7 天
          </PrimaryLinkButton>
          <PrimaryLinkButton href={`/reviews/history${last30Query}`} variant="secondary" block={false}>
            最近 30 天
          </PrimaryLinkButton>
          <PrimaryLinkButton href={`/reviews/history${resetQuery}`} variant="secondary" block={false}>
            重置筛选
          </PrimaryLinkButton>
          <PrimaryLinkButton href="/reviews" variant="secondary" block={false}>
            回到复盘工作台
          </PrimaryLinkButton>
        </div>

        <form className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_1.4fr_auto]">
          <label className="grid gap-2 text-sm text-[var(--foreground-soft)]">
            <span>开始日期</span>
            <input type="date" name="startDate" defaultValue={filters.startDate} className="rounded-[18px] border border-[var(--border-soft)] bg-white px-4 py-3 text-[var(--foreground)]" />
          </label>
          <label className="grid gap-2 text-sm text-[var(--foreground-soft)]">
            <span>结束日期</span>
            <input type="date" name="endDate" defaultValue={filters.endDate} className="rounded-[18px] border border-[var(--border-soft)] bg-white px-4 py-3 text-[var(--foreground)]" />
          </label>
          <label className="grid gap-2 text-sm text-[var(--foreground-soft)]">
            <span>关键词搜索</span>
            <input type="search" name="keyword" defaultValue={filters.keyword} placeholder="搜索主题、摘要、真实情况、建议" className="rounded-[18px] border border-[var(--border-soft)] bg-white px-4 py-3 text-[var(--foreground)]" />
          </label>
          <PrimaryButton type="submit" block={false} className="md:self-end">
            查询
          </PrimaryButton>
        </form>
      </SectionCard>

      <section className="overflow-hidden rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-[linear-gradient(180deg,rgba(245,250,247,0.96)_0%,rgba(255,255,255,0.98)_48%,rgba(243,248,245,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.94)]">
        <div className="border-b border-[rgba(205,219,212,0.72)] bg-[radial-gradient(circle_at_top_left,rgba(35,133,117,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,250,248,0.9)_100%)] px-4 py-4 md:px-5 md:py-5">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-[rgba(41,122,106,0.18)] bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[var(--primary)] shadow-[0_6px_16px_rgba(19,111,99,0.08)]">
              已提交复盘
            </span>
            <div>
              <h2 className="text-[18px] font-semibold tracking-[0.01em] text-[var(--foreground)] md:text-[20px]">复盘历史记录</h2>
              <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
                当前共找到 {records.length} 条记录。默认折叠，先看时间、主题和摘要，需要时再展开查看完整内容。
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 md:px-5 md:py-5">
          {records.length > 0 ? (
            <div className="space-y-3">
              {records.map((record) => (
                <details
                  key={record.id}
                  open={record.id === openRecordId}
                  className="rounded-[24px] border border-[var(--border-soft)] bg-white/88 shadow-[0_12px_28px_rgba(15,23,42,0.04)]"
                >
                  <summary className="list-none cursor-pointer px-4 py-4 md:px-5 md:py-5">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <span className="text-[12px] font-medium tracking-[0.04em] text-[var(--foreground-soft)]">{record.submittedAt}</span>
                      <span className="text-[16px] font-semibold text-[var(--foreground)] md:text-[17px]">{record.topicTitle}</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
                      {getReviewHistoryCardSummary(record)}
                    </p>
                  </summary>

                  <div className="border-t border-[rgba(205,219,212,0.72)] px-4 py-4 md:px-5 md:py-5">
                    <div className="flex flex-wrap gap-2">
                      <MetaPill>{reviewStageLabelMap[record.reviewStage] || record.reviewStage}</MetaPill>
                      <MetaPill>任务日期：{record.taskDate}</MetaPill>
                      <ResultPill result={record.result} />
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <DetailCard title="这次真实情况">
                        {record.actualSituation || '这次没有补充真实情况。'}
                      </DetailCard>
                      <DetailCard title="下次怎么调整">
                        {record.suggestion || '这次没有补充下一步建议。'}
                      </DetailCard>
                      <div className="md:col-span-2">
                        <DetailCard title="关联任务摘要">
                          {record.topicSummary || '这条任务没有单独摘要。'}
                        </DetailCard>
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-[var(--foreground-soft)]">这个时间范围里还没有找到已提交的复盘记录，换个日期或关键词试试。</p>
          )}
        </div>
      </section>
    </AppShell>
  )
}
