import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/section-card";
import { listAdminTopics } from "@/lib/api";
import { requireAdmin } from "@/lib/admin-auth";

import { createTopicAction, updateTopicAction } from "./actions";
import { buildTopicTimeline, getDefaultTimelineStart, getTimelineSummary, parseTimelineStart, shiftTimelineStart } from "../topic-timeline.mjs";

type AdminTopicsPageProps = {
  searchParams: Promise<{ saved?: string; updated?: string; error?: string; weekStart?: string; prefillDate?: string }>
}

export default async function AdminTopicsPage({ searchParams }: AdminTopicsPageProps) {
  await requireAdmin();

  const query = await searchParams;
  const topics = await listAdminTopics();
  const nextOrderNo = topics.length > 0 ? Math.max(...topics.map((item) => item.orderNo)) + 1 : 1;
  const timelineStart = parseTimelineStart(query.weekStart, new Date());
  const timelineSlots = buildTopicTimeline(topics, timelineStart);
  const timelineSummary = getTimelineSummary(timelineSlots);
  const previousWeekStart = shiftTimelineStart(timelineStart, -7);
  const nextWeekStart = shiftTimelineStart(timelineStart, 7);
  const defaultWeekStart = getDefaultTimelineStart(new Date());
  const prefillDate = timelineSlots.some((slot) => slot.date === query.prefillDate) ? query.prefillDate || "" : "";
  const prefillSlot = timelineSlots.find((slot) => slot.date === prefillDate);

  return (
    <AdminShell
      title="主题设置"
      description="按周维护主题时间线。每周投票展示周六到下周五的 7 个主题，请保证排期连续。"
    >
      {query.saved ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">主题已新增。</section> : null}
      {query.updated ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">主题已更新。</section> : null}
      {query.error ? <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{query.error}</section> : null}

      <SectionCard
        title="每周主题时间线"
        description="按周检查 7 天主题是否完整；缺口可以直接一键带入新增表单日期。"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <div className="space-y-1">
            <p className="font-medium text-slate-900">当前查看从 {timelineStart} 开始的一周</p>
            <p>已排 {timelineSummary.scheduled} 天，缺口 {timelineSummary.missing} 天；建议补齐 7 天主题时间线</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/admin/topics?weekStart=${previousWeekStart}`} className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-sky-300 hover:text-sky-700">上一周</Link>
            <Link href={`/admin/topics?weekStart=${defaultWeekStart}`} className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-sky-300 hover:text-sky-700">回到本周</Link>
            <Link href={`/admin/topics?weekStart=${nextWeekStart}`} className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-sky-300 hover:text-sky-700">下一周</Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {timelineSlots.map((slot) => (
            <article key={slot.date} className={`rounded-2xl border p-4 ${slot.missing ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-white'}`}>
              <p className="text-xs text-slate-500">{slot.weekdayLabel}</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{slot.date}</p>
              {slot.topic ? (
                <>
                  <p className="mt-3 font-medium text-slate-900">{slot.topic.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{slot.topic.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">排序 {slot.topic.orderNo}</span>
                    <span className={`rounded-full px-3 py-1 ${slot.topic.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {slot.topic.status === 1 ? '启用' : '停用'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-3 font-medium text-rose-700">这一天还没有主题</p>
                  <p className="mt-1 text-sm text-rose-600">可以直接补这一天，新增表单会自动带入日期，方便补齐 7 天时间线。</p>
                  <Link href={`/admin/topics?weekStart=${timelineStart}&prefillDate=${slot.date}#create-topic`} className="mt-3 inline-flex rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100">补这一天</Link>
                </>
              )}
            </article>
          ))}
        </div>
      </SectionCard>

      <section id="create-topic">
        <SectionCard
          title="新增主题"
          description="新增主题后会进入管理员主题时间线，也会自动参与每周投票候选池。"
        >
          <form action={createTopicAction} className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
            <label className="grid gap-2">
              <span>主题标题</span>
              <input name="title" className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="例如：情绪触发点拆解" required />
            </label>
            <label className="grid gap-2">
              <span>排序值</span>
              <input name="orderNo" type="number" defaultValue={nextOrderNo} className="rounded-2xl border border-slate-200 px-4 py-3" required />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span>一句摘要</span>
              <input name="summary" className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="用于投票和打卡页的简短说明" required />
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
              <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-white md:w-auto">保存主题</button>
            </div>
          </form>
        </SectionCard>
      </section>

      <SectionCard
        title="已有主题"
        description="可以修正文案、排序、启停状态或安排日期，修改后前台会按最新时间线展示。"
      >
        <div className="space-y-4">
          {topics.map((item) => (
            <form key={item.id} action={updateTopicAction} className="grid gap-4 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 md:grid-cols-2">
              <input type="hidden" name="topicId" value={item.id} />
              <input type="hidden" name="returnWeekStart" value={timelineStart} />
              <label className="grid gap-2">
                <span>主题标题</span>
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
