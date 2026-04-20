import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { authErrorCopy } from "@/app/action-copy.mjs";
import { SectionCard } from "@/components/section-card";

import { adminLoginAction } from "./actions";

type AdminLoginPageProps = {
  searchParams: Promise<{ loginError?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const query = await searchParams;
  const cookieStore = await cookies();

  if (cookieStore.get("zero_admin_id")?.value) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 lg:px-6">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-medium text-violet-700">Zero Admin</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">管理员登录</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">这里是独立后台入口，只用于主题设置、讨论配置和后台管理。</p>
        </section>

        {query.loginError ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {authErrorCopy.adminLoginFailed}
          </section>
        ) : null}

        <SectionCard title="后台登录" description="使用 admin_users 表中的管理员账号登录。">
          <form action={adminLoginAction} className="space-y-4 text-sm text-slate-700">
            <input name="username" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="输入管理员账号" required />
            <input name="password" type="password" minLength={6} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="输入管理员密码" required />
            <button type="submit" className="rounded-full bg-slate-900 px-5 py-3 text-white">登录后台</button>
          </form>
        </SectionCard>

        <Link href="/login" className="text-sm text-slate-500 transition hover:text-violet-700">返回前台登录</Link>
      </div>
    </div>
  );
}
