"use client";

import { useEffect, useMemo, useState } from "react";

import { PrimaryButton } from "@/components/primary-button";

import { buildTodayShareCardQuery } from "./today-share-card.mjs";
import { buildTodaySharePayload, formatTodayShareText } from "./today-share.mjs";

type TodayShareTask = {
  taskDate: string;
  topicTitle: string;
  weakness?: string;
  improvementPlan?: string;
  verificationPath?: string;
};

type TodaySharePanelProps = {
  task: TodayShareTask;
};

const COPY = {
  loadImageError: "\u5206\u4eab\u56fe\u7247\u52a0\u8f7d\u5931\u8d25",
  renderNotSupported: "\u5f53\u524d\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u56fe\u7247\u5bfc\u51fa",
  renderImageError: "\u5206\u4eab\u56fe\u7247\u751f\u6210\u5931\u8d25",
  fetchImageError: "\u5206\u4eab\u5361\u7247\u83b7\u53d6\u5931\u8d25",
  copyDone: "\u5206\u4eab\u6587\u6848\u5df2\u590d\u5236\uff0c\u53ef\u4ee5\u76f4\u63a5\u53d1\u5230\u7fa4\u91cc\u3002",
  copyFail: "\u8fd9\u6b21\u6ca1\u590d\u5236\u6210\u529f\uff0c\u8bf7\u518d\u70b9\u4e00\u6b21\u8bd5\u8bd5\u3002",
  imageDone: "\u5206\u4eab\u56fe\u7247\u5df2\u5f00\u59cb\u4e0b\u8f7d\u3002",
  imageFail: "\u8fd9\u6b21\u6ca1\u751f\u6210\u6210\u529f\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002",
  badge: "\u63d0\u4ea4\u540e\u5206\u4eab",
  heading: "\u5206\u4eab\u4eca\u65e5\u610f\u8bc6\u63d0\u5347\u70b9",
  intro: "",
  panelIntro: "\u590d\u5236\u6587\u6848\u6216\u5bfc\u51fa\u56fe\u7247\u540e\u5c31\u53ef\u4ee5\u76f4\u63a5\u5206\u4eab\uff0c\u9700\u8981\u65f6\u518d\u5c55\u5f00\u6587\u6848\u5185\u5bb9\u5373\u53ef\u3002",
  previewToggleLabel: "\u70b9\u51fb\u67e5\u770b\u5206\u4eab\u6587\u6848\u5185\u5bb9",
  copyLoading: "\u6b63\u5728\u590d\u5236\u5206\u4eab\u6587\u6848\u2026",
  copyIdle: "\u590d\u5236\u5206\u4eab\u6587\u6848",
  imageLoading: "\u6b63\u5728\u751f\u6210\u5206\u4eab\u56fe\u7247\u2026",
  imageIdle: "\u751f\u6210\u5206\u4eab\u56fe\u7247",
};

function decodeEscaped(value: string) {
  return JSON.parse(`"${value}"`);
}

function copyOf(key: keyof typeof COPY) {
  return decodeEscaped(COPY[key]);
}

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

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(copyOf("loadImageError")));
    image.src = url;
  });
}

