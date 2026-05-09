import { cookies } from "next/headers";
import { ReactNode } from "react";

import { logoutAction } from "@/app/login/actions";
import { AppShell } from "@/components/app-shell";
import { PrimaryButton } from "@/components/primary-button";
import { requireLogin } from "@/lib/auth";

type FeatureTone = "primary" | "cyan" | "amber" | "violet";

const featureToneMap: Record<
  FeatureTone,
  {
    panel: string;
    icon: string;
    status: string;
  }
> = {
  primary: {
    panel: "border-[rgba(167,211,190,0.82)] bg-[rgba(232,244,238,0.9)]",
    icon: "border-[rgba(19,111,99,0.14)] bg-[rgba(236,253,245,0.96)] text-[var(--primary)]",
    status: "border-[rgba(19,111,99,0.14)] bg-white/72 text-[var(--primary)]",
  },
  cyan: {
    panel: "border-[rgba(125,211,252,0.66)] bg-[rgba(236,254,255,0.9)]",
    icon: "border-[rgba(14,116,144,0.12)] bg-white/84 text-[#0e7490]",
    status: "border-[rgba(14,116,144,0.14)] bg-white/72 text-[#0e7490]",
  },
  amber: {
    panel: "border-[rgba(251,191,36,0.58)] bg-[rgba(255,247,237,0.92)]",
    icon: "border-[rgba(217,119,6,0.12)] bg-white/84 text-[#b45309]",
    status: "border-[rgba(217,119,6,0.14)] bg-white/72 text-[#b45309]",
  },
  violet: {
    panel: "border-[rgba(196,181,253,0.74)] bg-[rgba(245,243,255,0.9)]",
    icon: "border-[rgba(124,58,237,0.12)] bg-white/84 text-[#7c3aed]",
    status: "border-[rgba(124,58,237,0.14)] bg-white/72 text-[#7c3aed]",
  },
};

const growthFeatures = [
  {
    title: "意识强度检测",
    description: "把最近的打卡、觉察和复盘整理成一份个人状态评估。",
    status: "优先规划",
    tone: "primary" as const,
  },
  {
    title: "潜催文档优化",
    description: "根据你的练习目标，辅助梳理更清晰、更容易执行的潜催文档。",
    status: "规划中",
    tone: "cyan" as const,
  },
  {
    title: "AI 辅助",
    description: "在写打卡、做复盘时提供提示、追问和表达优化。",
    status: "即将开放",
    tone: "violet" as const,
  },
];

const securityFeatures = [
  {
    title: "密码修改",
    description: "更新登录密码，保护当前账号的长期记录。",
    status: "待接入",
    tone: "amber" as const,
  },
];

function FeatureIcon({ tone }: { tone: FeatureTone }) {
  return (
    <span className={["inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.86)]", featureToneMap[tone].icon].join(" ")}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 4v16M4 12h16" strokeLinecap="round" />
        <circle cx="12" cy="12" r="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function FeatureCard({
  title,
  description,
  status,
  tone,
}: {
  title: string;
  description: string;
  status: string;
  tone: FeatureTone;
}) {
  const toneClass = featureToneMap[tone];

  return (
    <article className={["rounded-[24px] border px-4 py-4 shadow-[0_10px_24px_rgba(15,48,60,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(15,48,60,0.07)]", toneClass.panel].join(" ")}>
      <div className="flex items-start gap-3">
        <FeatureIcon tone={tone} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold leading-6 text-[var(--foreground)] md:text-[16px]">{title}</h3>
            <span className={["inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none", toneClass.status].join(" ")}>
              {status}
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm">{description}</p>
        </div>
      </div>
    </article>
  );
}

function FeatureSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,248,0.94)_100%)] px-4 py-4 shadow-[var(--shadow-card)] md:px-5 md:py-5">
      <div className="mb-4">
        <span className="inline-flex items-center rounded-full border border-[rgba(41,122,106,0.16)] bg-white/86 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[var(--primary)] shadow-[0_6px_16px_rgba(19,111,99,0.06)]">
          {eyebrow}
        </span>
        <h2 className="mt-3 text-[18px] font-semibold tracking-[0.01em] text-[var(--foreground)] md:text-[20px]">{title}</h2>
        <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">{description}</p>
      </div>
      {children}
    </section>
  );
}

function AccountHero({ account }: { account: string }) {
  const initial = account.trim().slice(0, 1).toUpperCase() || "Z";

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[rgba(204,219,212,0.92)] bg-[radial-gradient(circle_at_top_right,rgba(174,228,220,0.72)_0,rgba(174,228,220,0)_38%),linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(241,249,247,0.95)_100%)] px-5 py-5 shadow-[var(--shadow-card)] md:px-7 md:py-7">
      <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full border border-[rgba(19,111,99,0.12)]" />
      <div className="pointer-events-none absolute right-14 top-10 h-16 w-16 rounded-full border border-[rgba(19,111,99,0.1)]" />

      <div className="relative z-[1] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(232,244,238,0.96)_100%)] text-[26px] font-semibold text-[var(--primary)] shadow-[0_14px_28px_rgba(15,48,60,0.08)]">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase leading-none tracking-[0.16em] text-[var(--primary)]/70">Zero Account</p>
            <h1 className="mt-2 truncate text-[24px] font-semibold tracking-tight text-[var(--foreground)] md:text-[30px]">{account}</h1>
            <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm">把练习记录、复盘提醒和后续智能能力统一放在这里。</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:min-w-[220px]">
          <div className="rounded-[20px] border border-white/78 bg-white/72 px-3 py-3 shadow-[0_8px_18px_rgba(15,48,60,0.04)]">
            <p className="text-[11px] text-[var(--foreground-faint)]">账号状态</p>
            <p className="mt-1 text-[14px] font-semibold text-[var(--primary)]">已登录</p>
          </div>
          <div className="rounded-[20px] border border-white/78 bg-white/72 px-3 py-3 shadow-[0_8px_18px_rgba(15,48,60,0.04)]">
            <p className="text-[11px] text-[var(--foreground-faint)]">能力中心</p>
            <p className="mt-1 text-[14px] font-semibold text-[var(--foreground)]">建设中</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function MePage() {
  await requireLogin();

  const cookieStore = await cookies();
  const account = cookieStore.get("zero_user_account")?.value || "当前账号";

  return (
    <AppShell title="我的" mobileThemeTitle="个人中心" description="查看当前登录账号，并从这里安全退出。" hideHero>
      <AccountHero account={account} />

      <FeatureSection
        eyebrow="成长工具"
        title="下一步要完善的个人能力"
        description="把会反复使用的能力整理成入口，先让方向和优先级清楚，后续逐步接入真实功能。"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {growthFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </FeatureSection>

      <FeatureSection
        eyebrow="账号安全"
        title="登录与安全设置"
        description="安全相关能力单独放置，和成长工具区分开，后续接入时用户会更容易找到。"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {securityFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
          <form action={logoutAction} className="rounded-[24px] border border-[var(--border-soft)] bg-white/90 px-4 py-4 shadow-[0_10px_24px_rgba(15,48,60,0.04)]">
            <div className="mb-3">
              <h3 className="text-[15px] font-semibold text-[var(--foreground)] md:text-[16px]">退出当前账号</h3>
              <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm">退出后需要重新登录才能继续记录和复盘。</p>
            </div>
            <PrimaryButton type="submit" variant="secondary">
              退出登录
            </PrimaryButton>
          </form>
        </div>
      </FeatureSection>
    </AppShell>
  );
}
