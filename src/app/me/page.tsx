import { cookies } from "next/headers";
import Link from "next/link";
import { ReactNode } from "react";

import { logoutAction } from "@/app/login/actions";
import { AppShell } from "@/components/app-shell";
import { requireLogin } from "@/lib/auth";

const statusCards = [
  { label: "账号状态", value: "已登录" },
  { label: "能力中心", value: "试用开放" },
  { label: "连续打卡", value: "18 天" },
  { label: "复盘队列", value: "4 条" },
];

const metrics = [
  { value: "3", label: "今日已完成" },
  { value: "2", label: "待处理复盘" },
  { value: "71%", label: "本周稳定度" },
  { value: "12", label: "累计互催" },
];

const tasks = [
  {
    title: "晨间觉察记录",
    meta: "已完成 · 07:42",
    action: "查看",
    href: "/logs",
    done: true,
  },
  {
    title: "专注练习 15 分钟",
    meta: "已完成 · 10:18",
    action: "复盘",
    href: "/reviews",
    done: true,
  },
  {
    title: "晚间复盘",
    meta: "记录今天的触发点和恢复方式",
    action: "完成",
    href: "/today",
    done: false,
  },
];

const tools = [
  {
    title: "意识强度检测",
    description: "按 9 个章节记录当前状态，随时回看阶段变化。",
    status: "已开放",
    action: "开始检测",
    href: "/me/awareness-check",
  },
  {
    title: "互催文档优化",
    description: "将已有互催记录整理成可用于复盘的规范文档。",
    status: "已开放",
    action: "开始整理",
    href: "/me/hypnosis-documents",
  },
  {
    title: "AI 辅助",
    description: "在练习、复盘和文档整理中提供针对性提示。",
    status: "即将上线",
    action: "加入提醒",
  },
];

const focusItems = [
  { label: "觉察记录", value: "5 / 7" },
  { label: "复盘整理", value: "2 条待办" },
  { label: "文档归档", value: "已同步" },
];

const heatmap = [
  "on",
  "on",
  "mid",
  "",
  "on",
  "mid",
  "on",
  "mid",
  "on",
  "on",
  "mid",
  "",
  "on",
  "on",
  "on",
  "",
  "mid",
  "on",
  "on",
  "mid",
  "",
  "on",
  "on",
  "mid",
  "on",
  "",
  "mid",
  "on",
];

function Panel({
  id,
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="overflow-hidden rounded-[26px] border border-[oklch(88%_0.018_185)] bg-white/80 shadow-[0_18px_42px_rgba(25,83,80,0.10)] md:rounded-[28px] md:shadow-[0_22px_58px_rgba(25,83,80,0.10)]"
    >
      <div className="flex flex-col gap-3 px-5 pb-4 pt-5 md:flex-row md:items-start md:justify-between md:px-6 md:pb-4 md:pt-6">
        <div className="min-w-0">
          <span className="inline-flex min-h-[28px] items-center rounded-full border border-[color-mix(in_oklch,oklch(50%_0.095_175),white_64%)] bg-white/80 px-3 text-[12px] font-semibold leading-none text-[oklch(50%_0.095_175)] md:text-[13px]">
            {eyebrow}
          </span>
          <h2 className="mt-3 text-[22px] font-bold leading-tight tracking-normal text-[oklch(24%_0.042_215)] md:text-[26px]">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm leading-7 text-[oklch(56%_0.030_215)] md:text-[15px]">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function SmallAction({
  href,
  children,
  muted = false,
}: {
  href?: string;
  children: ReactNode;
  muted?: boolean;
}) {
  const className = [
    "inline-flex min-h-[34px] shrink-0 items-center justify-center rounded-full border px-3 text-[12px] font-semibold leading-none transition md:text-[13px]",
    muted
      ? "border-[oklch(88%_0.018_185)] bg-white/72 text-[oklch(56%_0.030_215)]"
      : "border-[color-mix(in_oklch,oklch(50%_0.095_175),white_62%)] bg-white text-[oklch(24%_0.042_215)] hover:border-[oklch(50%_0.095_175)] hover:text-[oklch(50%_0.095_175)]",
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <span className={className} aria-disabled="true">
      {children}
    </span>
  );
}

