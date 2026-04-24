import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/section-card";
import { getCurrentDiscussion, getCurrentWeeklyVote, listAdminTopics } from "@/lib/api";
import { requireAdmin } from "@/lib/admin-auth";

import {
  getAdminDiscussionSummary,
  getAdminTopicStats,
  getAdminVoteLeader,
  loadAdminDashboardData,
} from "./admin-dashboard.mjs";

export default async function AdminPage() {
  await requireAdmin();

  const { topics, vote, discussion, warnings } = await loadAdminDashboardData({
    listAdminTopics,
    getCurrentWeeklyVote,
    getCurrentDiscussion,
  });

  const topicStats = getAdminTopicStats(topics);
  const leader = getAdminVoteLeader(vote);
  const discussionSummary = getAdminDiscussionSummary(discussion);
  const winningTopicTitle = leader?.topicTitle || discussion.topicTitle || "本周话题待定";
  const winningVoteCount = leader?.voteCount || 0;

  return (
    <AdminShell title="管理台" description="这里只放当前需要的最小后台能力：管理主题、补充讨论信息、确认本周投票和讨论是否已就绪。">
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
              去主题设置补排期
            </Link>
            <Link href="/admin/discussions" className="rounded-full border border-amber-300 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100">
              去讨论设置检查配置
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">主题总数</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{topicStats.total}</p>
          <p className="mt-2 text-sm text-slate-600">启用中 {topicStats.active} 个，停用 {topicStats.inactive} 个</p>
        </article>
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">当前领先主题</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{winningTopicTitle}</p>
          <p className="mt-2 text-sm text-slate-600">当前累计 {winningVoteCount} 票，票数第一会自动成为讨论主题</p>
        </article>
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">讨论状态</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{discussionSummary.statusLabel}</p>
          <p className="mt-2 text-sm text-slate-600">默认时间 {discussionSummary.timeLabel}</p>
        </article>
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">会议入口</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{discussionSummary.providerLabel}</p>
          <p className="mt-2 text-sm text-slate-600">{discussionSummary.hasMeetingLink ? "已配置讨论入口，可直接对外开放。" : "尚未配置，请先补会议地址。"}</p>
        </article>
      </section>

      <SectionCard title="常用操作" description="后台入口收口到这里，平时只需要进这两个页面。">
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/admin/topics" className="rounded-3xl border border-slate-200 p-5 transition hover:border-sky-300 hover:bg-sky-50">
            <p className="text-lg font-semibold text-slate-900">主题设置</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">维护打卡主题、顺序和启停状态，不会回写已生成的历史内容。</p>
          </Link>
          <Link href="/admin/discussions" className="rounded-3xl border border-slate-200 p-5 transition hover:border-sky-300 hover:bg-sky-50">
            <p className="text-lg font-semibold text-slate-900">讨论设置</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">在投票自动定题后，补会议地址、讨论说明、分享文案和发布状态。</p>
          </Link>
        </div>
      </SectionCard>

      <SectionCard title="本周状态" description="用来快速确认这周的投票和讨论链路有没有缺口。">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            <p className="text-xs text-slate-500">投票结果</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{winningTopicTitle}</p>
            <p className="mt-2 leading-6">本周讨论默认跟随票数第一名。如果管理员没有手动改标题，讨论标题会自动沿用这个主题。</p>
          </div>
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
