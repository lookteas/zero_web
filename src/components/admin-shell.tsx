import Link from "next/link";
import { ReactNode } from "react";

import { adminLogoutAction } from "@/app/admin/login/actions";
import { getAdminSession } from "@/lib/admin-auth";

const adminNavItems = [
  { href: "/admin", label: "管理台" },
  { href: "/admin/topics", label: "主题设置" },
  { href: "/admin/discussions", label: "讨论设置" },
  { href: "/admin/users", label: "用户管理" },
];

type AdminShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export async function AdminShell({ title, description, children }: AdminShellProps) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-violet-700">Zero Admin</p>
              <h1 className="text-xl font-semibold">后台管理台</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">当前管理员：{session.adminName || session.adminId}</span>
              <form action={adminLogoutAction}>
                <button type="submit" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:text-violet-700">
                  退出后台
                </button>
              </form>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            {adminNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-violet-50 hover:text-violet-700">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:px-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
        </section>
        {children}
      </main>
    </div>
  );
}
