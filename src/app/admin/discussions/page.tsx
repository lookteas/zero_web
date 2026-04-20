import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/section-card";
import { getCurrentDiscussion } from "@/lib/api";
import { requireAdmin } from "@/lib/admin-auth";

import { saveDiscussionAction } from "./actions";

type AdminDiscussionsPageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>
}

export default async function AdminDiscussionsPage({ searchParams }: AdminDiscussionsPageProps) {
  await requireAdmin();

  const query = await searchParams;
  const discussion = await getCurrentDiscussion();

  return (
    <AdminShell title="讨论设置" description="每周主题默认跟随投票结果，这里主要补会议地址、文案和状态。">
      {query.saved ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">讨论说明已保存。</section> : null}
      {query.error ? <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{query.error}</section> : null}

      <SectionCard title="本周讨论编辑" description="主题默认跟随本周票数第一名，不需要手动改主题本身。">
        <form action={saveDiscussionAction} className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
          <input type="hidden" name="discussionId" value={discussion.id || 0} />
          <input type="hidden" name="weekStartDate" value={discussion.weekStartDate} />
          <input type="hidden" name="topicId" value={discussion.topicId || 0} />
          <input type="hidden" name="topicTitle" value={discussion.topicTitle} />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
            <p className="text-xs text-slate-500">自动带入的主题</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{discussion.topicTitle}</p>
            <p className="mt-2 text-slate-600">当前投票周：{discussion.weekStartDate}</p>
          </div>

          <label className="grid gap-2 md:col-span-2">
            <span>讨论标题</span>
            <input name="discussionTitle" defaultValue={discussion.discussionTitle} className="rounded-2xl border border-slate-200 px-4 py-3" required />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span>讨论说明</span>
            <textarea name="description" defaultValue={discussion.description} className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span>讨论目标</span>
            <textarea name="goals" defaultValue={discussion.goals} className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3" placeholder="可按行写 1、2、3 点" />
          </label>
          <label className="grid gap-2">
            <span>会议时间</span>
            <input name="meetingTime" defaultValue={discussion.meetingTime} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="2026-04-18 20:00:00" required />
          </label>
          <label className="grid gap-2">
            <span>讨论状态</span>
            <select name="status" defaultValue={discussion.status || 'published'} className="rounded-2xl border border-slate-200 px-4 py-3">
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span>会议地址</span>
            <input name="meetingLink" defaultValue={discussion.meetingLink} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="支持腾讯会议、飞书会议或其他自定义链接" />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span>分享文案</span>
            <textarea name="shareText" defaultValue={discussion.shareText} className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3" placeholder="留空时会自动生成默认分享文案" />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span>管理员备注</span>
            <textarea name="adminRemark" defaultValue={discussion.adminRemark} className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3" placeholder="比如：本周会议临时改到飞书" />
          </label>
          <div className="flex justify-end md:col-span-2">
            <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-white md:w-auto">保存本周讨论</button>
          </div>
        </form>
      </SectionCard>
    </AdminShell>
  );
}
