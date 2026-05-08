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

function BrandSlot({ title }: { title: string }) {
  return (
    <>
      <Link
        href="/"
        className="group relative flex min-h-[74px] w-full overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(238,249,247,0.96)_54%,rgba(226,243,240,0.94)_100%)] px-5 py-4 shadow-[0_12px_28px_rgba(15,48,60,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:border-[var(--primary)]/30 md:hidden"
        aria-label={`回到首页：${title}`}
      >
        <span className="pointer-events-none absolute -right-8 -top-9 h-32 w-32 rounded-full border border-[rgba(19,111,99,0.12)] bg-[radial-gradient(circle,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_66%)]" />
        <span className="pointer-events-none absolute right-9 top-5 h-12 w-12 rounded-full border border-[rgba(19,111,99,0.1)]" />
        <span className="mobile-brand-marquee pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.68)_42%,rgba(34,211,238,0.16)_64%,rgba(255,255,255,0)_100%)]" />
        <span className="mobile-brand-glowline pointer-events-none absolute inset-x-5 bottom-2 h-px bg-[linear-gradient(90deg,rgba(19,111,99,0)_0%,rgba(19,111,99,0.36)_50%,rgba(19,111,99,0)_100%)]" />
        <span className="relative z-[1] flex min-w-0 flex-col justify-center">
          <span className="text-[11px] font-semibold uppercase leading-none tracking-[0.18em] text-[var(--primary)]/70">Zero</span>
          <span className="mt-2 max-w-full truncate text-[clamp(20px,6vw,26px)] font-semibold leading-tight tracking-[0.01em] text-[var(--foreground)]">
            {title}
          </span>
        </span>
      </Link>

      <Link
        href="/"
        className="hidden items-center rounded-full border border-[var(--border-soft)] bg-white/95 px-4 py-2 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:border-[var(--primary)]/30 hover:bg-[var(--surface-soft)] md:inline-flex"
      >
        <span className="hidden items-center text-[22px] font-bold tracking-[0.01em] text-[var(--foreground)] md:inline-flex">Zero</span>
      </Link>
    </>
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
          <BrandSlot title={title} />

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
