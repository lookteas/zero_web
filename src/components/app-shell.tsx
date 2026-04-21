import Link from "next/link";
import { ReactNode } from "react";
import { cookies } from "next/headers";

import { logoutAction } from "@/app/login/actions";
import { BottomTabNav } from "@/components/bottom-tab-nav";
import { PageHero } from "@/components/page-hero";
import { TopNav } from "@/components/top-nav";
import { getDesktopAccountAreaClassName } from "@/lib/app-shell-ui.mjs";

type AppShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  hideNavigation?: boolean;
  hideHero?: boolean;
};

function BrandSlot() {
  return (
    <Link
      href="/"
      className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-white/95 px-4 py-2 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:border-[var(--primary)]/30 hover:bg-[var(--surface-soft)]"
    >
      <span className="inline-flex min-h-10 items-center text-[14px] font-semibold tracking-[0.03em] text-[var(--foreground)] md:hidden">Zero</span>
      <span className="hidden items-center text-[22px] font-bold tracking-[0.01em] text-[var(--foreground)] md:inline-flex">Zero</span>
    </Link>
  );
}

export async function AppShell({
  title,
  description,
  children,
  hideNavigation = false,
  hideHero = false,
}: AppShellProps) {
  const cookieStore = await cookies();
  const account = cookieStore.get("zero_user_account")?.value;
  const showNavigation = Boolean(account) && !hideNavigation;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-[14px] pb-24 pt-3 md:px-6 md:pb-10 md:pt-6">
        <header className="mb-3 grid items-center gap-3 md:mb-5 md:grid-cols-[auto_1fr_auto] md:gap-6">
          <BrandSlot />

          {showNavigation ? <TopNav /> : <div className="hidden md:block" />}

          {account ? (
            <div className={getDesktopAccountAreaClassName()}>
              <div className="max-w-none truncate rounded-full border border-[var(--border-soft)] bg-white px-5 py-2.5 text-[15px] text-[var(--foreground-soft)] shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                您好，{account}
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--border-strong)] bg-white/95 px-5 text-[15px] font-medium text-[var(--foreground)] shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:bg-[var(--surface-soft)]"
                >
                  退出
                </button>
              </form>
            </div>
          ) : null}
        </header>

        {!hideHero ? <PageHero title={title} description={description} /> : null}
        <div className={["flex flex-col gap-3.5 md:gap-6", hideHero ? "" : "mt-3.5 md:mt-6"].join(" ")}>
          {children}
        </div>
      </main>
      {showNavigation ? <BottomTabNav /> : null}
    </div>
  );
}
