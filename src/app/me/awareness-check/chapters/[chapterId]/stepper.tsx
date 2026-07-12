"use client";

import { useState, useTransition } from "react";

import type { AwarenessCheckPoint } from "@/lib/api";

import { completeAwarenessCheckChapterAction, saveAwarenessCheckPointAction } from "../../actions";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function AwarenessCheckStepper({
  chapterId,
  points,
  isRetest,
}: {
  chapterId: number;
  points: AwarenessCheckPoint[];
  isRetest: boolean;
}) {
  const firstUnfinishedIndex = Math.max(points.findIndex((point) => !point.isSaved), 0);
  const [index, setIndex] = useState(firstUnfinishedIndex);
  const [scores, setScores] = useState(() => new Map(points.map((point) => [point.awarenessId, clampScore(point.selfScore)])));
  const [savedIds, setSavedIds] = useState(() => new Set(isRetest ? [] : points.filter((point) => point.isSaved).map((point) => point.awarenessId)));
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const point = points[index];
  const selfScore = scores.get(point.awarenessId) ?? 50;
  const isLastPoint = index === points.length - 1;
  const savedCount = savedIds.size;

  function setScore(value: number) {
    setScores((current) => new Map(current).set(point.awarenessId, clampScore(value)));
  }

  function continueToNextPoint() {
    startTransition(async () => {
      setError(false);
      const result = await saveAwarenessCheckPointAction(chapterId, point.awarenessId, selfScore);
      if (!result.ok) {
        setError(true);
        return;
      }

      setSavedIds((current) => new Set(current).add(point.awarenessId));
      if (isLastPoint) {
        const completed = await completeAwarenessCheckChapterAction(chapterId);
        if (!completed.ok) {
          setError(true);
          return;
        }
        window.location.assign(`/me/awareness-check/chapters/${chapterId}?submitted=1`);
        return;
      }
      setShowDetails(false);
      setError(false);
      setIndex((current) => current + 1);
    });
  }

  function exitAndKeepProgress() {
    startTransition(async () => {
      setError(false);
      const result = await saveAwarenessCheckPointAction(chapterId, point.awarenessId, selfScore);
      if (!result.ok) {
        setError(true);
        return;
      }
      window.location.assign("/me/awareness-check");
    });
  }

  return (
    <section className="rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(239,249,246,0.94))] p-5 shadow-[var(--shadow-card)] md:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[13px] font-semibold text-[var(--foreground)]">本章进度</p>
          <p className="mt-1 text-[26px] font-semibold leading-none text-[var(--foreground)]">{index + 1} / {points.length}</p>
        </div>
        <span className="text-[13px] font-medium text-[var(--foreground-soft)]">已保存 {savedCount} 项</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(211,232,228,0.92)]">
        <span className="block h-full rounded-full bg-[var(--primary)] transition-[width] duration-200" style={{ width: `${((index + 1) / points.length) * 100}%` }} />
      </div>

      <article className="mt-6 rounded-[22px] border border-[var(--border-soft)] bg-white/90 p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">当前检测点</p>
            <h1 className="mt-2 text-[24px] font-semibold leading-8 text-[var(--foreground)] md:text-[30px]">{point.title}</h1>
          </div>
          <span className="shrink-0 rounded-[10px] border border-[#4477ce]/30 bg-[#4477ce]/10 px-2.5 py-1.5 text-[12px] font-semibold text-[#4477ce]">
            该点数值越{point.direction === "lower" ? "低" : "高"}越好
          </span>
        </div>

        {point.summary ? (
          <div className="mt-5 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3.5">
            <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">点位简介</p>
            <p className="mt-2 text-[14px] leading-7 text-[var(--foreground-soft)]">{point.summary}</p>
            {point.details ? (
              <>
                <button type="button" onClick={() => setShowDetails((current) => !current)} className="mt-3 cursor-pointer text-[13px] font-semibold text-[var(--primary)] underline underline-offset-4">
                  {showDetails ? "收起完整说明" : "查看完整说明"}
                </button>
                {showDetails ? <p className="mt-3 whitespace-pre-wrap border-t border-[var(--border-soft)] pt-3 text-[13px] leading-7 text-[var(--foreground-soft)]">{point.details}</p> : null}
              </>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 border-t border-[var(--border-soft)] pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-medium text-[var(--foreground-soft)]">我的当前自评</p>
              <strong className="mt-1 block text-[48px] font-semibold leading-none text-[var(--foreground)]">{selfScore}<span className="ml-1 text-[22px]">%</span></strong>
            </div>
            <p className="text-[13px] text-[var(--foreground-soft)]">人类平均参考 {Math.round(point.humanScore)}%</p>
          </div>
          <input type="range" min="0" max="100" step="1" value={selfScore} onChange={(event) => setScore(Number(event.target.value))} aria-label={`${point.title}自评`} className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full bg-[rgba(211,232,228,0.92)] accent-[var(--primary)]" />
          <div className="mt-2 flex justify-between text-[11px] text-[var(--foreground-faint)]"><span>低</span><span>偏低</span><span>中等</span><span>偏高</span><span>高</span></div>
        </div>
      </article>

      {error ? <p className="mt-4 rounded-[14px] border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">当前评分未保存，请检查网络后重试。</p> : null}

      <div className={`mt-5 grid gap-3 ${index > 0 ? "grid-cols-2" : ""}`}>
        {index > 0 ? <button type="button" disabled={isPending} onClick={() => { setShowDetails(false); setError(false); setIndex((current) => current - 1); }} className="inline-flex min-h-[46px] cursor-pointer items-center justify-center rounded-[14px] border border-[var(--border-soft)] bg-white px-5 text-[14px] font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-60">上一个</button> : null}
        <button type="button" disabled={isPending} onClick={continueToNextPoint} className="inline-flex min-h-[46px] cursor-pointer items-center justify-center rounded-[14px] bg-[oklch(84%_0.085_155)] px-5 text-[14px] font-semibold text-[oklch(31%_0.070_165)] shadow-[0_8px_18px_oklch(65%_0.080_155/.16)] transition hover:bg-[oklch(79%_0.090_155)] disabled:cursor-not-allowed disabled:opacity-60">{isPending ? "保存中" : isLastPoint ? "完成本章检测" : "继续"}</button>
      </div>
      <button type="button" disabled={isPending} onClick={exitAndKeepProgress} className="mt-3 inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center rounded-[14px] border border-[var(--border-soft)] bg-white px-5 text-[14px] font-semibold text-[var(--foreground-soft)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60">退出并保留进度</button>
      <p className="mt-4 text-center text-[12px] text-[var(--foreground-faint)]">可随时返回检测点进行调整</p>
    </section>
  );
}
