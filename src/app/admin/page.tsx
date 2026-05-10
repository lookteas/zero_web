import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/section-card";
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

  return (
    <AdminShell title="管理台" description="这里只放当前需要的最小后台能力：设置意识点活动、查看本周主题、处理必要的讨论信息。">
      {warnings.length ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 shadow-sm">
          <p className="text-base font-semibold">后台已进入降级模式</p>
          <div className="mt-2 space-y-2 leading-6">
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/admin/topics" className="rounded-full bg-amber-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-950">
              去意识点活动设置
            </Link>
            <Link href="/admin/discussions" className="rounded-full border border-amber-300 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100">
              去讨论设置检查配置
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">意识点数量</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{awarenessCycle.eligibleAwarenessCount}</p>
          <p className="mt-2 text-sm text-slate-600">来自意识点题库，后台主题将按顺序自动轮询。</p>
        </article>
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">活动启动日</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{awarenessCycle.startDate}</p>
          <p className="mt-2 text-sm text-slate-600">一轮结束后固定休息 {awarenessCycle.restDays} 天。</p>
        </article>
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">本周主题</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{awarenessCycle.normalDayCount}</p>
          <p className="mt-2 text-sm text-slate-600">本周 {awarenessCycle.normalDayCount} 天练习，{awarenessCycle.restDayCount} 天休息整合。</p>
        </article>
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">用户总数</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{formatUserTotal(userSummary.total)}</p>
          <p className="mt-2 text-sm text-slate-600">来自用户管理汇总，可快速判断当前整体用户量。</p>
        </article>
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">讨论状态</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{discussionSummary.statusLabel}</p>
          <p className="mt-2 text-sm text-slate-600">默认时间 {discussionSummary.timeLabel}</p>
        </article>
      </section>

      <SectionCard title="常用操作" description="后台入口收口到这里，当前优先维护意识点活动设置。">
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/admin/topics" className="rounded-3xl border border-slate-200 p-5 transition hover:border-sky-300 hover:bg-sky-50">
            <p className="text-lg font-semibold text-slate-900">意识点活动设置</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">设置哪一天启动活动，查看意识点数量和本周每天的主题安排。</p>
          </Link>
          <Link href="/admin/discussions" className="rounded-3xl border border-slate-200 p-5 transition hover:border-sky-300 hover:bg-sky-50">
            <p className="text-lg font-semibold text-slate-900">讨论设置</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">后续每周复盘讨论使用；本阶段不再投票选题。</p>
          </Link>
        </div>
      </SectionCard>

      <SectionCard title="本周主题" description="这里预览自动轮询出来的一周安排；详细修改启动日期请进入意识点活动设置。">
        <div className="grid gap-4 lg:grid-cols-2">
          {awarenessCycle.weekDays.slice(0, 4).map((day) => (
            <div key={day.date} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              <p className="text-xs text-slate-500">{day.date}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{day.title}</p>
              <p className="mt-2 leading-6">{day.isRestDay ? "休息整合中，不生成新主题。" : day.summary || "按意识点题库顺序生成。"}</p>
            </div>
          ))}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            <p className="text-xs text-slate-500">讨论发布</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{discussion.discussionTitle}</p>
            <p className="mt-2 leading-6">状态：{discussionSummary.statusLabel}；时间：{discussionSummary.timeLabel}；入口：{discussionSummary.providerLabel}</p>
            {discussion.adminRemark ? <p className="mt-2 leading-6 text-amber-700">备注：{discussion.adminRemark}</p> : null}
          </div>
        </div>
      </SectionCard>
    </AdminShell>
  );
}
