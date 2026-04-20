import Link from 'next/link'

import { AppShell } from '@/components/app-shell'
import { getApiUnavailableCopy } from '@/app/api-copy.mjs'
import { SectionCard } from '@/components/section-card'
import { listDailyTasks } from '@/lib/api'
import { requireLogin } from '@/lib/auth'
import { taskStatusLabelMap } from '@/lib/labels'

import { saveHistoryReflectionAction, saveHistoryTaskAction } from './actions'
import { getHistoryCardSummary } from './history-card.mjs'
import { buildHistoryQueryString, resolveHistoryFilters } from './history-filters.mjs'

type HistoryPageProps = {
  searchParams: Promise<{ startDate?: string; endDate?: string; keyword?: string; saved?: string; reflected?: string; openTask?: string }>
}

export default async function TodayHistoryPage({ searchParams }: HistoryPageProps) {
  await requireLogin()

  const query = await searchParams
  const filters = resolveHistoryFilters(query)
  const openTaskId = Number(query.openTask || 0)

  let tasks
  try {
    tasks = await listDailyTasks(filters)
  } catch {
    const apiUnavailable = getApiUnavailableCopy()

    return (
      <AppShell title="历史打卡" description={apiUnavailable.pageDescription}>
        <SectionCard title={apiUnavailable.cardTitle} description={apiUnavailable.cardDescription}>
          <p className="text-sm text-slate-600">{apiUnavailable.hint}</p>
        </SectionCard>
      </AppShell>
    )
  }

  const last7Query = buildHistoryQueryString(resolveHistoryFilters({}, new Date()))
  const now = new Date()
  const last30Start = new Date(now)
  last30Start.setDate(last30Start.getDate() - 29)
  const last30Query = buildHistoryQueryString({
    startDate: `${last30Start.getFullYear()}-${`${last30Start.getMonth() + 1}`.padStart(2, '0')}-${`${last30Start.getDate()}`.padStart(2, '0')}`,
    endDate: `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, '0')}-${`${now.getDate()}`.padStart(2, '0')}`,
    keyword: filters.keyword,
  })

  return (
    <AppShell title="历史打卡" description="默认先看最近 7 天，也可以按日期筛选或搜索过去做过的任务。">
      {query.saved ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">这条历史打卡已更新。</section> : null}
      {query.reflected ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">这条后记 / 反思已保存。</section> : null}

      <SectionCard title="筛选历史记录" description="先看最近 7 天，需要时再按日期范围和关键词往前找。">
        <div className="grid gap-3 text-sm sm:flex sm:flex-wrap">
          <Link href={`/today/history${last7Query}`} className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-slate-700 sm:w-auto">最近 7 天</Link>
          <Link href={`/today/history${last30Query}`} className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-slate-700 sm:w-auto">最近 30 天</Link>
          <Link href={`/today/history${buildHistoryQueryString({ ...filters, startDate: '', endDate: '' })}`} className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-slate-700 sm:w-auto">重置筛选</Link>
          <Link href="/today" className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-slate-700 sm:w-auto">回到今日打卡</Link>
        </div>
        <form className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_1.4fr_auto]">
          <label className="grid gap-2 text-sm text-slate-600">
            <span>开始日期</span>
            <input type="date" name="startDate" defaultValue={filters.startDate} className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-900" />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            <span>结束日期</span>
            <input type="date" name="endDate" defaultValue={filters.endDate} className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-900" />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            <span>关键词搜索</span>
            <input type="search" name="keyword" defaultValue={filters.keyword} placeholder="搜索主题、卡点、练法、验证方式、后记" className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-900" />
          </label>
          <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-white md:self-end">查询</button>
        </form>
      </SectionCard>

      <SectionCard title="历史打卡列表" description={`当前共找到 ${tasks.length} 条记录。`}>
        <div className="space-y-4 text-sm text-slate-700">
          {tasks.length > 0 ? tasks.map((task) => (
            <details id={`task-${task.id}`} key={task.id} open={task.id === openTaskId} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm open:border-sky-200">
              <summary className="list-none cursor-pointer p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>{task.taskDate}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{taskStatusLabelMap[task.status] || task.status}</span>
                  </div>

                  <div>
                    <p className="text-base font-semibold text-slate-900 sm:text-lg">{task.topicTitle}</p>
                    <p className="mt-2 truncate text-sm text-slate-600">{getHistoryCardSummary(task)}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1.5 text-xs ${task.canEditContent ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {task.canEditContent ? '24 小时内，可直接编辑' : '原文已锁定，只能追加后记'}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                      <span className="group-open:hidden">展开查看</span>
                      <span className="hidden group-open:inline">收起</span>
                      <span className="text-base leading-none transition-transform group-open:rotate-180">⌄</span>
                    </span>
                  </div>
                </div>
              </summary>

              <div className="border-t border-slate-100 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
                {task.canEditContent ? (
                  <form action={saveHistoryTaskAction} className="space-y-4">
                    <input type="hidden" name="taskId" value={task.id} />
                    <input type="hidden" name="startDate" value={filters.startDate} />
                    <input type="hidden" name="endDate" value={filters.endDate} />
                    <input type="hidden" name="keyword" value={filters.keyword} />

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      这条记录还在 24 小时编辑窗口内，可以直接改原始打卡内容。
                    </div>

                    <div className="space-y-3">
                      <label className="grid gap-2 text-sm text-slate-600">
                        <span>当前卡点</span>
                        <textarea name="weakness" className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900" defaultValue={task.weakness} placeholder="当前卡点" />
                      </label>
                      <label className="grid gap-2 text-sm text-slate-600">
                        <span>今天怎么练</span>
                        <textarea name="improvementPlan" className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900" defaultValue={task.improvementPlan} placeholder="今天怎么练" />
                      </label>
                      <label className="grid gap-2 text-sm text-slate-600">
                        <span>今晚怎么验证</span>
                        <textarea name="verificationPath" className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900" defaultValue={task.verificationPath} placeholder="今晚怎么验证" />
                      </label>
                    </div>

                    <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-white sm:w-auto">保存这条历史打卡</button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-medium text-slate-900">当时写下的原文</p>
                      <div className="mt-3 space-y-3 text-sm text-slate-700">
                        <div className="rounded-2xl bg-white/80 px-3 py-3">
                          <p className="text-xs text-slate-500">当时的卡点</p>
                          <p className="mt-1 text-sm text-slate-800">{task.weakness || '当时还没写下来'}</p>
                        </div>
                        <div className="rounded-2xl bg-white/80 px-3 py-3">
                          <p className="text-xs text-slate-500">当时怎么练</p>
                          <p className="mt-1 text-sm text-slate-800">{task.improvementPlan || '当时还没写下来'}</p>
                        </div>
                        <div className="rounded-2xl bg-white/80 px-3 py-3">
                          <p className="text-xs text-slate-500">当时怎么验证</p>
                          <p className="mt-1 text-sm text-slate-800">{task.verificationPath || '当时还没写下来'}</p>
                        </div>
                      </div>
                    </div>

                    <form action={saveHistoryReflectionAction} className="space-y-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <input type="hidden" name="taskId" value={task.id} />
                      <input type="hidden" name="startDate" value={filters.startDate} />
                      <input type="hidden" name="endDate" value={filters.endDate} />
                      <input type="hidden" name="keyword" value={filters.keyword} />

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-900">现在补一条后记 / 反思</p>
                        <p className="text-sm text-slate-600">原文已经锁定，这里只补后来回头看时的新想法。</p>
                      </div>

                      <label className="grid gap-2 text-sm text-slate-600">
                        <span>后记 / 反思</span>
                        <textarea name="reflectionNote" className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900" defaultValue={task.reflectionNote} placeholder="现在回头看，这件事最值得补一条什么后记 / 反思？" />
                      </label>
                      <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-white sm:w-auto">保存后记 / 反思</button>
                    </form>
                  </div>
                )}
              </div>
            </details>
          )) : <p className="text-slate-600">这个时间范围里还没有找到历史打卡，换个日期或关键词试试。</p>}
        </div>
      </SectionCard>
    </AppShell>
  )
}
