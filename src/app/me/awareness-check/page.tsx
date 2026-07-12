import Link from "next/link";
import type { CSSProperties } from "react";

import { getApiUnavailableCopy } from "@/app/api-copy.mjs";
import { AppShell } from "@/components/app-shell";
import { PrimaryLinkButton } from "@/components/primary-button";
import { SectionCard } from "@/components/section-card";
import {
  getAwarenessCheckCurrent,
  getAwarenessCheckTrends,
  type AwarenessCheckChapter,
  type AwarenessCheckTrendPoint,
} from "@/lib/api";
import { requireLogin } from "@/lib/auth";

import { createAwarenessCheckAction } from "./actions";

type AwarenessCheckPageProps = {
  searchParams: Promise<{ created?: string; submitted?: string; error?: string }>;
};

const statusLabelMap: Record<string, string> = {
  not_started: "未检测",
  in_progress: "进行中",
  completed: "有成绩",
};

function formatScore(value?: number) {
  if (value === undefined || value === null) {
    return "--";
  }
  return `${Math.round(value)}分`;
}

function formatDelta(value?: number) {
  if (value === undefined || value === null) {
    return "暂无变化";
  }
  return `${value > 0 ? "+" : ""}${Math.round(value)}分`;
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

function CheckHero({
  score,
  delta,
  doneChapters,
  totalChapters,
}: {
  score?: number;
  delta?: number;
  doneChapters: number;
  totalChapters: number;
}) {
  const progress = totalChapters > 0 ? Math.round((doneChapters / totalChapters) * 100) : 0;
  const hasOverallScore = totalChapters > 0 && doneChapters >= totalChapters;
  const remainingChapters = Math.max(totalChapters - doneChapters, 0);

  return (
    <section className="overflow-hidden rounded-[30px] border border-[rgba(204,219,212,0.92)] bg-[radial-gradient(circle_at_88%_0%,rgba(145,220,200,0.34),transparent_20rem),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,249,246,0.92))] px-5 py-5 shadow-[var(--shadow-card)] md:px-7 md:py-7">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_350px] md:items-end">
        <div>
          <span className="inline-flex min-h-[30px] items-center rounded-full border border-[rgba(19,111,99,0.14)] bg-white/80 px-3 text-[12px] font-semibold text-[var(--primary)]">
            个人练习工具
          </span>
          <h1 className="mt-4 text-[30px] font-semibold leading-tight tracking-normal text-[var(--foreground)] md:text-[44px]">
            意识强度检测
          </h1>
          <p className="mt-3 max-w-[680px] text-[14px] leading-7 text-[var(--foreground-soft)] md:text-[16px] md:leading-8">
            每个章节都可以反复测试。单章提交后立即记录本章成绩和上次对比；综合分会在 9 章都有最新成绩后显示。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <PrimaryLinkButton href="#chapter-grid" block={false}>
              选择章节检测
            </PrimaryLinkButton>
            <form action={createAwarenessCheckAction}>
              <button
                type="submit"
                className="inline-flex min-h-[46px] cursor-pointer items-center justify-center rounded-[18px] border border-[var(--border-strong)] bg-white/95 px-4 text-[14px] font-medium text-[var(--foreground)] shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition duration-200 hover:bg-[var(--surface-soft)] md:min-h-12 md:px-5"
              >
                清空未提交草稿
              </button>
            </form>
          </div>
        </div>

        <aside className="border-t border-[rgba(19,111,99,0.14)] pt-5 md:border-t-0 md:border-l md:pl-6 md:pt-0">
          <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4">
            <div className="grid aspect-square place-items-center rounded-full bg-[conic-gradient(var(--primary)_var(--progress),rgba(219,233,229,0.94)_0)] p-2" style={{ "--progress": `${progress}%` } as CSSProperties}>
              <div className="grid h-full w-full place-items-center rounded-full bg-white/95 text-center">
                <strong className="text-[22px] font-semibold leading-none text-[var(--foreground)]">{progress}%</strong>
                <span className="mt-1 block text-[11px] font-medium text-[var(--foreground-faint)]">完成度</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">综合结果</p>
              <strong className="mt-1.5 block text-[20px] leading-7 text-[var(--foreground)]">
                {hasOverallScore ? formatScore(score) : "尚未生成"}
              </strong>
              <p className="mt-1 text-[13px] leading-5 text-[var(--foreground-soft)]">
                {hasOverallScore ? "9 个章节的最新成绩已汇总。" : `完成剩余 ${remainingChapters} 章后生成综合分。`}
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 border-t border-[rgba(19,111,99,0.14)] pt-4 text-center">
            <div className="border-r border-[rgba(19,111,99,0.12)]">
              <span className="block text-[11px] text-[var(--foreground-faint)]">已完成</span>
              <strong className="mt-1 block text-[16px] text-[var(--foreground)]">{doneChapters}/{totalChapters}</strong>
            </div>
            <div className="border-r border-[rgba(19,111,99,0.12)]">
              <span className="block text-[11px] text-[var(--foreground-faint)]">待检测</span>
              <strong className="mt-1 block text-[16px] text-[var(--foreground)]">{remainingChapters}</strong>
            </div>
            <div>
              <span className="block text-[11px] text-[var(--foreground-faint)]">参考差值</span>
              <strong className={hasOverallScore && delta && delta > 0 ? "mt-1 block text-[16px] text-[var(--success-text)]" : "mt-1 block text-[16px] text-[var(--foreground)]"}>
                {hasOverallScore ? formatDelta(delta) : "--"}
              </strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ChapterCard({ chapter }: { chapter: AwarenessCheckChapter }) {
  const statusLabel = statusLabelMap[chapter.status] ?? chapter.status;
  const hasScore = chapter.status === "completed";
  const progressText = hasScore ? "最近一次已记录" : `${chapter.scoredPoints}/${chapter.totalPoints} 已评分`;
  const href = `/me/awareness-check/chapters/${chapter.chapterId}`;

  return (
    <article className="grid min-h-[176px] gap-4 rounded-[22px] border border-[var(--border-soft)] bg-white/86 p-4 shadow-[0_12px_28px_rgba(15,48,60,0.04)] transition hover:border-[rgba(19,111,99,0.24)] hover:shadow-[0_18px_34px_rgba(15,48,60,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[12px] font-semibold text-[var(--foreground-faint)]">第 {chapter.chapterNo} 章</span>
          <h3 className="mt-1 line-clamp-2 text-[16px] font-semibold leading-6 text-[var(--foreground)]">{chapter.chapterTitle}</h3>
        </div>
        <span className="inline-flex min-h-[28px] shrink-0 items-center rounded-full border border-[rgba(19,111,99,0.12)] bg-[rgba(238,248,244,0.98)] px-2.5 text-[12px] font-semibold text-[var(--primary)]">
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MiniMetric label="本章得分" value={hasScore ? formatScore(chapter.score) : "--"} />
        <MiniMetric label="参考" value={hasScore ? formatScore(chapter.refScore) : "--"} />
        <MiniMetric label="较上次" value={chapter.hasPrevScore ? formatDelta(chapter.scoreChange) : "暂无"} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] text-[var(--foreground-soft)]">{progressText}</span>
        <Link
          href={href}
          className="inline-flex min-h-[36px] items-center justify-center rounded-[12px] border border-[#aec8da] bg-[#eef6fb] px-3 text-[12px] font-semibold text-[#24506b] transition-colors duration-200 hover:border-[#8eafc5] hover:bg-[#deedf7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a7897]"
        >
          {hasScore ? "再次检测" : chapter.status === "in_progress" ? "继续检测" : "开始检测"}
        </Link>
      </div>
    </article>
  );
}

function MobileChapterTile({ chapter }: { chapter: AwarenessCheckChapter }) {
  const hasScore = chapter.status === "completed";
  const isInProgress = chapter.status === "in_progress";
  const href = `/me/awareness-check/chapters/${chapter.chapterId}`;
  const scoreLabel = hasScore ? formatScore(chapter.score) : isInProgress ? `${chapter.scoredPoints}/${chapter.totalPoints}` : "待检测";
  const actionLabel = hasScore ? "查看" : isInProgress ? "继续" : "开始";

  return (
    <Link
      href={href}
      aria-label={`第 ${chapter.chapterNo} 章 ${chapter.chapterTitle}，${scoreLabel}，${actionLabel}检测`}
      className="grid min-h-[106px] content-between rounded-[16px] border border-[var(--border-soft)] bg-white/90 p-3 shadow-[0_8px_18px_rgba(15,48,60,0.04)] transition hover:border-[rgba(19,111,99,0.28)] hover:shadow-[0_12px_24px_rgba(15,48,60,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
    >
      <div className="flex items-start justify-between gap-1.5">
        <span className="text-[11px] font-semibold leading-none text-[var(--foreground-faint)]">{String(chapter.chapterNo).padStart(2, "0")}</span>
        <span className={hasScore ? "h-2 w-2 shrink-0 rounded-full bg-[var(--success-text)]" : isInProgress ? "h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" : "h-2 w-2 shrink-0 rounded-full border border-[var(--border-strong)] bg-white"} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-5 text-[var(--foreground)]">{chapter.chapterTitle}</h3>
        <span className={hasScore ? "mt-1 block text-[12px] font-semibold leading-none text-[var(--success-text)]" : "mt-1 block text-[12px] font-semibold leading-none text-[var(--foreground-soft)]"}>{scoreLabel}</span>
      </div>
      <span className="text-[11px] font-semibold leading-none text-[var(--primary)]">{actionLabel}检测</span>
    </Link>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-3">
      <span className="block text-[11px] leading-none text-[var(--foreground-faint)]">{label}</span>
      <strong className="mt-2 block truncate text-[14px] leading-none text-[var(--foreground)]">{value}</strong>
    </div>
  );
}

function TrendPreview({ points }: { points: AwarenessCheckTrendPoint[] }) {
  const visible = points.slice(-6);
  const maxScore = Math.max(...visible.map((item) => item.score), 100);

  return (
    <SectionCard title="综合趋势" description="9 章都有最新成绩后，才生成综合分走势。">
      {visible.length > 0 ? (
        <div className="flex h-[150px] items-end gap-2 rounded-[22px] border border-[var(--border-soft)] bg-white/78 p-4">
          {visible.map((item) => (
            <div key={item.checkId} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-[94px] w-full items-end rounded-full bg-[var(--surface-soft)] px-1.5">
                <span
                  className="block w-full rounded-full bg-[linear-gradient(180deg,var(--primary)_0%,var(--primary-deep)_100%)]"
                  style={{ height: `${Math.max(8, (item.score / maxScore) * 94)}px` }}
                />
              </div>
              <span className="text-[11px] text-[var(--foreground-faint)]">{item.doneChapters}/{item.totalChapters}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-[20px] border border-[var(--border-soft)] bg-white/78 px-4 py-4 text-sm leading-7 text-[var(--foreground-soft)]">
          综合分还没生成。先把 9 个章节都至少测一次；各章最新成绩会直接显示在章节卡中。
        </p>
      )}
    </SectionCard>
  );
}

export default async function AwarenessCheckPage({ searchParams }: AwarenessCheckPageProps) {
  await requireLogin();
  const query = await searchParams;

  let current: Awaited<ReturnType<typeof getAwarenessCheckCurrent>>;
  let trends: Awaited<ReturnType<typeof getAwarenessCheckTrends>>;

  try {
    [current, trends] = await Promise.all([getAwarenessCheckCurrent(), getAwarenessCheckTrends()]);
  } catch {
    const apiUnavailable = getApiUnavailableCopy();

    return (
      <AppShell title="意识强度检测" mobileThemeTitle="意识检测" description={apiUnavailable.pageDescription} hideHero>
        <SectionCard title={apiUnavailable.cardTitle} description={apiUnavailable.cardDescription}>
          <p className="text-sm text-[var(--foreground-soft)]">{apiUnavailable.hint}</p>
        </SectionCard>
      </AppShell>
    );
  }

  return (
    <AppShell title="意识强度检测" mobileThemeTitle="意识检测" description="按章节检测当前意识强度。" hideHero>
      {query.created ? <Notice>未提交草稿已重置；已提交的章节成绩和历史不受影响。</Notice> : null}
      {query.submitted ? <Notice>本章检测已提交，章节卡和综合进度已经更新。</Notice> : null}
      {query.error ? <Notice tone="error">这次操作没有成功，稍后再试一次。</Notice> : null}

      <CheckHero
        score={current.check.score}
        delta={current.check.delta}
        doneChapters={current.check.doneChapters}
        totalChapters={current.check.totalChapters}
      />

      <SectionCard title="选择章节" description="章节可以自由选择，不必按顺序完成。未检测章节不会被当作 0 分。">
        <div id="chapter-grid" className="grid grid-cols-3 gap-2 md:hidden">
          {current.chapters.map((chapter) => (
            <MobileChapterTile key={chapter.chapterId} chapter={chapter} />
          ))}
        </div>
        <div className="hidden gap-3 md:grid md:grid-cols-3">
          {current.chapters.map((chapter) => (
            <ChapterCard key={chapter.chapterId} chapter={chapter} />
          ))}
        </div>
      </SectionCard>

      <TrendPreview points={trends.overall} />
    </AppShell>
  );
}
