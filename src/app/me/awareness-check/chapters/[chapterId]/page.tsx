import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { getApiUnavailableCopy } from "@/app/api-copy.mjs";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { getAwarenessCheckChapter, getAwarenessCheckTrends, type AwarenessCheckChapterTrendPoint } from "@/lib/api";
import { requireLogin } from "@/lib/auth";

import { AwarenessCheckStepper } from "./stepper";

type AwarenessCheckChapterPageProps = {
  params: Promise<{ chapterId: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

function formatScore(value?: number) {
  if (value === undefined || value === null) {
    return "--";
  }
  return `${Math.round(value)}分`;
}

function formatSigned(value?: number) {
  if (value === undefined || value === null || value === 0) {
    return "0";
  }
  return `${value > 0 ? "+" : ""}${Math.round(value)}`;
}

function splitSubmittedAt(value?: string) {
  if (!value) {
    return { date: "刚刚提交" };
  }

  const [date, time] = value.replace("T", " ").trim().split(/\s+/, 2);
  return { date: date.slice(5).replace("-", "/"), time: time?.slice(0, 5) };
}

function Notice({ children, tone = "success" }: { children: string; tone?: "success" | "error" }) {
  return (
    <section
      className={[
        "app-alert border",
        tone === "error"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-[rgba(19,111,99,0.12)] bg-[linear-gradient(180deg,rgba(248,253,250,0.96)_0%,rgba(239,250,244,0.96)_100%)] text-[var(--success-text)]",
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function ScorePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-3 text-center">
      <span className="block text-[11px] leading-none text-[var(--foreground-faint)]">{label}</span>
      <strong className="mt-2 block text-[15px] leading-none text-[var(--foreground)]">{value}</strong>
    </div>
  );
}

function ChapterHistoryPanel({ history }: { history: AwarenessCheckChapterTrendPoint[] }) {
  const visible = history.slice(-8);
  const trendPoints = visible.map((item, index) => ({
    x: ((index + 0.5) / visible.length) * 1000,
    y: 180 - Math.max(0, Math.min(item.score, 100)) * 1.8,
  }));
  const trendPath = trendPoints.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");

  return (
    <SectionCard title="本章历史" description="柱状显示每次提交的分数，折线展示最近记录的变化趋势。">
      {history.length > 0 ? (
        <div role="img" aria-label="本章历次检测评分柱状图与趋势折线，柱内显示分数，柱下显示提交时间">
          <div className="mb-4 flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
            <p className="text-[13px] font-semibold text-[var(--foreground)]">历次得分</p>
            <p className="text-[12px] text-[var(--foreground-faint)]">单位：分</p>
          </div>
          <div className="mx-auto grid w-full max-w-[680px] grid-cols-[34px_minmax(0,1fr)] gap-3">
            <div className="flex h-[180px] flex-col justify-between pb-1 text-right text-[11px] text-[var(--foreground-faint)]">
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            <div className="relative grid grid-cols-[repeat(var(--history-count),minmax(0,1fr))] border-b border-l border-[rgba(135,160,154,0.28)] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(50%-1px),rgba(135,160,154,0.16)_calc(50%-1px),rgba(135,160,154,0.16)_50%,transparent_50%,transparent_calc(100%-1px),rgba(135,160,154,0.16)_calc(100%-1px),rgba(135,160,154,0.16)_100%)] px-2" style={{ "--history-count": visible.length } as CSSProperties}>
              <svg className="pointer-events-none absolute inset-x-2 top-0 z-10 h-[180px] w-[calc(100%-1rem)] overflow-visible" viewBox="0 0 1000 180" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="history-trend-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5b7cde" />
                    <stop offset="100%" stopColor="#b05fd3" />
                  </linearGradient>
                </defs>
                {trendPoints.length > 1 ? <path d={trendPath} fill="none" stroke="url(#history-trend-gradient)" strokeWidth="4" vectorEffect="non-scaling-stroke" /> : null}
                {trendPoints.map((point, index) => (
                  <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r={index === trendPoints.length - 1 ? "6" : "5"} fill="#ffffff" stroke={index === trendPoints.length - 1 ? "#b05fd3" : "#6f79c9"} strokeWidth="3" vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
              {visible.map((item, index) => {
                const submittedAt = splitSubmittedAt(item.submittedAt);
                const isLatest = index === visible.length - 1;
                return (
                  <div key={`${item.checkId}-${item.submittedAt || index}`} className="relative z-[1] grid h-[226px] min-w-0 grid-rows-[180px_46px]">
                    <div className="flex items-end justify-center">
                      <div
                        className={isLatest ? "flex w-10 max-w-full items-start justify-center rounded-t-[8px] bg-[linear-gradient(180deg,#2ca6b5_0%,#4479ce_100%)] pt-2 text-[13px] font-semibold text-white shadow-[0_4px_10px_rgba(68,121,206,0.16)]" : "flex w-10 max-w-full items-start justify-center rounded-t-[8px] bg-[linear-gradient(180deg,#7bc5c2_0%,#79a6d5_100%)] pt-2 text-[13px] font-semibold text-white"}
                        style={{ height: `${Math.max(18, Math.min(item.score, 100))}%` }}
                      >
                        {Math.round(item.score)}
                      </div>
                    </div>
                    <div className="pt-3 text-center">
                      <p className="text-[11px] leading-4 text-[var(--foreground-faint)]">{submittedAt.date}{submittedAt.time ? ` ${submittedAt.time}` : ""}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <p className="rounded-[20px] border border-[var(--border-soft)] bg-white/78 px-4 py-4 text-sm leading-7 text-[var(--foreground-soft)]">
          这章还没有提交记录。完成一次本章检测后，这里会显示评分趋势和历史对比。
        </p>
      )}
    </SectionCard>
  );
}

export default async function AwarenessCheckChapterPage({ params, searchParams }: AwarenessCheckChapterPageProps) {
  await requireLogin();

  const { chapterId: chapterIdParam } = await params;
  const query = await searchParams;
  const chapterId = Number(chapterIdParam);
  if (!Number.isFinite(chapterId) || chapterId <= 0) {
    notFound();
  }

  let data: Awaited<ReturnType<typeof getAwarenessCheckChapter>>;
  let trends: Awaited<ReturnType<typeof getAwarenessCheckTrends>>;
  try {
    [data, trends] = await Promise.all([getAwarenessCheckChapter(chapterId), getAwarenessCheckTrends()]);
  } catch {
    const apiUnavailable = getApiUnavailableCopy();

    return (
      <AppShell title="单章检测" mobileThemeTitle="章节检测" description={apiUnavailable.pageDescription} hideHero>
        <SectionCard title={apiUnavailable.cardTitle} description={apiUnavailable.cardDescription}>
          <p className="text-sm text-[var(--foreground-soft)]">{apiUnavailable.hint}</p>
        </SectionCard>
      </AppShell>
    );
  }

  const hasSubmittedScore = data.chapter.status === "completed";
  const lastScore = data.chapter.hasPrevScore ? data.chapter.prevScore : undefined;
  const chapterHistory = trends.chapters.filter((item) => item.chapterId === data.chapter.chapterId);

  return (
    <AppShell title={data.chapter.chapterTitle} mobileThemeTitle="章节检测" description="用滑杆快速记录这一章的当前状态。" hideHero>
      {query.saved ? <Notice>本章评分已保存，可以之后继续提交。</Notice> : null}
      {query.error ? <Notice tone="error">这次操作没有成功，确认每个点都有评分后再试一次。</Notice> : null}

      <section className="rounded-[30px] border border-[rgba(204,219,212,0.92)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,249,246,0.92))] px-5 py-5 shadow-[var(--shadow-card)] md:px-7 md:py-7">
        <Link
          href="/me/awareness-check"
          className="inline-flex min-h-[40px] items-center justify-center rounded-[12px] border border-[#bdd2dc] bg-white/88 px-4 text-[13px] font-semibold text-[#315d80] shadow-[0_6px_14px_rgba(49,93,128,0.08)] transition-colors duration-200 hover:border-[#91b1c1] hover:bg-[#f1f8f8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5e8ba1]"
        >
          <span aria-hidden="true" className="mr-2 text-[16px] leading-none">&larr;</span>
          返回检测总览
        </Link>
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_260px] md:items-end">
          <div>
            <span className="inline-flex min-h-[28px] items-center rounded-full border border-[rgba(19,111,99,0.14)] bg-white/80 px-3 text-[12px] font-semibold text-[var(--primary)]">
              第 {data.chapter.chapterNo} 章
            </span>
            <h1 className="mt-3 text-[28px] font-semibold leading-tight tracking-normal text-[var(--foreground)] md:text-[38px]">
              {data.chapter.chapterFullTitle || data.chapter.chapterTitle}
            </h1>
            <p className="mt-3 text-[14px] leading-7 text-[var(--foreground-soft)]">
              本章共 {data.chapter.totalPoints} 个检测点，当前已保存 {data.chapter.scoredPoints} 个。每次提交都会生成本章新成绩，并和上次成绩对比。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <ScorePill label={hasSubmittedScore ? "本章得分" : "上次得分"} value={hasSubmittedScore ? formatScore(data.chapter.score) : formatScore(lastScore)} />
            <ScorePill label="已评分" value={`${data.chapter.scoredPoints}/${data.chapter.totalPoints}`} />
            <ScorePill label="较上次" value={hasSubmittedScore && data.chapter.hasPrevScore ? formatSigned(data.chapter.scoreChange) : "提交后显示"} />
          </div>
        </div>
      </section>

      <ChapterHistoryPanel history={chapterHistory} />

      <AwarenessCheckStepper chapterId={data.chapter.chapterId} points={data.points} isRetest={hasSubmittedScore} />
    </AppShell>
  );
}
