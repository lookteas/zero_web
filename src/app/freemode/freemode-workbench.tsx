"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from "react";

import { PrimaryButton } from "@/components/primary-button";
import type { FreeModeChapter, FreeModePractice } from "@/lib/api";

import { createFreemodePracticeAction, updateFreemodePracticeAction } from "./actions";
import { buildAwarenessDetailSections } from "../today/today-detail-reader.mjs";

type FreemodeWorkbenchProps = {
  chapters: FreeModeChapter[];
  recentPractices: FreeModePractice[];
  showRecentOnMobile?: boolean;
  recentFeedback?: "created" | "updated";
  focusedPracticeId?: number;
};

const chapterGuides: Record<number, string> = {
  1: "识别自动反应",
  2: "拆解今日行动",
  3: "稳定内在连接",
  4: "换一个观察角度",
  5: "处理旧情绪回路",
  6: "记录身体反馈",
  7: "表达与回应",
  8: "整理内在结构",
  9: "观察关系镜像",
};

const INITIAL_RECENT_VISIBLE_COUNT = 3;
const RECENT_PRACTICE_LIMIT = 7;

function getChapterIllustration(chapterNo: number) {
  return `/freemode-chapters/chapter-${String(chapterNo).padStart(2, "0")}.png`;
}

function Panel({ children, className = "", id, panelRef }: { children: ReactNode; className?: string; id?: string; panelRef?: Ref<HTMLElement> }) {
  return (
    <section
      id={id}
      ref={panelRef}
      className={[
        "rounded-[26px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.98)_100%)] shadow-[var(--shadow-card)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function PracticeRow({ practice, onSelect }: { practice: FreeModePractice; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="grid min-h-[58px] cursor-pointer grid-cols-[86px_minmax(0,1fr)] items-center gap-3 rounded-[16px] border border-[var(--border-soft)] bg-white/94 px-3 py-3 text-left transition hover:border-[rgba(19,111,99,0.18)] hover:bg-white md:grid-cols-[112px_minmax(0,1fr)]"
    >
      <span className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">{practice.practiceDate}</span>
      <strong className="min-w-0 truncate text-[15px] font-semibold text-[var(--foreground)]">{practice.awarenessTitle}</strong>
    </button>
  );
}

function AwarenessDetailReader({ summary, details }: { summary: string; details: string }) {
  const sections = buildAwarenessDetailSections({ summary, details });
  const hasMore = sections.more.length > 0;

  return (
    <div className="space-y-4">
      <section className="space-y-3">
        <p className="text-[13px] font-semibold text-[var(--primary)]/80 md:text-[14px]">意识点摘要</p>
        <div className="rounded-[18px] bg-[rgba(238,248,247,0.72)] px-4 py-4 md:rounded-[20px] md:border md:border-[rgba(19,111,99,0.12)]">
          <div className="space-y-3 md:border-l-2 md:border-[rgba(19,111,99,0.18)] md:pl-3">
            <p className="summary-highlight text-[16px] font-semibold leading-8 text-[var(--foreground)] md:text-[17px] md:leading-8">
              {summary}
            </p>
            {sections.lead.map((paragraph, index) => (
              <p key={`lead-${index}-${paragraph}`} className="summary-supporting text-[14px] leading-7 text-[var(--foreground-soft)] md:text-[15px] md:leading-8">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {sections.groups.length > 0 ? (
        <section>
          <p className="text-[13px] font-semibold text-[var(--primary)]/80 md:text-[14px]">分段理解</p>
          <div className="mt-3 grid gap-3">
            {sections.groups.map((group, index) => (
              <article
                key={`${group.title}-${index}`}
                className="border-t border-[rgba(210,221,215,0.72)] pt-4 first:border-t-0 first:pt-0 md:rounded-[20px] md:border md:border-[rgba(210,221,215,0.86)] md:bg-white/90 md:px-4 md:py-4 md:shadow-[0_8px_18px_rgba(15,48,60,0.03)]"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(19,111,99,0.14)] bg-[var(--surface-soft)] text-[12px] font-semibold text-[var(--primary)]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14px] font-semibold leading-6 text-[var(--foreground)]">{group.title}</h3>
                    {group.body.length > 0 ? (
                      <div className="mt-2 space-y-2 text-[13px] leading-7 text-[var(--foreground-soft)] md:text-sm md:leading-7">
                        {group.body.map((paragraph, bodyIndex) => (
                          <p key={`group-${index}-${bodyIndex}-${paragraph}`}>{paragraph}</p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {hasMore ? (
        <details className="group border-t border-[rgba(210,221,215,0.72)] pt-4 md:rounded-[20px] md:border md:border-[rgba(210,221,215,0.86)] md:bg-white/82 md:px-4 md:py-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-medium text-[var(--foreground)] marker:hidden">
            <span>延伸说明</span>
            <span className="inline-flex min-h-9 items-center rounded-full border border-[var(--border-soft)] bg-white/90 px-3 text-[12px] text-[var(--foreground-soft)] transition group-open:border-[var(--border-strong)] group-open:text-[var(--foreground)]">
              <span className="group-open:hidden">展开完整说明</span>
              <span className="hidden group-open:inline">收起完整说明</span>
            </span>
          </summary>
          <div className="mt-3 space-y-2.5 text-[13px] leading-7 text-[var(--foreground-soft)] md:text-sm md:leading-7">
            {sections.more.map((paragraph, index) => (
              <p key={`more-${index}-${paragraph}`}>{paragraph}</p>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function PracticeReference({ practice }: { practice: FreeModePractice }) {
  return (
    <details className="group rounded-[18px] border border-[var(--border-soft)] bg-[rgba(247,251,249,0.78)] px-4 py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold text-[var(--foreground)] marker:hidden">
        <span>练习点参考</span>
        <span className="inline-flex min-h-9 items-center rounded-full border border-[var(--border-soft)] bg-white px-3 text-[12px] font-medium text-[var(--foreground-soft)]">
          <span className="group-open:hidden">查看</span>
          <span className="hidden group-open:inline">收起</span>
        </span>
      </summary>
      <div className="mt-4 space-y-3">
        <div>
          <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">意识强度点</p>
          <h4 className="mt-2 text-[18px] font-semibold leading-7 text-[var(--foreground)]">{practice.awarenessTitle}</h4>
          <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)]">{practice.awarenessSummary || "这条意识点暂无摘要。"}</p>
        </div>
        <details className="group/detail border-t border-[var(--border-soft)] pt-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-semibold text-[var(--foreground)] marker:hidden">
            <span>查看意识点详情</span>
            <span className="inline-flex min-h-8 items-center rounded-full border border-[var(--border-soft)] bg-white px-3 text-[12px] font-medium text-[var(--foreground-soft)]">
              <span className="group-open/detail:hidden">展开</span>
              <span className="hidden group-open/detail:inline">收起</span>
            </span>
          </summary>
          <div className="mt-3">
            <AwarenessDetailReader summary={practice.awarenessSummary || "这条意识点暂无摘要。"} details={practice.awarenessDetails || ""} />
          </div>
        </details>
      </div>
    </details>
  );
}

function PracticeDetailDialog({ practice, onClose }: { practice: FreeModePractice; onClose: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftNote, setDraftNote] = useState(practice.practiceNote || "");
  const canSave = draftNote.trim().length >= 8;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(12,30,34,0.34)] px-3 py-4 md:items-center md:px-6" role="presentation">
      <button type="button" aria-label="关闭详情背景" className="absolute inset-0 cursor-default" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`practice-detail-title-${practice.practiceId}`}
        className="relative max-h-[min(88vh,780px)] w-full max-w-[680px] overflow-y-auto rounded-[24px] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.98)] px-4 py-4 shadow-[0_24px_68px_rgba(15,48,60,0.20)] md:px-6 md:py-5"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border-soft)] pb-4">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-[var(--primary)]/75">练习详情</p>
            <h3 id={`practice-detail-title-${practice.practiceId}`} className="mt-2 text-[20px] font-semibold leading-7 text-[var(--foreground)]">
              {practice.awarenessTitle}
            </h3>
            <p className="mt-1 text-[13px] leading-6 text-[var(--foreground-soft)]">
              {practice.practiceDate} · 第 {practice.chapterNo} 章 · {practice.chapterTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-[var(--border-soft)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--foreground)]"
          >
            关闭弹窗
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <section className="rounded-[18px] border border-[var(--border-soft)] bg-white/90 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-[16px] font-semibold text-[var(--foreground)]">我的觉察</h4>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex min-h-9 items-center rounded-full border border-[var(--border-soft)] bg-white px-3 text-[12px] font-semibold text-[var(--foreground)]"
                >
                  继续编辑
                </button>
              ) : null}
            </div>

            {isEditing ? (
              <form action={updateFreemodePracticeAction} className="mt-3 space-y-3">
                <input type="hidden" name="practiceId" value={practice.practiceId} />
                <textarea
                  name="practiceNote"
                  className="app-input min-h-[150px] px-4 py-3 text-sm leading-7"
                  value={draftNote}
                  onChange={(event) => setDraftNote(event.target.value)}
                />
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <PrimaryButton type="submit" disabled={!canSave}>
                    保存修改
                  </PrimaryButton>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setDraftNote(practice.practiceNote || "");
                    }}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[var(--border-soft)] bg-white px-5 text-[14px] font-semibold text-[var(--foreground)]"
                  >
                    取消
                  </button>
                </div>
                <p className={["text-[13px] leading-6", canSave ? "text-[var(--success-text)]" : "text-[var(--foreground-soft)]"].join(" ")}>
                  {canSave ? "可以保存修改了。" : "至少保留一句具体觉察，方便之后回看。"}
                </p>
              </form>
            ) : (
              <p className="mt-3 whitespace-pre-wrap text-[14px] leading-7 text-[var(--foreground-soft)]">
                {practice.practiceNote || "这次没有额外备注。"}
              </p>
            )}
          </section>

          <PracticeReference practice={practice} />
        </div>
      </section>
    </div>
  );
}

export function FreemodeWorkbench({ chapters, recentPractices, showRecentOnMobile = false, recentFeedback, focusedPracticeId }: FreemodeWorkbenchProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [selectedAwarenessId, setSelectedAwarenessId] = useState<number | null>(null);
  const [selectionMode, setSelectionMode] = useState(true);
  const [practiceNote, setPracticeNote] = useState("");
  const [selectedPracticeId, setSelectedPracticeId] = useState<number | null>(focusedPracticeId ?? null);
  const [showAllRecentPractices, setShowAllRecentPractices] = useState(false);
  const detailPanelRef = useRef<HTMLElement | null>(null);
  const actionPanelRef = useRef<HTMLDivElement | null>(null);
  const practicePanelRef = useRef<HTMLElement | null>(null);

  const selectedChapter = useMemo(
    () => chapters.find((chapter) => chapter.chapterId === selectedChapterId),
    [chapters, selectedChapterId],
  );
  const currentPoint = selectedChapter?.points.find((point) => point.awarenessId === selectedAwarenessId);
  const selectedPractice = recentPractices.find((practice) => practice.practiceId === selectedPracticeId);
  const recentPracticeRows = recentPractices.slice(0, showAllRecentPractices ? RECENT_PRACTICE_LIMIT : INITIAL_RECENT_VISIBLE_COUNT);
  const canToggleRecentPractices = recentPractices.length > INITIAL_RECENT_VISIBLE_COUNT;
  const hasSelectedPoint = Boolean(selectedChapter && currentPoint);
  const canSavePractice = practiceNote.trim().length >= 8;

  useEffect(() => {
    if (!selectedChapter || !selectionMode || !detailPanelRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => {
      detailPanelRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }, [selectedChapter, selectionMode]);

  useEffect(() => {
    if (selectionMode || !hasSelectedPoint || !practicePanelRef.current) return;

    window.requestAnimationFrame(() => {
      practicePanelRef.current?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    });
  }, [hasSelectedPoint, selectionMode]);

  if (!chapters.length) {
    return (
      <section className="rounded-[24px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.98)_100%)] px-4 py-4 shadow-[var(--shadow-card)] md:px-6 md:py-6">
        <p className="text-sm text-[var(--foreground-soft)]">当前还没有可练的章节。</p>
      </section>
    );
  }

  function handleSelectChapter(chapterId: number) {
    setSelectedChapterId(chapterId);
    setSelectedAwarenessId(null);
    setSelectionMode(true);
    setPracticeNote("");
  }

  function scrollActionPanelIntoView() {
    window.setTimeout(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.requestAnimationFrame(() => {
        actionPanelRef.current?.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "center",
        });
      });
    }, 0);
  }

  function handleSelectPoint(awarenessId: number) {
    setSelectedAwarenessId(awarenessId);
    setSelectionMode(true);
    setPracticeNote("");
    scrollActionPanelIntoView();
  }

  return (
    <div className="space-y-4">
      {selectionMode ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 px-1 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--primary)]/75">自由模式</p>
              <h1 className="mt-2 text-[28px] font-semibold leading-tight text-[var(--foreground)] md:text-[40px]">选择今天的练习区域</h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
                自由模式完全独立，不会计入每天的打卡。先选一个区域，再进入具体点位。
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-[var(--border-soft)] bg-white/86 px-3 py-1.5 text-[12px] font-medium text-[var(--foreground-soft)]">
              {hasSelectedPoint
                ? `第 ${selectedChapter?.chapterNo} 章 · ${currentPoint?.orderNo} 点`
                : selectedChapter
                  ? `已选择第 ${selectedChapter.chapterNo} 章`
                  : "请选择章节"}
            </span>
          </div>

          <Panel>
            <div className="flex items-end justify-between gap-3 border-b border-[var(--border-soft)] px-4 py-4 md:px-6">
              <div>
                <h2 className="text-[20px] font-semibold text-[var(--foreground)] md:text-[28px]">练习区域</h2>
                <p className="mt-1 text-[13px] leading-6 text-[var(--foreground-soft)]">点一下今天想靠近的方向</p>
              </div>
              <span className="shrink-0 rounded-full border border-[var(--border-soft)] bg-white/86 px-3 py-1.5 text-[12px] text-[var(--foreground-soft)]">
                {chapters.length} 区
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2 md:gap-3 md:p-5">
              {chapters.map((chapter) => {
                const isActive = chapter.chapterId === selectedChapterId;

                return (
                  <button
                    key={chapter.chapterId}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleSelectChapter(chapter.chapterId)}
                    className={[
                      "group relative grid aspect-[1.02] min-h-[96px] cursor-pointer grid-cols-[minmax(0,1fr)_42%] overflow-hidden rounded-[16px] border text-left transition md:aspect-auto md:min-h-[148px] md:rounded-[18px]",
                      isActive
                        ? "border-[rgba(19,111,99,0.34)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(232,247,243,0.88)_100%)] shadow-[inset_0_0_0_1px_rgba(19,111,99,0.08)]"
                        : "border-[var(--border-soft)] bg-white/94 hover:border-[rgba(19,111,99,0.18)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.05)]",
                    ].join(" ")}
                  >
                    {isActive ? (
                      <span className="absolute right-3 top-3 rounded-full bg-[rgba(19,111,99,0.10)] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary)]">
                        已选
                      </span>
                    ) : null}
                    <span className="relative z-[1] flex min-w-0 flex-col justify-center px-2.5 py-3 md:px-4">
                      <span className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">
                        {String(chapter.chapterNo).padStart(2, "0")}
                      </span>
                      <strong className="mt-1.5 block text-[14px] leading-5 text-[var(--foreground)] md:mt-2 md:text-[16px]">{chapter.chapterTitle}</strong>
                      <small className="mt-1.5 block text-[11px] leading-4 text-[var(--foreground-soft)] md:mt-2 md:text-[12px] md:leading-5">
                        {chapterGuides[chapter.chapterNo] || `${chapter.points.length} 个意识点`}
                      </small>
                    </span>
                    <span className="relative min-h-0 overflow-hidden bg-[linear-gradient(135deg,rgba(235,249,248,0.92),rgba(255,255,255,0.56))]">
                      <Image
                        src={getChapterIllustration(chapter.chapterNo)}
                        alt={`${chapter.chapterTitle}章节图`}
                        fill
                        sizes="(max-width: 768px) 28vw, 16vw"
                        className="object-cover object-center transition duration-200 group-hover:scale-[1.03]"
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </Panel>

          {selectedChapter ? (
            <Panel id="detail-panel" panelRef={detailPanelRef}>
              <div className="flex items-end justify-between gap-3 border-b border-[var(--border-soft)] px-4 py-4 md:px-6">
                <div>
                  <h2 className="text-[22px] font-semibold text-[var(--foreground)] md:text-[28px]">
                    第 {selectedChapter.chapterNo} 章 · {selectedChapter.chapterTitle}
                  </h2>
                  <p className="mt-1 text-[13px] leading-6 text-[var(--foreground-soft)]">
                    {selectedChapter.chapterFullTitle || "选一个具体意识点进入练习"}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-[var(--border-soft)] bg-white/86 px-3 py-1.5 text-[12px] text-[var(--foreground-soft)]">
                  {selectedChapter.points.length} 个点位
                </span>
              </div>

              <div className="grid grid-cols-2 max-h-[360px] gap-2 overflow-y-auto p-3 md:gap-3 md:p-5">
                {selectedChapter.points.map((point) => {
                  const active = point.awarenessId === selectedAwarenessId;

                  return (
                    <button
                      key={point.awarenessId}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleSelectPoint(point.awarenessId)}
                      className={[
                        "cursor-pointer rounded-[16px] border px-3 py-3 text-left transition md:px-4",
                        active
                          ? "border-[rgba(69,139,183,0.32)] bg-[rgba(229,244,250,0.86)]"
                          : "border-[var(--border-soft)] bg-white/94 hover:border-[rgba(69,139,183,0.18)]",
                      ].join(" ")}
                    >
                      <span className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">点 {point.orderNo}</span>
                      <strong className="mt-1.5 block text-[14px] leading-6 text-[var(--foreground)] md:text-[15px]">{point.title}</strong>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[var(--foreground-soft)]">
                        {point.summary || point.details || "这个点暂时没有补充说明。"}
                      </p>
                    </button>
                  );
                })}
              </div>

              {hasSelectedPoint ? (
                <div
                  ref={actionPanelRef}
                  className="mx-3 mb-3 grid gap-3 rounded-[18px] border border-[rgba(19,111,99,0.20)] bg-[rgba(232,247,243,0.72)] px-4 py-4 md:mx-5 md:mb-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                >
                  <div>
                    <strong className="block text-[15px] leading-6 text-[var(--foreground)]">
                      已选择 {currentPoint?.orderNo} 点 · {currentPoint?.title}
                    </strong>
                    <p className="mt-1 text-[13px] leading-6 text-[var(--foreground-soft)]">
                      {currentPoint?.summary || "进入后阅读说明，并记录一次具体觉察。"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectionMode(false)}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[var(--primary)] px-5 text-[14px] font-semibold text-white shadow-[0_12px_24px_rgba(19,111,99,0.18)]"
                  >
                    进入练习
                  </button>
                </div>
              ) : null}
            </Panel>
          ) : null}
        </div>
      ) : (
        <Panel className="mx-auto max-w-[880px] px-4 py-5 md:px-7 md:py-7" panelRef={practicePanelRef}>
          {selectedChapter && currentPoint ? (
            <>
              <p className="text-[14px] font-semibold text-[var(--primary)]">
                第 {selectedChapter.chapterNo} 章 · {currentPoint.orderNo} 点
              </p>
              <h1 className="mt-2 text-[28px] font-semibold leading-tight text-[var(--foreground)] md:text-[42px]">{selectedChapter.chapterTitle}</h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-[10px] border border-[var(--border-soft)] bg-white/86 px-2.5 py-1 text-[12px] text-[var(--foreground-soft)]">
                  状态 <strong className="ml-1 text-[var(--foreground)]">待填写</strong>
                </span>
                {currentPoint.referenceMin && currentPoint.referenceMax ? (
                  <span className="rounded-[10px] border border-[var(--border-soft)] bg-white/86 px-2.5 py-1 text-[12px] text-[var(--foreground-soft)]">
                    参考范围 <strong className="ml-1 text-[var(--foreground)]">{currentPoint.referenceMin}% - {currentPoint.referenceMax}%</strong>
                  </span>
                ) : null}
              </div>

              <section className="mt-5 rounded-[22px] border border-[var(--border-soft)] bg-white/84 px-4 py-4">
                <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">本次练习点</p>
                <h2 className="mt-2 text-[22px] font-semibold leading-8 text-[var(--foreground)] md:text-[28px]">
                  {currentPoint.title}
                </h2>
                <p className="mt-3 text-[14px] leading-7 text-[var(--foreground-soft)] md:text-[15px]">
                  {currentPoint.summary || "这条意识点暂无摘要。"}
                </p>
              </section>

              {/* 移动端先收起详情，避免练习页被长说明淹没。 */}
              <details className="group mt-5 rounded-[20px] border border-[var(--border-soft)] bg-white/88 px-4 py-3 md:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold text-[var(--foreground)] marker:hidden">
                  <span>查看意识点详情</span>
                  <span className="inline-flex min-h-9 items-center rounded-full border border-[var(--border-soft)] bg-white px-3 text-[12px] font-medium text-[var(--foreground-soft)]">
                    <span className="group-open:hidden">展开</span>
                    <span className="hidden group-open:inline">收起</span>
                  </span>
                </summary>
                <div className="mt-4">
                  <AwarenessDetailReader summary={currentPoint.summary || "这条意识点暂无摘要。"} details={currentPoint.details || ""} />
                </div>
              </details>

              <section className="mt-5 hidden md:block md:rounded-[24px] md:border md:border-[rgba(210,221,215,0.86)] md:bg-white/92 md:p-5 md:shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
                <AwarenessDetailReader summary={currentPoint.summary || "这条意识点暂无摘要。"} details={currentPoint.details || ""} />
              </section>

              <section className="mt-5">
                <h2 className="text-[20px] font-semibold text-[var(--primary)]">写下你的觉察</h2>
                <form action={createFreemodePracticeAction} className="mt-3 space-y-4">
                  <input type="hidden" name="chapterId" value={selectedChapter.chapterId} />
                  <input type="hidden" name="awarenessId" value={currentPoint.awarenessId} />
                  <label className="block space-y-2">
                    <span className="block text-[13px] font-medium text-[var(--foreground)]">结合上面的摘要和详情，记录一个具体场景</span>
                    <textarea
                      name="practiceNote"
                      className="app-input min-h-[150px] px-4 py-3 text-sm leading-7"
                      placeholder="例如：我发现自己在对方没及时回复时会先判断被忽视，然后身体出现紧张感。"
                      value={practiceNote}
                      onChange={(event) => setPracticeNote(event.target.value)}
                    />
                  </label>
                  <PrimaryButton type="submit" disabled={practiceNote.trim().length < 8}>
                    保存本次觉察练习
                  </PrimaryButton>
                  <p className={["text-[13px] leading-6", canSavePractice ? "text-[var(--success-text)]" : "text-[var(--foreground-soft)]"].join(" ")}>
                    {canSavePractice ? "可以保存了。确认这是一次具体觉察后再提交。" : "保存前至少写下一句具体觉察。"}
                  </p>
                </form>
              </section>

              <div className="mt-6 flex justify-center border-t border-[var(--border-soft)] pt-5">
                <button
                  type="button"
                  onClick={() => setSelectionMode(true)}
                  className="inline-flex min-h-[42px] min-w-[min(100%,360px)] items-center justify-center rounded-full border border-[var(--border-soft)] bg-white px-5 text-[14px] font-semibold text-[var(--foreground)]"
                >
                  返回选择
                </button>
              </div>
            </>
          ) : null}
        </Panel>
      )}

      <section
        id="recent-practices"
        className={[selectionMode && !showRecentOnMobile ? "hidden md:block" : "block", "rounded-[24px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.98)_100%)] px-4 py-4 shadow-[var(--shadow-card)] scroll-mt-4 md:px-6 md:py-6"].join(" ")}
      >
        <div className="mb-4 space-y-2">
          <h2 className="text-[18px] font-semibold text-[var(--foreground)] md:text-[20px]">最近独立练习</h2>
          <p className="text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
            这些记录只属于自由模式，不会进入每天的打卡节奏。最近只展示最新 7 条。
          </p>
          {showRecentOnMobile ? (
            <p className="rounded-[14px] border border-[rgba(19,111,99,0.14)] bg-[rgba(232,247,243,0.72)] px-3 py-2 text-[13px] leading-6 text-[var(--success-text)]">
              {recentFeedback === "updated" ? "修改已保存，可以继续在这里回看这条记录。" : "刚刚保存成功，最新记录会显示在这里。"}
            </p>
          ) : null}
        </div>

        {recentPractices.length > 0 ? (
          <>
            <div className="grid gap-2">
              {recentPracticeRows.map((practice) => (
                <PracticeRow
                  key={practice.practiceId}
                  practice={practice}
                  onSelect={() => setSelectedPracticeId(practice.practiceId)}
                />
              ))}
            </div>
            {canToggleRecentPractices ? (
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllRecentPractices((value) => !value)}
                  className="inline-flex min-h-[40px] min-w-[132px] items-center justify-center rounded-full border border-[var(--border-soft)] bg-white px-4 text-[13px] font-semibold text-[var(--foreground)] transition hover:border-[rgba(19,111,99,0.18)]"
                >
                  {showAllRecentPractices ? "收起" : "查看更多"}
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-[var(--foreground-soft)]">你还没有保存过自由模式记录。</p>
        )}
      </section>

      {selectedPractice ? (
        <PracticeDetailDialog
          key={selectedPractice.practiceId}
          practice={selectedPractice}
          onClose={() => setSelectedPracticeId(null)}
        />
      ) : null}
    </div>
  );
}
