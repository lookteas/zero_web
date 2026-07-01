"use client";

import { useMemo, useState, type ReactNode } from "react";

import { PrimaryButton } from "@/components/primary-button";
import type { FreeModeChapter, FreeModePractice } from "@/lib/api";

import { createFreemodePracticeAction } from "./actions";

type FreemodeWorkbenchProps = {
  chapters: FreeModeChapter[];
  recentPractices: FreeModePractice[];
};

function Panel({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section
      id={id}
      className={[
        "rounded-[26px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.98)_100%)] shadow-[var(--shadow-card)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function PracticeCard({ practice }: { practice: FreeModePractice }) {
  return (
    <article className="rounded-[20px] border border-[var(--border-soft)] bg-white/95 px-4 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
      <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">{practice.practiceDate}</p>
      <h3 className="mt-2 text-[15px] font-semibold text-[var(--foreground)]">{practice.awarenessTitle}</h3>
      <p className="mt-1 text-[13px] leading-6 text-[var(--foreground-soft)]">
        第 {practice.chapterNo} 章 · {practice.chapterTitle}
      </p>
      <div className="mt-3 rounded-[14px] border border-[var(--border-soft)] bg-[rgba(247,251,249,0.76)] px-3 py-2.5">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--primary)]/70">练习方向</p>
        <p className="mt-1 text-[13px] leading-6 text-[var(--foreground-soft)]">{practice.awarenessSummary || "这条意识点暂无摘要。"}</p>
      </div>
      <p className="mt-3 text-[13px] leading-6 text-[var(--foreground-soft)]">{practice.practiceNote || "这次没有额外备注。"}</p>
    </article>
  );
}

export function FreemodeWorkbench({ chapters, recentPractices }: FreemodeWorkbenchProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [selectedAwarenessId, setSelectedAwarenessId] = useState<number | null>(null);
  const [selectionMode, setSelectionMode] = useState(true);
  const [practiceNote, setPracticeNote] = useState("");

  const selectedChapter = useMemo(
    () => chapters.find((chapter) => chapter.chapterId === selectedChapterId),
    [chapters, selectedChapterId],
  );
  const currentPoint = selectedChapter?.points.find((point) => point.awarenessId === selectedAwarenessId);
  const hasSelectedPoint = Boolean(selectedChapter && currentPoint);
  const canSavePractice = practiceNote.trim().length >= 8;

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

  function handleSelectPoint(awarenessId: number) {
    setSelectedAwarenessId(awarenessId);
    setSelectionMode(true);
    setPracticeNote("");
  }

  return (
    <div className="space-y-4">
      {selectionMode ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 px-1 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--primary)]/75">自由模式</p>
              <h1 className="mt-2 text-[28px] font-semibold leading-tight text-[var(--foreground)] md:text-[40px]">选择今天要练的章节和点位</h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
                自由模式完全独立，不会计入每天的打卡。可以按章节挑选，一天练习多个点。
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
                <h2 className="text-[22px] font-semibold text-[var(--foreground)] md:text-[28px]">九个章节</h2>
                <p className="mt-1 text-[13px] leading-6 text-[var(--foreground-soft)]">从 9 个区域中先选择一个章节</p>
              </div>
              <span className="shrink-0 rounded-full border border-[var(--border-soft)] bg-white/86 px-3 py-1.5 text-[12px] text-[var(--foreground-soft)]">
                {chapters.length} 区域
              </span>
            </div>

            <div className="grid gap-2 p-3 md:grid-cols-3 md:gap-3 md:p-5">
              {chapters.map((chapter) => {
                const isActive = chapter.chapterId === selectedChapterId;

                return (
                  <button
                    key={chapter.chapterId}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleSelectChapter(chapter.chapterId)}
                    className={[
                      "relative min-h-[96px] cursor-pointer rounded-[18px] border px-4 py-3 text-left transition md:min-h-[116px]",
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
                    <span className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">
                      {String(chapter.chapterNo).padStart(2, "0")}
                    </span>
                    <strong className="mt-2 block text-[15px] leading-5 text-[var(--foreground)] md:text-[16px]">{chapter.chapterTitle}</strong>
                    <small className="mt-2 block text-[12px] leading-5 text-[var(--foreground-soft)]">
                      {chapter.chapterFullTitle || `${chapter.points.length} 个意识点`}
                    </small>
                  </button>
                );
              })}
            </div>
          </Panel>

          {selectedChapter ? (
            <Panel id="detail-panel">
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

              <div className="grid max-h-[360px] gap-2 overflow-y-auto p-3 md:grid-cols-2 md:gap-3 md:p-5">
                {selectedChapter.points.map((point) => {
                  const active = point.awarenessId === selectedAwarenessId;

                  return (
                    <button
                      key={point.awarenessId}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleSelectPoint(point.awarenessId)}
                      className={[
                        "cursor-pointer rounded-[16px] border px-4 py-3 text-left transition",
                        active
                          ? "border-[rgba(69,139,183,0.32)] bg-[rgba(229,244,250,0.86)]"
                          : "border-[var(--border-soft)] bg-white/94 hover:border-[rgba(69,139,183,0.18)]",
                      ].join(" ")}
                    >
                      <span className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">点 {point.orderNo}</span>
                      <strong className="mt-1.5 block text-[14px] leading-6 text-[var(--foreground)]">{point.title}</strong>
                      <p className="mt-1 text-[12px] leading-5 text-[var(--foreground-soft)]">
                        {point.summary || point.details || "这个点暂时没有补充说明。"}
                      </p>
                    </button>
                  );
                })}
              </div>

              {hasSelectedPoint ? (
                <div className="mx-3 mb-3 grid gap-3 rounded-[18px] border border-[rgba(19,111,99,0.20)] bg-[rgba(232,247,243,0.72)] px-4 py-4 md:mx-5 md:mb-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
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
        <Panel className="mx-auto max-w-[880px] px-4 py-5 md:px-7 md:py-7">
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
                <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">今日问题</p>
                <h2 className="mt-2 text-[22px] font-semibold leading-8 text-[var(--foreground)] md:text-[28px]">
                  结合这个点，记录一个今天能看见的具体场景。
                </h2>
              </section>

              <section className="mt-5">
                <h2 className="text-[20px] font-semibold text-[var(--primary)]">意识点摘要</h2>
                <div className="mt-3 rounded-[22px] border border-[rgba(19,111,99,0.18)] bg-[rgba(232,247,243,0.56)] px-4 py-4 md:px-5 md:py-5">
                  <h3 className="text-[22px] font-semibold leading-8 text-[var(--foreground)] md:text-[28px]">{currentPoint.title}</h3>
                  <blockquote className="mt-3 border-l-4 border-[rgba(19,111,99,0.22)] pl-4 text-[18px] font-semibold leading-8 text-[var(--foreground)]">
                    {currentPoint.summary || "这条意识点暂无摘要。"}
                  </blockquote>
                  <p className="mt-3 text-[14px] leading-7 text-[var(--foreground-soft)]">
                    先读摘要，再用自己的经历对应一次具体场景。这里不追求写得完整，只需要把你观察到的变化写下来。
                  </p>
                </div>
              </section>

              {currentPoint.details ? (
                <section className="mt-5">
                  <h2 className="text-[20px] font-semibold text-[var(--primary)]">分段理解</h2>
                  <details className="mt-3 rounded-[20px] border border-[var(--border-soft)] bg-white/86 px-4 py-3">
                    <summary className="cursor-pointer text-[14px] font-medium text-[var(--foreground)]">查看完整说明</summary>
                    <p className="mt-3 max-h-[280px] overflow-y-auto whitespace-pre-wrap text-[13px] leading-7 text-[var(--foreground-soft)] md:max-h-[420px]">
                      {currentPoint.details}
                    </p>
                  </details>
                </section>
              ) : null}

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

      <section className="rounded-[24px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.98)_100%)] px-4 py-4 shadow-[var(--shadow-card)] md:px-6 md:py-6">
        <div className="mb-4 space-y-2">
          <h2 className="text-[18px] font-semibold text-[var(--foreground)] md:text-[20px]">最近独立练习</h2>
          <p className="text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
            这些记录只属于自由模式，不会进入每天的打卡节奏。
          </p>
        </div>

        {recentPractices.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {recentPractices.map((practice) => (
              <PracticeCard key={practice.practiceId} practice={practice} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground-soft)]">你还没有保存过自由模式记录。</p>
        )}
      </section>
    </div>
  );
}
