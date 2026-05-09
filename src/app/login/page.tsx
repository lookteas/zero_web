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
    <div className="auth-premium-visual pointer-events-none absolute bottom-0 right-0 top-0 z-0 hidden min-w-[32rem] overflow-hidden rounded-r-[34px] bg-[linear-gradient(115deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_20%,rgba(226,247,244,0.62)_54%,rgba(255,255,255,0.5)_100%)] md:block md:w-[54%] lg:w-[56%]">
      <span className="absolute inset-y-0 left-0 w-36 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(246,252,251,0.7)_100%)]" />
      <span className="auth-premium-glow absolute right-[2%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-[rgba(255,255,255,0.78)] blur-3xl" />
      <span className="auth-premium-glow auth-premium-glow-delay absolute bottom-[-16%] left-[8%] h-[30rem] w-[30rem] rounded-full bg-[rgba(58,193,178,0.2)] blur-3xl" />
      <span className="auth-premium-ribbon absolute left-[-26%] top-[18%] h-36 w-[155%] [--auth-ribbon-rotate:-15deg] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.78)_35%,rgba(67,201,188,0.22)_56%,rgba(255,255,255,0)_100%)] blur-[1px]" />
      <span className="auth-premium-ribbon auth-premium-ribbon-delay absolute bottom-[20%] left-[-24%] h-32 w-[152%] [--auth-ribbon-rotate:13deg] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.58)_38%,rgba(19,111,99,0.12)_60%,rgba(255,255,255,0)_100%)] blur-[1px]" />

      <div className="auth-premium-orb absolute left-[58%] top-[48%] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.96)_0,rgba(255,255,255,0.34)_23%,rgba(109,217,207,0.16)_47%,rgba(19,111,99,0.05)_70%,rgba(255,255,255,0.1)_100%)] shadow-[inset_0_2px_18px_rgba(255,255,255,0.75),inset_0_-28px_60px_rgba(31,139,128,0.1),0_42px_100px_rgba(15,48,60,0.18)]">
        <span className="absolute inset-[14%] rounded-full border border-white/54" />
        <span className="absolute inset-[28%] rounded-full border border-[rgba(19,111,99,0.12)] bg-white/16" />
        <span className="absolute inset-[42%] rounded-full border border-white/38" />
        <span className="absolute left-[36%] top-[33%] h-20 w-20 rounded-full bg-white/70 blur-xl" />
      </div>

      <span className="auth-premium-glass absolute bottom-[9%] left-[22%] h-24 w-[58%] rounded-full border border-white/50 bg-white/28 shadow-[0_24px_56px_rgba(15,48,60,0.08)] backdrop-blur-xl" />
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

      <section className="app-auth-stage relative overflow-hidden rounded-[34px] border border-[var(--border-soft)]/90 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur">
        <AuthGrowthVisual />
        <div className="app-auth-hero relative z-[1] min-h-[18rem] px-6 pb-28 pt-8 md:min-h-[22rem] md:px-10 md:pb-32 md:pt-10">
          <div className="relative z-[1] md:max-w-[42%] lg:max-w-[40%]">
            <p className="text-sm font-medium tracking-[0.08em] text-[var(--primary)]/90">{hero.eyebrow}</p>
            <h1 className="mt-4 max-w-xs text-[34px] font-semibold leading-[1.2] tracking-tight text-[var(--foreground)] md:max-w-sm md:text-[42px]">
              {hero.title}
            </h1>
            <p className="mt-4 max-w-sm text-[15px] leading-8 text-[var(--foreground-soft)] md:text-base">
              {hero.description}
            </p>
          </div>
        </div>

        <div className="relative z-[1] px-4 pb-4 md:px-8 md:pb-8">
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
