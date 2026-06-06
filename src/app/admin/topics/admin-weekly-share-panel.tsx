"use client";

import { useEffect, useMemo, useState } from "react";

import { buildAdminWeeklySharePayload, formatAdminWeeklyShareText } from "./admin-weekly-share.mjs";

type AdminWeeklyShareDay = {
  date: string;
  weekdayLabel?: string;
  title?: string;
  summary?: string;
  topic?: {
    title: string;
    summary?: string;
    orderNo?: number;
    progressNo?: number;
    isRestDay?: boolean;
    isPausedDay?: boolean;
  } | null;
  rest?: boolean;
  missing?: boolean;
  isRestDay?: boolean;
  isPausedDay?: boolean;
  progressNo?: number;
};

type AdminWeeklySharePanelProps = {
  weekStart: string;
  weekDays: AdminWeeklyShareDay[];
};

function fallbackCopy(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      <rect x="7" y="5.5" width="8" height="9" rx="2" />
      <path d="M5.5 12V7.5A2.5 2.5 0 0 1 8 5h4" strokeLinecap="round" />
    </svg>
  );
}

export function AdminWeeklySharePanel({ weekStart, weekDays }: AdminWeeklySharePanelProps) {
  const payload = useMemo(
    () => buildAdminWeeklySharePayload({ weekStart, weekDays }),
    [weekStart, weekDays],
  );
  const shareText = useMemo(() => formatAdminWeeklyShareText(payload), [payload]);
  const [feedback, setFeedback] = useState("");
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timer = window.setTimeout(() => setFeedback(""), 2000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  async function handleCopy() {
    try {
      setIsCopying(true);
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        fallbackCopy(shareText);
      }
      setFeedback("本周复盘文案已复制。");
    } catch {
      setFeedback("复制失败，请展开文案手动复制。");
    } finally {
      setIsCopying(false);
    }
  }

  return (
    <div className="mt-4 rounded-[14px] border border-cyan-900/10 bg-cyan-50/70 p-4 text-sm text-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-950">分享本周意识强度复盘</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">{payload.weekStart} ～ {payload.weekEnd}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={isCopying}
          className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-cyan-800 px-4 py-2 font-medium text-white transition hover:bg-cyan-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CopyIcon />
          <span>{isCopying ? "复制中" : "复制本周复盘"}</span>
        </button>
      </div>

      <details className="mt-3 border-t border-cyan-900/10 pt-3">
        <summary className="cursor-pointer list-none text-xs font-medium text-cyan-900 marker:hidden">查看分享文案</summary>
        <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-[12px] border border-cyan-900/10 bg-white p-3 text-xs leading-6 text-slate-700">{shareText}</pre>
      </details>

      {feedback ? (
        <p className="mt-3 rounded-[10px] border border-cyan-900/10 bg-white px-3 py-2 text-xs text-cyan-900" role="status">
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
