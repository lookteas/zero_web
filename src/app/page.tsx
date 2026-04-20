import { getApiUnavailableCopy } from "@/app/api-copy.mjs";
import { getFeedbackChrome } from "@/app/feedback-chrome.mjs";
import { AppShell } from "@/components/app-shell";
import { PrimaryLinkButton } from "@/components/primary-button";
import { SectionCard } from "@/components/section-card";
import { StatusCard } from "@/components/status-card";
import { getHome } from "@/lib/api";
import { requireLogin } from "@/lib/auth";

import { getHomeSections, getHomeStatusItems } from "./home-layout.mjs";

function getPrimaryActionText(todayTaskExists: boolean) {
  return todayTaskExists ? "继续完成今天的打卡" : "去开始今天的打卡";
}

function HomeStatusIcon({ kind }: { kind: "continuousDays" | "pendingReviewCount" }) {
  if (kind === "continuousDays") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l1.9 4.2L18 9l-3 2.9.7 4.1L12 13.9 8.3 16l.7-4.1L6 9l4.1-1.8L12 3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function TodayFocusIcon() {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-100 bg-[linear-gradient(180deg,rgba(230,248,240,0.98)_0%,rgba(245,251,247,0.98)_100%)] shadow-[0_8px_18px_rgba(19,111,99,0.08)]">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 4v16M4 12h16" strokeLinecap="round" />
        <circle cx="12" cy="12" r="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function HomeMoodHero({ topicTitle }: { topicTitle?: string }) {
  const eyebrow = topicTitle ? `正在练习 · ${topicTitle}` : "今天，慢一点也没关系";

  return (
    <section className="home-hero app-surface relative overflow-hidden px-5 py-6 md:px-7 md:py-7">
      <div className="home-hero-glow home-hero-glow-left" />
      <div className="home-hero-glow home-hero-glow-right" />
      <div className="home-hero-orbit home-hero-orbit-outer" />
      <div className="home-hero-orbit home-hero-orbit-middle" />
      <div className="home-hero-orbit home-hero-orbit-inner" />
      <div className="home-hero-dot home-hero-dot-1" />
      <div className="home-hero-dot home-hero-dot-2" />
      <div className="home-hero-dot home-hero-dot-3" />

      <div className="relative z-[1] max-w-xl">
        <span className="inline-flex items-center rounded-full border border-[rgba(216,230,225,0.9)] bg-white/70 px-3 py-1 text-[12px] font-medium tracking-[0.04em] text-[var(--foreground-soft)] backdrop-blur-sm">
          {eyebrow}
        </span>
        <h2 className="mt-4 text-[28px] font-semibold tracking-[-0.04em] text-[var(--foreground)] md:text-[40px]">
          今天，先对齐自己
        </h2>
        <p className="mt-3 max-w-lg text-[14px] leading-7 text-[var(--foreground-soft)] md:text-[15px] md:leading-8">
          把注意力收回到当下，知道自己为什么练，再开始今天的记录和回看。
        </p>
      </div>
    </section>
  );
}

export default async function Home() {
  await requireLogin();

  try {
    const home = await getHome();
    const sections = getHomeSections();
    const statusItems = getHomeStatusItems(home.overview);
    const recoveryCount = home.recoveryReviews?.length ?? 0;
    const secondaryButtonChrome = getFeedbackChrome("secondaryButton");

    return (
      <AppShell title="首页" description="先看清今天最重要的一件事，再决定下一步要不要展开更多内容。" hideHero>
        <HomeMoodHero topicTitle={home.todayTask?.topicTitle} />

        {sections.map((section) => {
          if (section.key === "statusRow") {
            return (
              <div key={section.key} className="grid grid-cols-2 gap-2 md:max-w-lg md:gap-3">
                <StatusCard
                  label={statusItems[0].label}
                  value={statusItems[0].value}
                  metric={statusItems[0].metric}
                  unit={statusItems[0].unit}
                  hint="连续留下来的节奏，会慢慢变成底气。"
                  icon={<HomeStatusIcon kind="continuousDays" />}
                  badges={statusItems[0].badges}
                  ornamentKind={statusItems[0].ornamentKind}
                  accentClassName="bg-[radial-gradient(circle_at_top_left,rgba(214,245,229,0.92)_0,rgba(214,245,229,0)_32%),linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.97)_100%)]"
                />
                <StatusCard
                  label={statusItems[1].label}
                  value={statusItems[1].value}
                  metric={statusItems[1].metric}
                  unit={statusItems[1].unit}
                  hint={recoveryCount > 0 ? "其中包含恢复复盘。" : "到了时间再慢慢回看。"}
                  icon={<HomeStatusIcon kind="pendingReviewCount" />}
                  badges={statusItems[1].badges}
                  ornamentKind={statusItems[1].ornamentKind}
                  accentClassName="bg-[radial-gradient(circle_at_top_left,rgba(255,238,214,0.9)_0,rgba(255,238,214,0)_34%),linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(251,249,245,0.97)_100%)]"
                />
              </div>
            );
          }

          if (section.key === "todayFocus") {
            return (
              <section key={section.key} className="overflow-hidden rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-[linear-gradient(180deg,rgba(245,250,247,0.96)_0%,rgba(255,255,255,0.98)_48%,rgba(243,248,245,0.96)_100%)] px-4 py-4 shadow-[0_18px_46px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.94)] md:px-6 md:py-6">
                <div className="p-1 md:p-2">
                  <h2 className="inline-flex items-center gap-2.5 text-[18px] font-semibold tracking-[0.01em] text-[var(--primary)]">
                    <TodayFocusIcon />
                    <span>今日主任务</span>
                  </h2>

                  <div className="mt-4 rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-white/92 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-5">
                    {home.todayTask ? (
                      <>
                        <p className="text-[12px] font-medium tracking-[0.08em] text-[var(--primary)]/80">今天的练习重点</p>
                        <p className="mt-2 text-[18px] font-semibold tracking-tight text-[var(--foreground)] md:text-[20px]">
                          {home.todayTask.topicTitle}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[var(--foreground-soft)]">{home.todayTask.topicSummary}</p>
                        <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">
                          当前状态：{home.todayTask.status === "submitted" ? "今天已提交" : "还可以继续编辑"}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm leading-7 text-[var(--foreground-soft)]">
                        今天的任务还没生成，点下面按钮后系统会为你准备今天的练习主题。
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col gap-2 md:flex-row md:gap-3">
                    <PrimaryLinkButton href="/today" className="md:w-auto">
                      {getPrimaryActionText(Boolean(home.todayTask))}
                    </PrimaryLinkButton>

                    <PrimaryLinkButton
                      href="/today/history"
                      variant="secondary"
                      className={[secondaryButtonChrome.className, "md:w-auto"].join(" ")}
                    >
                      看看过去的打卡
                    </PrimaryLinkButton>
                  </div>
                </div>
              </section>
            );
          }

          return null;
        })}
      </AppShell>
    );
  } catch {
    const apiUnavailable = getApiUnavailableCopy();

    return (
      <AppShell title="首页" description={apiUnavailable.pageDescription}>
        <SectionCard title={apiUnavailable.cardTitle} description={apiUnavailable.cardDescription}>
          <p className="text-sm text-[var(--foreground-soft)]">{apiUnavailable.hint}</p>
        </SectionCard>
      </AppShell>
    );
  }
}
