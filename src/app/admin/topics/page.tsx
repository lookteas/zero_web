import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/section-card";
import { getAdminAwarenessCycle, listAdminTopics } from "@/lib/api";
import { requireAdmin } from "@/lib/admin-auth";

import { createTopicAction, updateAwarenessCycleAction, updateTopicAction } from "./actions";
import { PauseDatePicker } from "./pause-date-picker";
import { buildTopicTimeline, getDefaultTimelineStart, getTimelineSummary, parseTimelineStart, shiftTimelineStart } from "../topic-timeline.mjs";

type AdminTopicsPageProps = {
  searchParams: Promise<{ saved?: string; updated?: string; cycleUpdated?: string; error?: string; weekStart?: string; prefillDate?: string; legacyPage?: string }>
}

export default async function AdminTopicsPage({ searchParams }: AdminTopicsPageProps) {
  await requireAdmin();

  const query = await searchParams;
  const timelineStart = parseTimelineStart(query.weekStart, new Date());
  const cycleInfo = await getAdminAwarenessCycle();
  const scheduleTopics = await listAdminTopics({ weekStart: timelineStart });
  const legacyTopics = await listAdminTopics();
  const legacyPageSize = 10;
  const legacyPage = Math.max(1, Number(query.legacyPage || 1));
  const legacyPageCount = Math.max(1, Math.ceil(legacyTopics.length / legacyPageSize));
  const safeLegacyPage = Math.min(legacyPage, legacyPageCount);
  const pagedLegacyTopics = legacyTopics.slice((safeLegacyPage - 1) * legacyPageSize, safeLegacyPage * legacyPageSize);
  const nextOrderNo = legacyTopics.length > 0 ? Math.max(...legacyTopics.map((item) => item.orderNo)) + 1 : 1;
  const timelineSlots = buildTopicTimeline(scheduleTopics, timelineStart);
  const timelineSummary = getTimelineSummary(timelineSlots);
  const previousWeekStart = shiftTimelineStart(timelineStart, -7);
  const nextWeekStart = shiftTimelineStart(timelineStart, 7);
  const defaultWeekStart = getDefaultTimelineStart(new Date());
  const prefillDate = timelineSlots.some((slot) => slot.date === query.prefillDate) ? query.prefillDate || "" : "";
  const prefillSlot = timelineSlots.find((slot) => slot.date === prefillDate);
  const activityMetrics = [
    { label: "活动启动日", value: cycleInfo.startDate },
    { label: "固定休息", value: `${cycleInfo.restDays} 天` },
    { label: "意识点数量", value: `${cycleInfo.eligibleAwarenessCount} 个` },
    { label: "本周状态", value: `${cycleInfo.normalDayCount} 练 / ${cycleInfo.restDayCount} 休 / ${cycleInfo.pausedDayCount} 暂停` },
  ];

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
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(340px,430px)]">
          <div className="space-y-4">
            <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2 xl:grid-cols-4">
              {activityMetrics.map((item) => (
                <div key={item.label} className="rounded-[14px] border border-cyan-900/10 bg-white p-4 shadow-[0_10px_24px_rgba(8,91,110,0.04)]">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
              <div className="rounded-[14px] border border-cyan-900/10 bg-cyan-50/70 p-4 xl:col-span-4">
                <p className="text-xs text-slate-500">当前进度</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {cycleInfo.currentProgressNo ? `第 ${cycleInfo.currentProgressNo} 个意识强度点` : "今日不消耗意识点进度"}
                </p>
                {cycleInfo.currentProgressTitle ? <p className="mt-1 text-sm text-slate-600">{cycleInfo.currentProgressTitle}</p> : null}
              </div>
            </div>

            <form action={updateAwarenessCycleAction} className="grid gap-4 rounded-[14px] border border-cyan-900/10 bg-white p-4 text-sm text-slate-700 shadow-[0_10px_24px_rgba(8,91,110,0.04)] md:grid-cols-[1fr_160px_auto]">
              <label className="grid gap-2">
                <span>活动启动日期</span>
                <input name="startDate" type="date" defaultValue={cycleInfo.startDate} className="rounded-[10px] border border-slate-300 px-3 py-2.5" required />
              </label>
              <label className="grid gap-2">
                <span>休息天数</span>
                <input name="restDays" type="number" min="1" max="30" defaultValue={cycleInfo.restDays} className="rounded-[10px] border border-slate-300 px-3 py-2.5" required />
              </label>
              <PauseDatePicker initialDates={cycleInfo.pausedDates || []} />
              <input type="hidden" name="returnWeekStart" value={timelineStart} />
              <div className="flex items-end">
                <button type="submit" className="w-full cursor-pointer rounded-[10px] bg-cyan-800 px-5 py-2.5 font-medium text-white transition hover:bg-cyan-900 md:w-auto">保存设置</button>
              </div>
            </form>
          </div>

          <div className="rounded-[14px] border border-cyan-900/10 bg-white p-4 shadow-[0_10px_24px_rgba(8,91,110,0.04)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-950">本周主题</p>
              <p className="text-xs text-slate-500">从 {cycleInfo.weekStart} 开始</p>
            </div>
            <div className="space-y-2">
              {cycleInfo.weekDays.map((day) => (
                <div key={day.date} className={`rounded-[12px] border p-3 text-sm ${day.isPausedDay ? "border-amber-200 bg-amber-50 text-amber-800" : day.isRestDay ? "border-sky-200 bg-sky-50 text-sky-800" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-950">{day.title}</p>
                    <span className={`shrink-0 rounded-[8px] px-2.5 py-1 text-xs ${day.isPausedDay ? "bg-amber-100 text-amber-700" : day.isRestDay ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {day.isPausedDay ? "暂停" : day.isRestDay ? "休息" : "练习"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{day.date}</p>
                  {day.progressNo ? <p className="mt-1 text-xs text-slate-500">第 {day.progressNo} 个意识强度点</p> : null}
                  {day.summary ? <p className="mt-2 text-xs leading-5 text-slate-600">{day.summary}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="本周排期"
        description="正常日展示自动匹配的意识点，休息日展示整合状态。"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-cyan-900/10 bg-white p-4 text-sm text-slate-700 shadow-[0_10px_24px_rgba(8,91,110,0.04)]">
          <div className="space-y-1">
            <p className="font-medium text-slate-900">当前查看从 {timelineStart} 开始的一周</p>
            <p>已匹配 {timelineSummary.scheduled} 天，缺口 {timelineSummary.missing} 天；缺口通常需要检查意识点题库数据</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/admin/topics?weekStart=${previousWeekStart}`} className="rounded-[10px] border border-slate-300 px-3 py-2 text-slate-700 transition hover:border-cyan-600 hover:text-cyan-800">上一周</Link>
            <Link href={`/admin/topics?weekStart=${defaultWeekStart}`} className="rounded-[10px] border border-slate-300 px-3 py-2 text-slate-700 transition hover:border-cyan-600 hover:text-cyan-800">回到本周</Link>
            <Link href={`/admin/topics?weekStart=${nextWeekStart}`} className="rounded-[10px] border border-slate-300 px-3 py-2 text-slate-700 transition hover:border-cyan-600 hover:text-cyan-800">下一周</Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {timelineSlots.map((slot) => (
            <article key={slot.date} className={`rounded-[14px] border p-4 shadow-[0_10px_24px_rgba(8,91,110,0.035)] ${slot.missing ? 'border-rose-200 bg-rose-50' : slot.rest ? 'border-sky-200 bg-sky-50' : 'border-cyan-900/10 bg-white'}`}>
              <p className="text-xs text-slate-500">{slot.weekdayLabel}</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{slot.date}</p>
              {slot.topic ? (
                <>
                  <p className="mt-3 font-medium text-slate-900">{slot.topic.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{slot.topic.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-[8px] bg-slate-100 px-3 py-1 text-slate-700">排序 {slot.topic.orderNo}</span>
                    {slot.rest ? (
                      <span className="rounded-[8px] bg-sky-100 px-3 py-1 text-sky-700">休息整合中</span>
                    ) : (
                      <span className={`rounded-[8px] px-3 py-1 ${slot.topic.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
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
              <input name="title" className="rounded-[10px] border border-slate-300 px-3 py-2.5" placeholder="例如：情绪触发点拆解" required />
            </label>
            <label className="grid gap-2">
              <span>排序值</span>
              <input name="orderNo" type="number" defaultValue={nextOrderNo} className="rounded-[10px] border border-slate-300 px-3 py-2.5" required />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span>一句摘要</span>
              <input name="summary" className="rounded-[10px] border border-slate-300 px-3 py-2.5" placeholder="仅用于旧数据展示的简短说明" required />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span>详细描述</span>
              <textarea name="description" className="min-h-28 rounded-[10px] border border-slate-300 px-3 py-2.5" placeholder="可填写主题背景、讨论方向和注意事项" />
            </label>
            <input type="hidden" name="returnWeekStart" value={timelineStart} />
            <label className="grid gap-2">
              <span>安排日期</span>
              <input name="scheduleDate" type="date" defaultValue={prefillDate} autoFocus={Boolean(prefillDate)} className="rounded-[10px] border border-slate-300 px-3 py-2.5" />
              {prefillSlot ? <span className="text-xs text-sky-700">已自动带入日期：{prefillSlot.date} {prefillSlot.weekdayLabel}</span> : null}
            </label>
            <label className="grid gap-2">
              <span>状态</span>
              <select name="status" defaultValue="1" className="rounded-[10px] border border-slate-300 px-3 py-2.5">
                <option value="1">启用</option>
                <option value="0">停用</option>
              </select>
            </label>
            <div className="flex items-end md:col-span-2">
              <button type="submit" className="w-full cursor-pointer rounded-[10px] bg-slate-900 px-5 py-2.5 text-white md:w-auto">保存旧主题</button>
            </div>
          </form>
        </SectionCard>
      </section>

      <SectionCard
        title="已有旧主题"
        description="仅用于兼容旧数据的修正文案、排序、启停状态或安排日期；新的每日练习主题不再以这里作为主来源。"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-cyan-900/10 bg-white p-4 text-sm text-slate-700">
          <p>共 {legacyTopics.length} 条旧主题，当前第 {safeLegacyPage} / {legacyPageCount} 页，每页 {legacyPageSize} 条。</p>
          <div className="flex flex-wrap gap-2">
            {safeLegacyPage > 1 ? (
              <Link href={`/admin/topics?weekStart=${timelineStart}&legacyPage=${legacyPage - 1}`} className="rounded-[10px] border border-slate-300 bg-white px-3 py-2 text-slate-700 transition hover:border-cyan-600 hover:text-cyan-800">上一页</Link>
            ) : (
              <span className="rounded-[10px] border border-slate-200 px-3 py-2 text-slate-400">上一页</span>
            )}
            {safeLegacyPage < legacyPageCount ? (
              <Link href={`/admin/topics?weekStart=${timelineStart}&legacyPage=${legacyPage + 1}`} className="rounded-[10px] border border-slate-300 bg-white px-3 py-2 text-slate-700 transition hover:border-cyan-600 hover:text-cyan-800">下一页</Link>
            ) : (
              <span className="rounded-[10px] border border-slate-200 px-3 py-2 text-slate-400">下一页</span>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {pagedLegacyTopics.map((item) => (
            <details key={item.id} className="rounded-[14px] border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                <span className="font-medium text-slate-900">{item.title}</span>
                <span className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-[8px] bg-slate-100 px-3 py-1 text-slate-700">排序 {item.orderNo}</span>
                  <span className="rounded-[8px] border border-slate-200 px-3 py-1">展开编辑</span>
                </span>
              </summary>
              <form action={updateTopicAction} className="mt-4 grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
                <input type="hidden" name="topicId" value={item.id} />
                <input type="hidden" name="returnWeekStart" value={timelineStart} />
                <label className="grid gap-2">
                  <span>旧主题标题</span>
                  <input name="title" defaultValue={item.title} className="rounded-[10px] border border-slate-300 px-3 py-2.5" required />
                </label>
                <label className="grid gap-2">
                  <span>排序值</span>
                  <input name="orderNo" type="number" defaultValue={item.orderNo} className="rounded-[10px] border border-slate-300 px-3 py-2.5" required />
                </label>
                <label className="grid gap-2 md:col-span-2">
                  <span>一句摘要</span>
                  <input name="summary" defaultValue={item.summary} className="rounded-[10px] border border-slate-300 px-3 py-2.5" required />
                </label>
                <label className="grid gap-2 md:col-span-2">
                  <span>详细描述</span>
                  <textarea name="description" defaultValue={item.description} className="min-h-28 rounded-[10px] border border-slate-300 px-3 py-2.5" />
                </label>
                <label className="grid gap-2">
                  <span>安排日期</span>
                  <input name="scheduleDate" type="date" defaultValue={item.scheduleDate} className="rounded-[10px] border border-slate-300 px-3 py-2.5" />
                </label>
                <label className="grid gap-2">
                  <span>状态</span>
                  <select name="status" defaultValue={String(item.status)} className="rounded-[10px] border border-slate-300 px-3 py-2.5">
                    <option value="1">启用</option>
                    <option value="0">停用</option>
                  </select>
                </label>
                <div className="flex items-end justify-end md:col-span-2">
                  <button type="submit" className="w-full cursor-pointer rounded-[10px] border border-slate-900 px-5 py-2.5 text-slate-900 md:w-auto">更新主题</button>
                </div>
              </form>
            </details>
          ))}
        </div>
      </SectionCard>
    </AdminShell>
  );
}