function renderSvgToPng(svgText: string) {
  return new Promise<Blob>((resolve, reject) => {
    const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    loadImage(svgUrl)
      .then((image) => {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1350;
        const context = canvas.getContext("2d");

        if (!context) {
          URL.revokeObjectURL(svgUrl);
          reject(new Error(copyOf("renderNotSupported")));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(svgUrl);

          if (!blob) {
            reject(new Error(copyOf("renderImageError")));
            return;
          }

          resolve(blob);
        }, "image/png", 1);
      })
      .catch((error) => {
        URL.revokeObjectURL(svgUrl);
        reject(error);
      });
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

function CopyButtonIcon() {
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/16 text-white/95">
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.8">
        <rect x="7" y="5.5" width="8" height="9" rx="2" />
        <path d="M5.5 12V7.5A2.5 2.5 0 0 1 8 5h4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function ImageButtonIcon() {
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[rgba(35,133,117,0.1)] text-[var(--primary)]">
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="4.5" width="13" height="11" rx="2" />
        <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
        <path d="m6.5 13 2.4-2.5a1 1 0 0 1 1.46.03L12 12l1.2-1.2a1 1 0 0 1 1.41 0L16 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function TodaySharePanel({ task }: TodaySharePanelProps) {
  const payload = useMemo(
    () => buildTodaySharePayload(task),
    [task],
  );
  const [feedback, setFeedback] = useState("");
  const [pendingAction, setPendingAction] = useState<"copy" | "image" | null>(null);

  const shareText = useMemo(() => formatTodayShareText(payload), [payload]);
  const shareQuery = useMemo(() => buildTodayShareCardQuery(payload), [payload]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setFeedback("");
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [feedback]);

  async function handleCopy() {
    try {
      setPendingAction("copy");
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        fallbackCopy(shareText);
      }
      setFeedback(copyOf("copyDone"));
    } catch {
      setFeedback(copyOf("copyFail"));
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDownloadImage() {
    try {
      setPendingAction("image");
      const response = await fetch(`/today/share-card?${shareQuery}`, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(copyOf("fetchImageError"));
      }

      const svgText = await response.text();
      const pngBlob = await renderSvgToPng(svgText);
      const fileName = `today-share-${task.taskDate || "today"}.png`;
      downloadBlob(pngBlob, fileName);
      setFeedback(copyOf("imageDone"));
    } catch {
      setFeedback(copyOf("imageFail"));
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-[linear-gradient(180deg,rgba(245,250,247,0.96)_0%,rgba(255,255,255,0.98)_48%,rgba(243,248,245,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.94)]">
      <div className="border-b border-[rgba(205,219,212,0.72)] bg-[radial-gradient(circle_at_top_left,rgba(35,133,117,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,250,248,0.9)_100%)] px-4 py-4 md:px-6 md:py-5">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-[rgba(41,122,106,0.18)] bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[var(--primary)] shadow-[0_6px_16px_rgba(19,111,99,0.08)]">
            {copyOf("badge")}
          </span>
          <div>
            <h3 className="text-[18px] font-semibold tracking-[0.01em] text-[var(--foreground)] md:text-[20px]">{copyOf("heading")}</h3>
            <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
              {copyOf("intro")}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 md:px-6 md:py-6">
        <div className="rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,248,0.94)_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] md:p-5">
          <p className="text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
            {copyOf("panelIntro")}
          </p>

          <div className="mt-4 flex items-center gap-2.5">
            <PrimaryButton
              block={false}
              className="min-h-[38px] min-w-0 flex-1 rounded-[16px] px-3 text-[12px] tracking-[-0.01em] md:min-h-[40px] md:px-3.5 md:text-[13px]"
              onClick={handleCopy}
              disabled={pendingAction !== null}
            >
              <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                <CopyButtonIcon />
                <span>{pendingAction === "copy" ? copyOf("copyLoading") : copyOf("copyIdle")}</span>
              </span>
            </PrimaryButton>
            <PrimaryButton
              variant="secondary"
              block={false}
              className="min-h-[38px] min-w-0 flex-1 rounded-[16px] px-3 text-[12px] tracking-[-0.01em] md:min-h-[40px] md:px-3.5 md:text-[13px]"
              onClick={handleDownloadImage}
              disabled={pendingAction !== null}
            >
              <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                <ImageButtonIcon />
                <span>{pendingAction === "image" ? copyOf("imageLoading") : copyOf("imageIdle")}</span>
              </span>
            </PrimaryButton>
          </div>

          <details className="group mt-4 border-t border-[rgba(216,226,221,0.9)] pt-4">
            <summary className="cursor-pointer list-none text-[13px] font-semibold tracking-[0.02em] text-[var(--foreground)] marker:hidden">
              <span>{copyOf("previewToggleLabel")}</span>
            </summary>
            <pre className="mt-4 whitespace-pre-wrap break-words rounded-[18px] bg-[linear-gradient(180deg,rgba(243,248,245,0.92)_0%,rgba(255,255,255,0.98)_100%)] px-4 py-4 text-[13px] leading-7 text-[var(--foreground)] md:text-[14px]">{shareText}</pre>
          </details>

          {feedback ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-6 -translate-y-16 sm:-translate-y-20 pointer-events-none">
              <p className="rounded-full border border-[rgba(41,122,106,0.14)] bg-[rgba(22,31,27,0.92)] px-4 py-2 text-[12px] font-medium leading-5 text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] backdrop-blur-sm">
                {feedback}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}








