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

      <section className="overflow-hidden rounded-[34px] border border-[var(--border-soft)]/90 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="app-auth-hero min-h-[18rem] px-6 pb-28 pt-8 md:min-h-[22rem] md:px-10 md:pb-32 md:pt-10">
          <p className="text-sm font-medium tracking-[0.08em] text-[var(--primary)]/90">{hero.eyebrow}</p>
          <h1 className="mt-4 max-w-xs text-[34px] font-semibold leading-[1.2] tracking-tight text-[var(--foreground)] md:max-w-sm md:text-[42px]">
            {hero.title}
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-8 text-[var(--foreground-soft)] md:text-base">
            {hero.description}
          </p>
        </div>

        <div className="px-4 pb-4 md:px-8 md:pb-8">
          <section className="-mt-20 rounded-[30px] border border-white/80 bg-[rgba(255,255,255,0.94)] p-5 shadow-[0_20px_46px_rgba(15,23,42,0.08)] backdrop-blur md:ml-2 md:max-w-md md:p-6">
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
