import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/section-card";
import { getAdminAwarenessCycle, listAdminTopics } from "@/lib/api";
import { requireAdmin } from "@/lib/admin-auth";

import { createTopicAction, updateAwarenessCycleAction, updateTopicAction } from "./actions";
import { buildTopicTimeline, getDefaultTimelineStart, getTimelineSummary, parseTimelineStart, shiftTimelineStart } from "../topic-timeline.mjs";

type AdminTopicsPageProps = {
  searchParams: Promise<{ saved?: string; updated?: string; cycleUpdated?: string; error?: string; weekStart?: string; prefillDate?: string }>
}

export default async function AdminTopicsPage({ searchParams }: AdminTopicsPageProps) {
  await requireAdmin();

  const query = await searchParams;
  const timelineStart = parseTimelineStart(query.weekStart, new Date());
  const cycleInfo = await getAdminAwarenessCycle();
  const scheduleTopics = await listAdminTopics({ weekStart: timelineStart });
  const legacyTopics = await listAdminTopics();
  const nextOrderNo = legacyTopics.length > 0 ? Math.max(...legacyTopics.map((item) => item.orderNo)) + 1 : 1;
  const timelineSlots = buildTopicTimeline(scheduleTopics, timelineStart);
  const timelineSummary = getTimelineSummary(timelineSlots);
  const previousWeekStart = shiftTimelineStart(timelineStart, -7);
  const nextWeekStart = shiftTimelineStart(timelineStart, 7);
  const defaultWeekStart = getDefaultTimelineStart(new Date());
  const prefillDate = timelineSlots.some((slot) => slot.date === query.prefillDate) ? query.prefillDate || "" : "";
  const prefillSlot = timelineSlots.find((slot) => slot.date === prefillDate);

  return (
    <AdminShell
      title="意识点排期"
      description="按周查看系统自动轮询的意识点安排；本阶段不再把每周主题作为手工录入主流程。"
    >
      {query.saved ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">主题已新增。</section> : null}
      {query.updated ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">主题已更新。</section> : null}
      {query.cycleUpdated ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">活动设置已保存。</section> : null}
      {query.error ? <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{query.error}</section> : null}

      <SectionCard
        title="意识点活动设置"
        description="设置活动从哪一天开始，系统会每天按顺序给出 1 个意识点；一轮结束后进入固定休息整合。SaaS 多群版本是后续方向，本阶段不实现。"
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <div className="space-y-4">
            <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">活动启动日</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{cycleInfo.startDate}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">固定休息</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{cycleInfo.restDays} 天</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">意识点数量</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{cycleInfo.eligibleAwarenessCount} 个</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">本周状态</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{cycleInfo.normalDayCount} 练 / {cycleInfo.restDayCount} 休</p>
              </div>
            </div>

            <form action={updateAwarenessCycleAction} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 md:grid-cols-[1fr_160px_auto]">
              <label className="grid gap-2">
                <span>活动启动日期</span>
                <input name="startDate" type="date" defaultValue={cycleInfo.startDate} className="rounded-2xl border border-slate-200 px-4 py-3" required />
              </label>
              <label className="grid gap-2">
                <span>休息天数</span>
                <input name="restDays" type="number" min="1" max="30" defaultValue={cycleInfo.restDays} className="rounded-2xl border border-slate-200 px-4 py-3" required />
              </label>
              <input type="hidden" name="returnWeekStart" value={timelineStart} />
              <div className="flex items-end">
                <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-white md:w-auto">保存启动日期</button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-950">本周主题</p>
              <p className="text-xs text-slate-500">从 {cycleInfo.weekStart} 开始</p>
            </div>
            <div className="space-y-2">
              {cycleInfo.weekDays.map((day) => (
                <div key={day.date} className={`rounded-xl border p-3 text-sm ${day.isRestDay ? "border-sky-200 bg-sky-50 text-sky-800" : "border-white bg-white text-slate-700"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-950">{day.title}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${day.isRestDay ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {day.isRestDay ? "休息" : "练习"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{day.date}</p>
                  {day.summary ? <p className="mt-2 text-xs leading-5 text-slate-600">{day.summary}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="本周意识点排期"
        description="正常日展示自动匹配的意识点，休息日展示整合状态。"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <div className="space-y-1">
            <p className="font-medium text-slate-900">当前查看从 {timelineStart} 开始的一周</p>
            <p>已匹配 {timelineSummary.scheduled} 天，缺口 {timelineSummary.missing} 天；缺口通常需要检查意识点题库数据</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/admin/topics?weekStart=${previousWeekStart}`} className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-sky-300 hover:text-sky-700">上一周</Link>
            <Link href={`/admin/topics?weekStart=${defaultWeekStart}`} className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-sky-300 hover:text-sky-700">回到本周</Link>
            <Link href={`/admin/topics?weekStart=${nextWeekStart}`} className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-sky-300 hover:text-sky-700">下一周</Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {timelineSlots.map((slot) => (
            <article key={slot.date} className={`rounded-2xl border p-4 ${slot.missing ? 'border-rose-200 bg-rose-50' : slot.rest ? 'border-sky-200 bg-sky-50' : 'border-slate-200 bg-white'}`}>
              <p className="text-xs text-slate-500">{slot.weekdayLabel}</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{slot.date}</p>
              {slot.topic ? (
                <>
                  <p className="mt-3 font-medium text-slate-900">{slot.topic.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{slot.topic.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">排序 {slot.topic.orderNo}</span>
                    {slot.rest ? (
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">休息整合中</span>
                    ) : (
                      <span className={`rounded-full px-3 py-1 ${slot.topic.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {slot.topic.status === 1 ? '启用' : '停用'}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-3 font-medium text-rose-700">这一天没有可用意识点</p>
                  <p className="mt-1 text-sm text-rose-600">请检查意识点题库是否已导入，且存在 status=1、is_meta=0 的记录。</p>
                </>
              )}
            </article>
          ))}
        </div>
      </SectionCard>

      <section id="create-topic">
        <SectionCard
          title="旧主题维护"
          description="仅用于兼容旧数据；新的每日练习主题来自意识点题库自动轮询。"
        >
          <form action={createTopicAction} className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
            <label className="grid gap-2">
              <span>旧主题标题</span>
              <input name="title" className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="例如：情绪触发点拆解" required />
            </label>
            <label className="grid gap-2">
              <span>排序值</span>
              <input name="orderNo" type="number" defaultValue={nextOrderNo} className="rounded-2xl border border-slate-200 px-4 py-3" required />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span>一句摘要</span>
              <input name="summary" className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="仅用于旧数据展示的简短说明" required />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span>详细描述</span>
              <textarea name="description" className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3" placeholder="可填写主题背景、讨论方向和注意事项" />
            </label>
            <input type="hidden" name="returnWeekStart" value={timelineStart} />
            <label className="grid gap-2">
              <span>安排日期</span>
              <input name="scheduleDate" type="date" defaultValue={prefillDate} autoFocus={Boolean(prefillDate)} className="rounded-2xl border border-slate-200 px-4 py-3" />
              {prefillSlot ? <span className="text-xs text-sky-700">已自动带入日期：{prefillSlot.date} {prefillSlot.weekdayLabel}</span> : null}
            </label>
            <label className="grid gap-2">
              <span>状态</span>
              <select name="status" defaultValue="1" className="rounded-2xl border border-slate-200 px-4 py-3">
                <option value="1">启用</option>
                <option value="0">停用</option>
              </select>
            </label>
            <div className="flex items-end md:col-span-2">
              <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-white md:w-auto">保存旧主题</button>
            </div>
          </form>
        </SectionCard>
      </section>

      <SectionCard
        title="已有旧主题"
        description="仅用于兼容旧数据的修正文案、排序、启停状态或安排日期；新的每日练习主题不再以这里作为主来源。"
      >
        <div className="space-y-4">
          {legacyTopics.map((item) => (
            <form key={item.id} action={updateTopicAction} className="grid gap-4 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 md:grid-cols-2">
              <input type="hidden" name="topicId" value={item.id} />
              <input type="hidden" name="returnWeekStart" value={timelineStart} />
              <label className="grid gap-2">
                <span>旧主题标题</span>
                <input name="title" defaultValue={item.title} className="rounded-2xl border border-slate-200 px-4 py-3" required />
              </label>
              <label className="grid gap-2">
                <span>排序值</span>
                <input name="orderNo" type="number" defaultValue={item.orderNo} className="rounded-2xl border border-slate-200 px-4 py-3" required />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span>一句摘要</span>
                <input name="summary" defaultValue={item.summary} className="rounded-2xl border border-slate-200 px-4 py-3" required />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span>详细描述</span>
                <textarea name="description" defaultValue={item.description} className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3" />
              </label>
              <label className="grid gap-2">
                <span>安排日期</span>
                <input name="scheduleDate" type="date" defaultValue={item.scheduleDate} className="rounded-2xl border border-slate-200 px-4 py-3" />
              </label>
              <label className="grid gap-2">
                <span>状态</span>
                <select name="status" defaultValue={String(item.status)} className="rounded-2xl border border-slate-200 px-4 py-3">
                  <option value="1">启用</option>
                  <option value="0">停用</option>
                </select>
              </label>
              <div className="flex items-end justify-end md:col-span-2">
                <button type="submit" className="w-full rounded-full border border-slate-900 px-5 py-3 text-slate-900 md:w-auto">更新主题</button>
              </div>
            </form>
          ))}
        </div>
      </SectionCard>
    </AdminShell>
  );
}
