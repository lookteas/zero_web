import { cookies } from "next/headers";
import Link from "next/link";
import { ReactNode } from "react";

import { logoutAction } from "@/app/login/actions";
import { AppShell } from "@/components/app-shell";
import { requireLogin } from "@/lib/auth";

type ToolTone = "mint" | "blue" | "purple";

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
  { value: "12", label: "累计文档" },
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

const toolToneMap: Record<ToolTone, string> = {
  mint: "border-[oklch(88%_0.018_185)] bg-[color-mix(in_oklch,oklch(50%_0.095_175),white_92%)] text-[oklch(50%_0.095_175)]",
  blue: "border-[oklch(88%_0.018_185)] bg-[color-mix(in_oklch,oklch(61%_0.150_245),white_92%)] text-[oklch(52%_0.130_235)]",
  purple: "border-[oklch(88%_0.018_185)] bg-[color-mix(in_oklch,oklch(63%_0.160_285),white_92%)] text-[oklch(52%_0.130_285)]",
};

const tools = [
  {
    title: "意识强度检测",
    description: "根据打卡、觉察和复盘记录，形成阶段性的意识状态参考。",
    compactDescription: "形成阶段性的意识状态参考",
    status: "规划中",
    action: "查看规划",
    icon: "+",
    tone: "mint" as const,
  },
  {
    title: "潜催文档优化",
    description: "整理互催记录，生成结构统一、便于复盘的标准文档。",
    compactDescription: "整理互催记录，生成标准复盘文档",
    status: "已开放",
    action: "开始整理",
    icon: "⌁",
    tone: "blue" as const,
    href: "/me/hypnosis-documents",
  },
  {
    title: "AI 辅助",
    description: "在打卡、复盘和文档整理中提供提示、追问与表达优化。",
    compactDescription: "基于当前练习记录提出改进建议",
    status: "即将上线",
    action: "加入提醒",
    icon: "A",
    tone: "purple" as const,
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

function ToolCard({ tool }: { tool: (typeof tools)[number] }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3 md:block">
        <span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[17px] border border-white/80 bg-white/70 text-[20px] font-black leading-none md:h-12 md:w-12 md:rounded-[18px]">
          {tool.icon}
        </span>
        <span className="inline-flex min-h-[26px] shrink-0 items-center rounded-full bg-white/80 px-2.5 text-[12px] font-extrabold text-[oklch(50%_0.095_175)] md:min-h-[28px]">
          {tool.status}
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="text-[16px] font-bold tracking-normal text-[oklch(24%_0.042_215)] md:text-[19px]">{tool.title}</h3>
        <p className="mt-1.5 text-[13px] leading-6 text-[oklch(56%_0.030_215)] md:mt-2 md:text-sm md:leading-7">
          <span className="md:hidden">{tool.compactDescription}</span>
          <span className="hidden md:inline">{tool.description}</span>
        </p>
      </div>
      <SmallAction href={tool.href} muted={!tool.href}>
        {tool.action}
      </SmallAction>
    </>
  );

  const className = [
    "grid gap-3 rounded-[20px] border p-3.5 transition md:min-h-[190px] md:grid-rows-[auto_1fr_auto] md:gap-3.5 md:rounded-[22px] md:p-[18px] md:hover:-translate-y-0.5 md:hover:shadow-[0_18px_34px_rgba(29,82,82,0.10)]",
    toolToneMap[tool.tone],
  ].join(" ");

  if (tool.href) {
    return (
      <article className={className}>
        {body}
      </article>
    );
  }

  return <article className={className}>{body}</article>;
}

function ToolsPanel() {
  return (
    <Panel
      id="tools-center"
      eyebrow="能力中心"
      title="个人练习工具"
      description="常用能力会逐步集中到这里，当前先开放文档整理工具，其他能力按试用反馈持续完善。"
      action={
        <div className="hidden shrink-0 rounded-full border border-[oklch(88%_0.018_185)] bg-[oklch(96%_0.010_185/.84)] p-1 md:flex">
          {["全部", "已开放", "规划中"].map((item, index) => (
            <span
              key={item}
              className={[
                "inline-flex min-h-[34px] items-center rounded-full px-3 text-[13px] font-bold",
                index === 0 ? "bg-white text-[oklch(24%_0.042_215)] shadow-[0_8px_18px_rgba(34,88,86,0.09)]" : "text-[oklch(56%_0.030_215)]",
              ].join(" ")}
            >
              {item}
            </span>
          ))}
        </div>
      }
    >
      <div className="grid gap-3 px-5 pb-5 md:grid-cols-3 md:gap-3.5 md:px-6 md:pb-6">
        {tools.map((tool) => (
          <ToolCard key={tool.title} tool={tool} />
        ))}
      </div>
    </Panel>
  );
}

function SecurityPanel() {
  return (
    <Panel id="security-center" eyebrow="账号安全" title="登录与安全设置">
      <div className="grid gap-3 px-5 pb-5 md:grid-cols-2 md:gap-3.5 md:px-6 md:pb-6">
        <article className="rounded-[18px] border border-[color-mix(in_oklch,oklch(67%_0.130_55),white_60%)] bg-[color-mix(in_oklch,oklch(67%_0.130_55),white_91%)] p-3.5 md:rounded-[22px] md:p-[18px]">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[15px] font-bold text-[oklch(24%_0.042_215)] md:text-lg">密码修改</h3>
            <span className="inline-flex min-h-[26px] shrink-0 items-center rounded-full bg-white/80 px-2.5 text-[12px] font-extrabold text-[oklch(67%_0.130_55)]">
              待开放
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-6 text-[oklch(56%_0.030_215)] md:text-sm md:leading-7">
            支持自主更新登录密码，进一步保护个人练习数据。
          </p>
          <div className="mt-3">
            <SmallAction muted>设置密码</SmallAction>
          </div>
        </article>

        <form action={logoutAction} className="rounded-[18px] border border-[oklch(88%_0.018_185)] bg-white p-3.5 md:rounded-[22px] md:p-[18px]">
          <h3 className="text-[15px] font-bold text-[oklch(24%_0.042_215)] md:text-lg">退出当前账号</h3>
          <p className="mt-2 text-[12px] leading-6 text-[oklch(56%_0.030_215)] md:text-sm md:leading-7">
            退出后需要重新登录，才能继续使用个人练习工具。
          </p>
          <button
            type="submit"
            className="mt-3 inline-flex min-h-[34px] items-center justify-center rounded-full border border-[oklch(88%_0.018_185)] bg-white px-3 text-[12px] font-semibold leading-none text-[oklch(24%_0.042_215)] transition hover:border-[oklch(50%_0.095_175)] hover:text-[oklch(50%_0.095_175)] md:text-[13px]"
          >
            退出登录
          </button>
        </form>
      </div>
    </Panel>
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
