import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/section-card";
import { listAdminUsers } from "@/lib/api";
import { requireAdmin } from "@/lib/admin-auth";

import { updateUserAction } from "./actions";
import { getAdminUserPageSummaryCards, getAdminUsersEmptyStateCopy } from "./users-page.mjs";

type AdminUsersPageProps = {
  searchParams: Promise<{ saved?: string; error?: string; keyword?: string; status?: string }>;
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  await requireAdmin();

  const query = await searchParams;
  const filters = {
    keyword: String(query.keyword ?? '').trim(),
    status: query.status === '0' || query.status === '1' ? query.status : '',
  };

  const data = await listAdminUsers({ ...filters, pageSize: 100 });
  const summaryCards = getAdminUserPageSummaryCards(data.summary);
  const emptyState = getAdminUsersEmptyStateCopy(filters);

  return (
    <AdminShell title="用户管理" description="查看当前用户量、基础资料和账号状态；本期仅支持资料维护，不改密码。">
      {query.saved ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">用户资料已保存。</section> : null}
      {query.error ? <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{query.error}</section> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article key={card.label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
          </article>
        ))}
      </section>

      <SectionCard title="筛选用户" description="支持按关键词和状态快速筛到需要维护的账号。">
        <form action="/admin/users" className="grid gap-4 text-sm text-slate-700 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]">
          <label className="grid gap-2">
            <span>关键词</span>
            <input name="keyword" defaultValue={filters.keyword} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="账号 / 昵称 / 邮箱 / 手机号" />
          </label>
          <label className="grid gap-2">
            <span>状态</span>
            <select name="status" defaultValue={filters.status} className="rounded-2xl border border-slate-200 px-4 py-3">
              <option value="">全部</option>
              <option value="1">启用</option>
              <option value="0">停用</option>
            </select>
          </label>
          <div className="flex items-end gap-3">
            <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-white md:w-auto">应用筛选</button>
            <Link href="/admin/users" className="w-full rounded-full border border-slate-200 px-5 py-3 text-center text-slate-700 md:w-auto">清空</Link>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="用户列表" description={`当前列表 ${data.list.length} 人，总用户 ${data.summary.total} 人。`}>
        {data.list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            <p className="text-base font-semibold text-slate-900">{emptyState.title}</p>
            <p className="mt-2 leading-6">{emptyState.description}</p>
            <div className="mt-4">
              <Link href="/admin/users" className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-violet-300 hover:text-violet-700">
                {emptyState.actionLabel}
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {data.list.map((user) => (
              <form key={user.id} action={updateUserAction} className="grid gap-4 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 md:grid-cols-2">
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="returnKeyword" value={filters.keyword} />
                <input type="hidden" name="returnStatus" value={filters.status} />

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                  <p className="text-xs text-slate-500">用户 #{user.id}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{user.nickname || user.account}</p>
                  <p className="mt-2 text-slate-600">账号：{user.account}</p>
                  <p className="mt-1 text-slate-500">创建时间：{user.createdAt}；最近登录：{user.lastLoginAt || '暂无记录'}</p>
                </div>

                <label className="grid gap-2">
                  <span>昵称</span>
                  <input name="nickname" defaultValue={user.nickname} className="rounded-2xl border border-slate-200 px-4 py-3" required />
                </label>
                <label className="grid gap-2">
                  <span>状态</span>
                  <select name="status" defaultValue={String(user.status)} className="rounded-2xl border border-slate-200 px-4 py-3">
                    <option value="1">启用</option>
                    <option value="0">停用</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span>邮箱</span>
                  <input name="email" type="email" defaultValue={user.email} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="可留空" />
                </label>
                <label className="grid gap-2">
                  <span>手机号</span>
                  <input name="mobile" defaultValue={user.mobile} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="可留空" />
                </label>
                <label className="grid gap-2 md:col-span-2">
                  <span>头像地址</span>
                  <input name="avatar" defaultValue={user.avatar} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="可留空" />
                </label>
                <div className="flex justify-end md:col-span-2">
                  <button type="submit" className="w-full rounded-full border border-slate-900 px-5 py-3 text-slate-900 md:w-auto">保存用户资料</button>
                </div>
              </form>
            ))}
          </div>
        )}
      </SectionCard>
    </AdminShell>
  );
}
