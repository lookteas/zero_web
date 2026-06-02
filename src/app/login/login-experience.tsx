"use client";

import Image from "next/image";
import { useState, type SVGProps } from "react";

type AuthFormAction = (formData: FormData) => void | Promise<void>;

type LoginExperienceProps = {
  loginAction: AuthFormAction;
  registerAction: AuthFormAction;
  loginError: boolean;
  registerError: boolean;
};

type IconProps = SVGProps<SVGSVGElement>;

function LeafIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M19 4c-5.8.3-10.2 2.2-12.4 5.2-2 2.8-1.8 6.1.2 8.1 2 2 5.3 2.3 8.1.2C17.8 15.4 19.7 9.9 19 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 18c2.8-4.6 6.1-7.5 10-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloudIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.5 18h9.2a4 4 0 0 0 .4-8 6 6 0 0 0-11.2 1.5A3.3 3.3 0 0 0 7.5 18Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatherIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20 4c-5.5.1-10 1.7-13.4 4.9-2.8 2.6-3.4 6.5-1.3 8.6 2.2 2.2 6.1 1.6 8.7-1.2C17.4 12.7 19.6 8.6 20 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 20c3.5-4 7-7.4 11-10.3M8.5 15.5H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M9.4 5.5A10 10 0 0 1 12 5c5.8 0 9 7 9 7a15.3 15.3 0 0 1-3 4.1M14.1 14.2A3 3 0 0 1 9.8 9.9M6.4 7.3A15.5 15.5 0 0 0 3 12s3.2 7 9 7c1.1 0 2.1-.2 3-.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FloatingIcon({
  children,
  className,
  delay = "0s",
}: {
  children: React.ReactNode;
  className: string;
  delay?: string;
}) {
  return (
    <span className={`login-float absolute ${className}`} style={{ animationDelay: delay }}>
      {children}
    </span>
  );
}

