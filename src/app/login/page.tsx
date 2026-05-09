import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authErrorCopy } from "@/app/action-copy.mjs";
import { AppShell } from "@/components/app-shell";
import { FormField } from "@/components/form-field";
import { PrimaryButton } from "@/components/primary-button";

import { getAuthHeroContent } from "./auth-hero.mjs";
import { loginAction, registerAction } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{ loginError?: string; registerError?: string }>;
};

function AuthGrowthVisual() {
  return (
    <div className="auth-growth-visual pointer-events-none absolute right-8 top-8 hidden h-[18rem] w-[45%] min-w-[25rem] overflow-hidden rounded-[32px] border border-white/45 bg-white/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] backdrop-blur-[2px] md:block lg:right-12 lg:top-10 lg:h-[20rem] lg:w-[44%]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.62)_0,rgba(255,255,255,0)_30%),linear-gradient(135deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_60%)]" />

      <svg className="auth-growth-path absolute inset-x-8 top-8 h-40 w-[calc(100%-4rem)]" viewBox="0 0 520 180" fill="none" aria-hidden="true">
        <path className="auth-growth-path-line" d="M24 136C94 62 160 146 226 88C291 30 352 98 496 40" stroke="url(#authGrowthLine)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M24 136C94 62 160 146 226 88C291 30 352 98 496 40" stroke="rgba(255,255,255,0.62)" strokeWidth="10" strokeLinecap="round" opacity="0.36" />
        <defs>
          <linearGradient id="authGrowthLine" x1="24" y1="136" x2="496" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#136f63" stopOpacity="0.18" />
            <stop offset="0.48" stopColor="#0f766e" stopOpacity="0.72" />
            <stop offset="1" stopColor="#22c7b8" stopOpacity="0.92" />
          </linearGradient>
        </defs>
      </svg>

      <span className="auth-growth-node left-[13%] top-[58%]" />
      <span className="auth-growth-node auth-growth-node-delay left-[44%] top-[33%]" />
      <span className="auth-growth-node left-[78%] top-[21%]" />

      <div className="auth-growth-card absolute bottom-8 right-8 w-[17rem] rounded-[28px] border border-white/72 bg-white/76 p-5 shadow-[0_22px_44px_rgba(15,48,60,0.12)]">
        <p className="text-[12px] font-semibold tracking-[0.16em] text-[var(--primary)]/75">今日觉察</p>
        <p className="mt-3 text-[22px] font-semibold leading-tight tracking-tight text-[var(--foreground)]">把变化留在今天</p>
        <div className="mt-4 grid gap-2">
          <span className="h-2 rounded-full bg-[rgba(19,111,99,0.18)]" />
          <span className="h-2 w-4/5 rounded-full bg-[rgba(19,111,99,0.12)]" />
          <span className="h-2 w-2/3 rounded-full bg-[rgba(19,111,99,0.09)]" />
        </div>
      </div>
    </div>
  );
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const cookieStore = await cookies();

  if (cookieStore.get("zero_user_id")?.value) {
    redirect("/");
  }

  const hero = getAuthHeroContent();

  return (
    <AppShell title="登录" description="登录后开始今天的打卡。" hideHero hideNavigation>
      {query.loginError ? (
        <section className="rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {authErrorCopy.loginFailed}
        </section>
      ) : null}
      {query.registerError ? (
        <section className="rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {authErrorCopy.registerFailed}
        </section>
      ) : null}

      <section className="overflow-hidden rounded-[34px] border border-[var(--border-soft)]/90 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
        <div className="app-auth-hero relative min-h-[18rem] px-6 pb-28 pt-8 md:min-h-[22rem] md:px-10 md:pb-32 md:pt-10">
          <div className="relative z-[1] md:max-w-[42%] lg:max-w-[40%]">
            <p className="text-sm font-medium tracking-[0.08em] text-[var(--primary)]/90">{hero.eyebrow}</p>
            <h1 className="mt-4 max-w-xs text-[34px] font-semibold leading-[1.2] tracking-tight text-[var(--foreground)] md:max-w-sm md:text-[42px]">
              {hero.title}
            </h1>
            <p className="mt-4 max-w-sm text-[15px] leading-8 text-[var(--foreground-soft)] md:text-base">
              {hero.description}
            </p>
          </div>
          <AuthGrowthVisual />
        </div>

        <div className="px-4 pb-4 md:px-8 md:pb-8">
          <section className="-mt-20 rounded-[30px] border border-white/80 bg-[rgba(255,255,255,0.94)] p-5 shadow-[0_20px_46px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur md:ml-2 md:max-w-md md:p-6">
            <form className="space-y-4">
              <FormField
                name="account"
                label="账号"
                placeholder="输入手机号、邮箱或用户名"
                autoComplete="username"
                required
              />
              <FormField
                name="password"
                type="password"
                label="密码"
                placeholder="输入密码"
                autoComplete="current-password"
                minLength={6}
                required
              />
              <div className="space-y-3 pt-3">
                <PrimaryButton type="submit" formAction={loginAction}>
                  {hero.actions[0]}
                </PrimaryButton>
                <PrimaryButton type="submit" variant="secondary" formAction={registerAction}>
                  {hero.actions[1]}
                </PrimaryButton>
              </div>
            </form>
            <p className="mt-5 text-sm leading-7 text-[var(--foreground-soft)]">
              {hero.note}
            </p>
          </section>
        </div>
      </section>
    </AppShell>
  );
}
