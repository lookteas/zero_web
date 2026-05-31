import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/section-card";
import { getAdminAwarenessCycle, listAdminTopics } from "@/lib/api";
import { requireAdmin } from "@/lib/admin-auth";

import { excludeAwarenessAction, insertAwarenessAction, updateAwarenessAction, updateAwarenessCycleAction } from "./actions";
import { AwarenessScheduleEditor } from "./awareness-schedule-editor";
import { PauseDatePicker } from "./pause-date-picker";
import { buildTopicTimeline, getDefaultTimelineStart, getTimelineSummary, parseTimelineStart, shiftTimelineStart } from "../topic-timeline.mjs";

type AdminTopicsPageProps = {
  searchParams: Promise<{ updated?: string; cycleUpdated?: string; error?: string; weekStart?: string }>
}

export default async function AdminTopicsPage({ searchParams }: AdminTopicsPageProps) {
  await requireAdmin();

  const query = await searchParams;
  const timelineStart = parseTimelineStart(query.weekStart, new Date());
  const cycleInfo = await getAdminAwarenessCycle();
  const scheduleTopics = await listAdminTopics({ weekStart: timelineStart });
  const timelineSlots = buildTopicTimeline(scheduleTopics, timelineStart);
  const timelineSummary = getTimelineSummary(timelineSlots);
  const previousWeekStart = shiftTimelineStart(timelineStart, -7);
  const nextWeekStart = shiftTimelineStart(timelineStart, 7);
  const defaultWeekStart = getDefaultTimelineStart(new Date());
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
      {query.updated ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">主题已更新。</section> : null}
      {query.cycleUpdated ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">活动设置已保存。</section> : null}
      {query.error ? <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{query.error}</section> : null}

      <SectionCard
        title="本周排期"
        description="正常日展示自动匹配的意识点，休息日展示整合状态。点击意识点可修正文案或从后续周期剔除。"
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

        <AwarenessScheduleEditor
          slots={timelineSlots}
          timelineStart={timelineStart}
          updateAction={updateAwarenessAction}
          excludeAction={excludeAwarenessAction}
          insertAction={insertAwarenessAction}
        />
      </SectionCard>

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

    </AdminShell>
  );
}