function TextField({
  id,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  required = true,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5 md:space-y-2" htmlFor={id}>
      <span className="block text-xs font-semibold text-emerald-950/80 md:text-sm md:font-medium">{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="h-10 w-full rounded-xl border border-emerald-200/60 bg-white/90 px-3.5 text-sm text-emerald-950/90 outline-none transition duration-200 placeholder:text-emerald-900/35 focus:border-emerald-400/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(16,185,129,0.12)] md:h-11 md:border-[var(--border-soft)] md:bg-[var(--surface-muted)]/40 md:px-4 md:text-[14px] md:placeholder:text-[var(--foreground-soft)]/70"
      />
    </label>
  );
}

function PasswordField({
  id,
  name,
  label,
  placeholder,
  showPassword,
  onToggle,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  showPassword: boolean;
  onToggle: () => void;
  autoComplete?: string;
}) {
  return (
    <label className="block space-y-1.5 md:space-y-2" htmlFor={id}>
      <span className="block text-xs font-semibold text-emerald-950/80 md:text-sm md:font-medium">{label}</span>
      <span className="relative block">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={6}
          required
          className="h-10 w-full rounded-xl border border-emerald-200/60 bg-white/90 px-3.5 pr-10 text-sm text-emerald-950/90 outline-none transition duration-200 placeholder:text-emerald-900/35 focus:border-emerald-400/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(16,185,129,0.12)] md:h-11 md:border-[var(--border-soft)] md:bg-[var(--surface-muted)]/40 md:px-4 md:pr-11 md:text-[14px] md:placeholder:text-[var(--foreground-soft)]/70"
        />
        <button
          type="button"
          aria-label={showPassword ? "隐藏密码" : "显示密码"}
          onClick={onToggle}
          className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-emerald-900/45 transition hover:bg-emerald-50 hover:text-emerald-900/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
        </button>
      </span>
    </label>
  );
}

function SubmitButton({
  children,
  formAction,
}: {
  children: string;
  formAction: AuthFormAction;
}) {
  return (
    <button
      type="submit"
      formAction={formAction}
      className="h-10 w-full cursor-pointer rounded-xl bg-emerald-600 text-sm font-medium text-white shadow-md shadow-emerald-600/15 transition duration-200 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 md:h-11"
    >
      {children}
    </button>
  );
}

export function LoginExperience({
  loginAction,
  registerAction,
  loginError,
  registerError,
}: LoginExperienceProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const activeError = isLogin ? loginError : registerError;

  return (
    <main className="flex h-[100dvh] overflow-hidden bg-white text-[var(--foreground)] lg:flex-row">
      <section className="relative hidden w-[48%] overflow-hidden bg-[linear-gradient(135deg,#ecfdf5_0%,#f0fdfa_54%,rgba(255,251,235,0.82)_100%)] lg:flex xl:w-1/2">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.72)_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_center,#10b981_1px,transparent_1px)] [background-size:30px_30px]" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-teal-200/20 blur-2xl" />

        <FloatingIcon className="left-[15%] top-[12%]" delay="0s">
          <LeafIcon className="h-8 w-8 text-emerald-300/60" />
        </FloatingIcon>
        <FloatingIcon className="right-[20%] top-[20%]" delay="-1.5s">
          <CloudIcon className="h-10 w-10 text-teal-300/50" />
        </FloatingIcon>
        <FloatingIcon className="bottom-[25%] left-[10%]" delay="-2s">
          <FeatherIcon className="h-7 w-7 text-amber-300/60" />
        </FloatingIcon>
        <FloatingIcon className="bottom-[15%] right-[15%]" delay="-0.5s">
          <SunIcon className="h-9 w-9 text-amber-300/50" />
        </FloatingIcon>

        <div className="relative z-10 flex w-full flex-col items-center justify-center px-12 xl:px-20">
          <div className="login-enter w-full max-w-md">
            <Image
              src="/login-illustration.png"
              alt="平和时光 - 享受生活的每一刻"
              width={864}
              height={1152}
              priority
              className="h-auto w-full rounded-2xl shadow-lg"
            />
          </div>

          <div className="login-enter mt-8 max-w-md text-center [animation-delay:120ms]">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-950/80 xl:text-4xl">慢一点，没关系</h1>
            <p className="mt-3 text-base leading-relaxed text-emerald-800/60 xl:text-lg">
              把今天重要的一件事，认真做完
              <br />
              从每天的打卡开始，一点点看到自己的改变
            </p>
          </div>

          <div className="login-enter mt-10 flex gap-8 [animation-delay:220ms]">
            {[
              { icon: LeafIcon, label: "每日打卡" },
              { icon: SunIcon, label: "习惯养成" },
              { icon: FeatherIcon, label: "心境记录" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/60 shadow-sm backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-emerald-700/70" />
                </span>
                <span className="text-xs font-medium text-emerald-800/50">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hidden flex-1 items-center justify-start bg-white pl-10 pr-16 lg:flex xl:pl-12 xl:pr-20">
        <div className="login-enter w-full max-w-[380px] [animation-delay:80ms]">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">{isLogin ? "欢迎回来" : "创建账号"}</h2>
            <p className="mt-1.5 text-sm text-[var(--foreground-soft)]">
              {isLogin ? "登录你的账号，继续你的旅程" : "注册一个新账号，开启新的旅程"}
            </p>
          </div>
          <AuthForm
            isLogin={isLogin}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            setIsLogin={setIsLogin}
            loginAction={loginAction}
            registerAction={registerAction}
            activeError={activeError}
          />
          <p className="mt-6 text-center text-xs leading-relaxed text-[var(--foreground-soft)]/70">
            {isLogin
              ? "登录即表示你同意我们的服务条款和隐私政策"
              : "如果你还没有账号，直接输入想使用的账号和密码，点击“注册”就能开始使用。"}
          </p>
          <div className="mt-8 border-t border-[var(--border-soft)]/70 pt-6 text-center">
            <p className="text-xs text-[var(--foreground-soft)]/60">© 2026 慢时光 · 用心生活，慢慢成长</p>
          </div>
        </div>
      </section>

      <section className="relative flex h-full flex-1 flex-col overflow-hidden bg-[linear-gradient(180deg,#ecfdf5_0%,rgba(240,253,250,0.7)_52%,rgba(209,250,229,0.42)_100%)] lg:hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:radial-gradient(circle_at_center,#10b981_1px,transparent_1px)] [background-size:30px_30px]" />
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-emerald-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-amber-200/20 blur-3xl" />
        <FloatingIcon className="left-[10%] top-[8%]" delay="0s">
          <LeafIcon className="h-5 w-5 text-emerald-300/40" />
        </FloatingIcon>
        <FloatingIcon className="right-[15%] top-[5%]" delay="-1.5s">
          <CloudIcon className="h-6 w-6 text-teal-300/35" />
        </FloatingIcon>
        <FloatingIcon className="bottom-[12%] right-[8%]" delay="-2s">
          <SunIcon className="h-5 w-5 text-amber-300/40" />
        </FloatingIcon>

        <div className="relative z-10 flex flex-col items-center px-6 pb-6 pt-11">
          <div className="login-enter flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/60 shadow-sm backdrop-blur-sm">
              <LeafIcon className="h-5 w-5 text-emerald-700" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-950/75">慢一点，没关系</h1>
          </div>
          <p className="login-enter mt-3 text-center text-sm leading-relaxed text-emerald-800/50 [animation-delay:120ms]">
            把今天重要的一件事，认真做完
          </p>
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center px-5">
          <div className="login-enter w-full max-w-[400px] rounded-2xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-emerald-950/5 backdrop-blur-xl [animation-delay:80ms]">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-emerald-950/80">{isLogin ? "欢迎回来" : "创建账号"}</h2>
              <p className="mt-0.5 text-xs text-emerald-800/45">
                {isLogin ? "登录你的账号，继续你的旅程" : "注册一个新账号，开启新的旅程"}
              </p>
            </div>
            <AuthForm
              isLogin={isLogin}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              setIsLogin={setIsLogin}
              loginAction={loginAction}
              registerAction={registerAction}
              activeError={activeError}
            />
            <p className="mt-3.5 text-center text-[10px] leading-relaxed text-emerald-800/35">
              {isLogin ? "登录即表示你同意我们的服务条款和隐私政策" : "直接输入想使用的账号和密码，点击“注册”就能开始使用。"}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-auto pb-4 text-center">
          <p className="text-[11px] text-emerald-800/30">© 2026 慢时光 · 用心生活，慢慢成长</p>
        </div>
      </section>
    </main>
  );
}

function AuthForm({
  isLogin,
  showPassword,
  setShowPassword,
  setIsLogin,
  loginAction,
  registerAction,
  activeError,
}: {
  isLogin: boolean;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  setIsLogin: (value: boolean) => void;
  loginAction: AuthFormAction;
  registerAction: AuthFormAction;
  activeError: boolean;
}) {
  return (
    <form className="space-y-3.5 md:space-y-5">
      {activeError ? (
        <p
          id={isLogin ? "login-error-alert" : "register-error-alert"}
          className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs leading-5 text-rose-700"
        >
          {isLogin ? "登录失败，请检查账号和密码后重试。" : "注册失败，请检查账号、密码和确认密码后重试。"}
        </p>
      ) : null}

      <TextField id={isLogin ? "account-login" : "account-register"} name="account" label="账号" placeholder="输入手机号、邮箱或用户名" autoComplete="username" />
      <PasswordField
        id={isLogin ? "password-login" : "password-register"}
        name="password"
        label="密码"
        placeholder="输入密码"
        showPassword={showPassword}
        onToggle={() => setShowPassword(!showPassword)}
        autoComplete={isLogin ? "current-password" : "new-password"}
      />

      {!isLogin ? (
        <div className="login-field-in">
          <TextField
            id="confirm-password"
            name="confirmPassword"
            label="确认密码"
            placeholder="再次输入密码"
            type="password"
            autoComplete="new-password"
          />
        </div>
      ) : null}

      {isLogin ? (
        <div className="flex justify-end">
          <button type="button" className="cursor-pointer text-xs text-emerald-700/65 transition hover:text-emerald-700">
            忘记密码？
          </button>
        </div>
      ) : null}

      <div className="space-y-3">
        {isLogin ? <SubmitButton formAction={loginAction}>登 录</SubmitButton> : <SubmitButton formAction={registerAction}>注 册</SubmitButton>}

        <div className="relative pt-1 md:pt-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-emerald-200/45 md:border-[var(--border-soft)]/70" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white/70 px-3 text-[11px] text-emerald-800/35 md:bg-white md:text-xs md:text-[var(--foreground-soft)]/70">或</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="h-10 w-full cursor-pointer rounded-xl border border-emerald-200/55 bg-white/50 text-sm font-medium text-emerald-950/65 transition duration-200 hover:bg-white/70 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 md:h-11 md:border-[var(--border-soft)] md:bg-white md:text-[var(--foreground)]/75 md:hover:bg-[var(--surface-soft)]"
        >
          {isLogin ? "注册新账号" : "已有账号，去登录"}
        </button>
      </div>
    </form>
  );
}
