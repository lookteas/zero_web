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
    <div className="min-h-screen bg-[#eef7f8] text-slate-950">
      <header className="border-b border-cyan-900/10 bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:px-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cyan-700">Zero Admin</p>
              <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">后台管理台</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-[10px] border border-cyan-900/10 bg-cyan-50 px-3 py-2 text-sm text-cyan-900">当前管理员：{session.adminName || session.adminId}</span>
              <form action={adminLogoutAction}>
                <button type="submit" className="cursor-pointer rounded-[10px] border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-600 hover:text-cyan-800">
                  退出后台
                </button>
              </form>
            </div>
          </div>
          <nav className="flex flex-wrap gap-1.5 border-t border-cyan-900/10 pt-3">
            {adminNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-[10px] px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 lg:px-6">
        <section className="rounded-[14px] border border-cyan-900/10 bg-white px-5 py-4 shadow-[0_12px_30px_rgba(8,91,110,0.06)]">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
          {description ? <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-600">{description}</p> : null}
        </section>
        {children}
      </main>
    </div>
  );
}