function AccountHero({ account }: { account: string }) {
  const initial = account.trim().slice(0, 1).toUpperCase() || "Z";

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[color-mix(in_oklch,oklch(88%_0.018_185),white_14%)] bg-[radial-gradient(circle_at_94%_0%,oklch(86%_0.060_178/.70),transparent_14rem),linear-gradient(135deg,oklch(100%_0_0/.88),oklch(95%_0.028_180/.84))] px-5 py-5 shadow-[0_18px_42px_rgba(25,83,80,0.12)] md:min-h-[260px] md:rounded-[32px] md:bg-[radial-gradient(circle_at_88%_0%,oklch(85%_0.065_176/.75),transparent_25rem),linear-gradient(120deg,oklch(100%_0_0/.90),oklch(95%_0.030_178/.78))] md:p-7 md:shadow-[0_22px_58px_rgba(25,83,80,0.12)]">
      <div className="pointer-events-none absolute -right-11 -top-20 h-[190px] w-[190px] rounded-full border border-[oklch(72%_0.054_185/.42)] md:-right-20 md:-top-28 md:h-[420px] md:w-[420px]" />
      <div className="relative z-[1] grid gap-5 md:grid-cols-[minmax(0,1fr)_420px] md:items-end md:gap-7">
        <div>
          <div className="grid grid-cols-[70px_minmax(0,1fr)] items-center gap-4 md:grid-cols-[92px_minmax(0,1fr)] md:gap-5">
            <div className="grid h-[70px] w-[70px] place-items-center rounded-[24px] border border-[color-mix(in_oklch,oklch(50%_0.095_175),white_72%)] bg-white/80 text-[30px] font-extrabold leading-none text-[oklch(50%_0.095_175)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] md:h-[92px] md:w-[92px] md:rounded-[28px] md:text-[40px]">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-extrabold uppercase leading-none tracking-[0.14em] text-[oklch(50%_0.095_175)] md:text-[13px] md:tracking-[0.18em]">
                Zero 试用账号
              </p>
              <h1 className="mt-2 truncate text-[30px] font-extrabold leading-none tracking-normal text-[oklch(24%_0.042_215)] md:text-[clamp(42px,5vw,72px)]">
                {account}
              </h1>
              <p className="mt-3 max-w-[620px] text-sm leading-6 text-[oklch(56%_0.030_215)] md:text-lg md:leading-8">
                集中管理你的练习记录、阶段复盘、能力工具和账号安全设置。今天还有 2 项打卡任务可以完成。
              </p>
            </div>
          </div>
          <div className="mt-5 hidden flex-wrap gap-3 md:flex">
            <Link
              id="continue-today-practice"
              href="/today"
              className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[oklch(50%_0.095_175)] px-5 text-[15px] font-bold text-white shadow-[0_14px_28px_oklch(50%_0.095_175/.23)] transition hover:bg-[oklch(45%_0.09_180)]"
            >
              继续今日练习
            </Link>
            <Link
              href="/reviews"
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[oklch(88%_0.018_185)] bg-white/75 px-5 text-[15px] font-bold text-[oklch(24%_0.042_215)] transition hover:border-[oklch(50%_0.095_175)]"
            >
              整理本周复盘
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 md:gap-3">
          {statusCards.map((item) => (
            <div
              key={item.label}
              className="min-h-[78px] rounded-[20px] border border-white/80 bg-white/70 px-3.5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] md:min-h-[104px] md:rounded-[22px] md:p-4"
            >
              <span className="block text-[12px] text-[oklch(56%_0.030_215)] md:text-[13px]">{item.label}</span>
              <strong className="mt-2 block text-lg leading-none tracking-normal text-[oklch(24%_0.042_215)] md:text-2xl">
                {item.value}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickNav() {
  return (
    <nav id="personal-quick-nav" aria-label="页面快捷导航" className="grid grid-cols-3 gap-2.5 md:hidden">
      {[
        { href: "#today-center", label: "今日", active: true },
        { href: "#tools-center", label: "工具" },
        { href: "#security-center", label: "安全" },
      ].map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={[
            "inline-flex min-h-[44px] items-center justify-center rounded-[16px] border text-[13px] font-bold",
            item.active
              ? "border-transparent bg-[oklch(50%_0.095_175)] text-white shadow-[0_12px_24px_oklch(50%_0.095_175/.20)]"
              : "border-[oklch(88%_0.018_185)] bg-white/80 text-[oklch(56%_0.030_215)]",
          ].join(" ")}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

function TodayPanel() {
  return (
    <Panel
      id="today-center"
      eyebrow="今日中心"
      title={
        <>
          <span className="md:hidden">今日练习</span>
          <span className="hidden md:inline">练习进度</span>
        </>
      }
    >
      <div className="hidden grid-cols-4 gap-3 px-6 pb-6 md:grid">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-[20px] border border-[oklch(88%_0.018_185)] bg-[linear-gradient(180deg,white,oklch(97%_0.010_185))] p-4"
          >
            <strong className="block text-[30px] font-extrabold leading-none tracking-normal text-[oklch(24%_0.042_215)]">
              {metric.value}
            </strong>
            <span className="mt-2 block text-[13px] font-bold text-[oklch(56%_0.030_215)]">{metric.label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-5 px-5 pb-5 md:grid-cols-[250px_minmax(0,1fr)] md:gap-6 md:px-6 md:pb-6">
        <div className="grid grid-cols-[112px_minmax(0,1fr)] items-center gap-4 md:block">
          <div className="grid aspect-square w-[112px] place-items-center rounded-full bg-[conic-gradient(oklch(50%_0.095_175)_62%,oklch(90%_0.018_185)_0)] p-2.5 md:w-full md:p-[15px]">
            <div className="grid h-full w-full place-items-center rounded-full bg-[linear-gradient(180deg,white,oklch(96%_0.010_185))] text-center">
              <div>
                <strong className="block text-[28px] font-extrabold leading-none tracking-normal text-[oklch(24%_0.042_215)] md:text-5xl">
                  62%
                </strong>
                <span className="text-[11px] font-bold text-[oklch(56%_0.030_215)] md:text-[13px]">今日进度</span>
              </div>
            </div>
          </div>
          <div className="grid gap-2.5 md:hidden">
            {metrics.slice(0, 3).map((metric) => (
              <div key={metric.label} className="flex justify-between gap-3 border-b border-[oklch(88%_0.018_185)] pb-2.5 text-[13px] text-[oklch(56%_0.030_215)] last:border-b-0 last:pb-0">
                <span>{metric.label}</span>
                <strong className="text-[oklch(24%_0.042_215)]">{metric.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {tasks.map((task) => (
            <article
              key={task.title}
              className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] border border-[oklch(88%_0.018_185)] bg-white p-3 md:p-3.5"
            >
              <span
                className={[
                  "grid h-[38px] w-[38px] place-items-center rounded-[14px] border text-[15px] font-black",
                  task.done
                    ? "border-transparent bg-[oklch(53%_0.110_165)] text-white"
                    : "border-[color-mix(in_oklch,oklch(50%_0.095_175),white_58%)] bg-[color-mix(in_oklch,oklch(50%_0.095_175),white_90%)] text-[oklch(50%_0.095_175)]",
                ].join(" ")}
              >
                {task.done ? "✓" : "·"}
              </span>
              <div className="min-w-0">
                <strong className="block truncate text-sm font-bold text-[oklch(24%_0.042_215)] md:text-[15px]">{task.title}</strong>
                <span className="mt-1 block truncate text-[12px] text-[oklch(56%_0.030_215)] md:text-[13px]">{task.meta}</span>
              </div>
              <SmallAction href={task.href}>{task.action}</SmallAction>
            </article>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function ToolRow({ tool, index }: { tool: (typeof tools)[number]; index: number }) {
  const row = (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] border border-[rgba(19,111,99,0.13)] bg-[var(--surface-soft)] text-[13px] font-bold text-[var(--primary)]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-bold text-[oklch(24%_0.042_215)] md:text-[16px]">{tool.title}</h3>
          <span className={tool.href ? "inline-flex rounded-full bg-[rgba(224,246,239,0.92)] px-2 py-0.5 text-[11px] font-bold text-[var(--success-text)]" : "inline-flex rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[11px] font-bold text-[var(--foreground-soft)]"}>
            {tool.status}
          </span>
        </div>
        <p className="mt-1 text-[12px] leading-5 text-[oklch(56%_0.030_215)] md:text-[13px]">{tool.description}</p>
      </div>
      <SmallAction href={tool.href} muted={!tool.href}>{tool.action}</SmallAction>
    </>
  );

  return <article className="flex min-h-[72px] items-center gap-3 border-b border-[oklch(88%_0.018_185)] py-3 last:border-b-0 last:pb-0 first:pt-0 md:min-h-[76px]">{row}</article>;
}

function ToolsPanel() {
  return (
    <Panel
      id="tools-center"
      eyebrow="能力中心"
      title="个人练习工具"
      description="从这里进入检测、文档整理与后续的辅助能力。"
    >
      <div className="px-5 pb-5 md:px-6 md:pb-6">
        {tools.map((tool, index) => (
          <ToolRow key={tool.title} tool={tool} index={index} />
        ))}
      </div>
    </Panel>
  );
}

function SecurityPanel() {
  return (
    <section id="security-center" className="flex flex-col gap-4 rounded-[22px] border border-[oklch(88%_0.018_185)] bg-white/78 px-5 py-4 shadow-[0_12px_28px_rgba(25,83,80,0.06)] md:flex-row md:items-center md:justify-between md:px-6">
      <div className="min-w-0">
        <span className="text-[12px] font-bold tracking-[0.08em] text-[oklch(50%_0.095_175)]">账号安全</span>
        <h2 className="mt-1 text-[18px] font-bold text-[oklch(24%_0.042_215)]">登录与安全设置</h2>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 md:flex md:items-center md:gap-3">
        <div className="flex min-h-[44px] items-center justify-between gap-4 rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3">
          <span className="text-[13px] font-semibold text-[var(--foreground)]">密码修改</span>
          <span className="text-[12px] text-[var(--foreground-faint)]">待开放</span>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[14px] border border-[var(--border-soft)] bg-white px-4 text-[13px] font-semibold text-[var(--foreground)] transition hover:border-[oklch(50%_0.095_175)] hover:text-[oklch(50%_0.095_175)] md:w-auto">
            退出登录
          </button>
        </form>
      </div>
    </section>
  );
}

function SideCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[26px] border border-[oklch(88%_0.018_185)] bg-white/80 p-5 shadow-[0_18px_42px_rgba(25,83,80,0.10)]">
      <h3 className="mb-4 text-lg font-bold text-[oklch(24%_0.042_215)]">{title}</h3>
      {children}
    </section>
  );
}

function PersonalAside() {
  return (
    <aside aria-label="个人状态侧栏" className="hidden gap-4 md:sticky md:top-6 md:grid">
      <SideCard title="本月打卡热力">
        <div className="grid grid-cols-7 gap-1.5" aria-label="打卡热力图">
          {heatmap.map((level, index) => (
            <span
              key={`${level}-${index}`}
              className={[
                "aspect-square rounded-[9px] border border-white/70",
                level === "on"
                  ? "bg-[color-mix(in_oklch,oklch(50%_0.095_175),white_38%)]"
                  : level === "mid"
                    ? "bg-[color-mix(in_oklch,oklch(50%_0.095_175),white_66%)]"
                    : "bg-[oklch(93%_0.012_185)]",
              ].join(" ")}
            />
          ))}
        </div>
      </SideCard>

      <SideCard title="本周重点">
        <div className="grid gap-3">
          {focusItems.map((item) => (
            <div
              key={item.label}
              className="flex justify-between gap-3 border-b border-[oklch(88%_0.018_185)] pb-3 text-sm text-[oklch(56%_0.030_215)] last:border-b-0 last:pb-0"
            >
              <span>{item.label}</span>
              <strong className="text-[oklch(24%_0.042_215)]">{item.value}</strong>
            </div>
          ))}
        </div>
      </SideCard>

      <SideCard title="账号提醒">
        <p className="text-sm leading-7 text-[oklch(56%_0.030_215)]">
          上次登录：今天 10:18。当前为试用账号，能力中心会按反馈逐步开放。
        </p>
      </SideCard>
    </aside>
  );
}

export default async function MePage() {
  await requireLogin();

  const cookieStore = await cookies();
  const account = cookieStore.get("zero_user_account")?.value || "当前账号";

  return (
    <AppShell title="我的" mobileThemeTitle="个人中心" description="管理账号、工具和个人练习数据。" hideHero>
      <AccountHero account={account} />
      <QuickNav />

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_356px] md:items-start md:gap-5">
        <div className="grid gap-5">
          <TodayPanel />
          <ToolsPanel />
          <SecurityPanel />
        </div>
        <PersonalAside />
      </div>
    </AppShell>
  );
}
