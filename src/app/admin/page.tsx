import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { getAdminAwarenessCycle, getCurrentDiscussion, listAdminTopics, listAdminUsers } from "@/lib/api";
import { requireAdmin } from "@/lib/admin-auth";

import {
  getAdminDiscussionSummary,
  loadAdminDashboardData,
} from "./admin-dashboard.mjs";

function formatUserTotal(total: number | null | undefined) {
  return typeof total === "number" ? String(total) : "--";
}

export default async function AdminPage() {
  await requireAdmin();

  const { userSummary, discussion, warnings } = await loadAdminDashboardData({
    listAdminTopics,
    listAdminUsers,
    getCurrentDiscussion,
  });
  const awarenessCycle = await getAdminAwarenessCycle();

  const discussionSummary = getAdminDiscussionSummary(discussion);
  const metricCards = [
    { label: "当前进度", value: awarenessCycle.currentProgressNo ? `第 ${awarenessCycle.currentProgressNo} 个` : "暂停/休息", detail: awarenessCycle.currentProgressTitle || "今日不消耗意识点进度" },
    { label: "意识点数量", value: String(awarenessCycle.eligibleAwarenessCount), detail: "题库内可参与轮询的意识点" },
    { label: "本周练习", value: String(awarenessCycle.normalDayCount), detail: `${awarenessCycle.restDayCount} 休 / ${awarenessCycle.pausedDayCount} 暂停` },
    { label: "用户总数", value: formatUserTotal(userSummary.total), detail: "来自用户管理汇总" },
    { label: "讨论状态", value: discussionSummary.statusLabel, detail: discussionSummary.timeLabel },
  ];

  return (
    <AdminShell title="管理台" description="这里只放当前需要的最小后台能力：设置意识点活动、查看本周主题、处理必要的讨论信息。">
      {warnings.length ? (
        <section className="rounded-[14px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
          <p className="text-base font-semibold">后台已进入降级模式</p>
          <div className="mt-2 space-y-2 leading-6">
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/admin/topics" className="rounded-[10px] bg-amber-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-950">
              去意识点活动设置
            </Link>
            <Link href="/admin/discussions" className="rounded-[10px] border border-amber-300 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100">
              去讨论设置检查配置
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {metricCards.map((card) => (
          <article key={card.label} className="rounded-[14px] border border-cyan-900/10 bg-white p-4 shadow-[0_10px_24px_rgba(8,91,110,0.045)]">
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950">{card.value}</p>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-[14px] border border-cyan-900/10 bg-white p-4 shadow-[0_10px_24px_rgba(8,91,110,0.045)]">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-slate-950">快速入口</h2>
            <p className="mt-1 text-sm text-slate-600">把高频后台操作集中在这里。</p>
          </div>
          <div className="grid gap-2">
            <Link href="/admin/topics" className="group rounded-[12px] border border-cyan-900/10 bg-cyan-50/70 p-3 transition hover:border-cyan-500 hover:bg-cyan-50">
              <p className="font-medium text-slate-950 group-hover:text-cyan-800">意识点活动设置</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">启动日、暂停日期、本周排期。</p>
            </Link>
            <Link href="/admin/discussions" className="group rounded-[12px] border border-slate-200 bg-white p-3 transition hover:border-cyan-500 hover:bg-cyan-50">
              <p className="font-medium text-slate-950 group-hover:text-cyan-800">讨论设置</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">会议时间、入口和发布状态。</p>
            </Link>
          </div>
        </section>

        <section className="rounded-[14px] border border-cyan-900/10 bg-white p-4 shadow-[0_10px_24px_rgba(8,91,110,0.045)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950">本周排期预览</h2>
              <p className="mt-1 text-sm text-slate-600">活动启动日 {awarenessCycle.startDate}，固定休息 {awarenessCycle.restDays} 天。</p>
            </div>
            <Link href="/admin/topics" className="rounded-[10px] border border-cyan-700 px-3 py-2 text-sm font-medium text-cyan-800 transition hover:bg-cyan-50">
              查看完整排期
            </Link>
          </div>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {awarenessCycle.weekDays.slice(0, 4).map((day) => (
              <div key={day.date} className="rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-500">{day.date}</p>
                  <span className={`rounded-[8px] px-2 py-1 text-xs ${day.isPausedDay ? "bg-amber-100 text-amber-800" : day.isRestDay ? "bg-sky-100 text-sky-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {day.isPausedDay ? "暂停" : day.isRestDay ? "休息" : "练习"}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 font-medium text-slate-950">{day.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{day.isRestDay ? "休息整合中，不生成新主题。" : day.summary || "按意识点题库顺序生成。"}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="rounded-[14px] border border-cyan-900/10 bg-white p-4 shadow-[0_10px_24px_rgba(8,91,110,0.045)]">
        <h2 className="text-base font-semibold text-slate-950">讨论发布</h2>
        <div className="mt-3 grid gap-3 text-sm text-slate-700 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <p className="font-medium text-slate-950">{discussion.discussionTitle}</p>
            <p className="mt-1 leading-6">状态：{discussionSummary.statusLabel}；时间：{discussionSummary.timeLabel}；入口：{discussionSummary.providerLabel}</p>
            {discussion.adminRemark ? <p className="mt-1 leading-6 text-amber-700">备注：{discussion.adminRemark}</p> : null}
          </div>
          <Link href="/admin/discussions" className="rounded-[10px] border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-600 hover:text-cyan-800">
            编辑讨论
          </Link>
        </div>
      </section>
    </AdminShell>
  );
}
