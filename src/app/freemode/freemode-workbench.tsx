"use client";

import { useMemo, useState, type ReactNode } from "react";

import { FormField } from "@/components/form-field";
import { PrimaryButton, PrimaryLinkButton } from "@/components/primary-button";
import { getFeedbackChrome } from "@/app/feedback-chrome.mjs";
import type { FreeModeChapter, FreeModePractice } from "@/lib/api";

import { createFreemodePracticeAction } from "./actions";

type FreemodeWorkbenchProps = {
  chapters: FreeModeChapter[];
  recentPractices: FreeModePractice[];
};

function ChapterChip({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  const chrome = getFeedbackChrome("secondaryButton");

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-h-[112px] w-[146px] shrink-0 cursor-pointer snap-start flex-col rounded-[18px] border px-3.5 py-3 text-left transition md:min-h-[154px] md:w-full md:rounded-[20px] md:px-4 md:py-4",
        active
          ? "border-[rgba(19,111,99,0.28)] bg-[linear-gradient(180deg,rgba(245,250,247,0.98)_0%,rgba(236,247,244,0.98)_100%)] shadow-[0_10px_22px_rgba(15,23,42,0.05)]"
          : chrome.className,
      ].join(" ")}
    >
      {children}
    </button>
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
  const firstChapterId = chapters[0]?.chapterId ?? 0;
  const [selectedChapterId, setSelectedChapterId] = useState(firstChapterId);
  const selectedChapter = useMemo(
    () => chapters.find((chapter) => chapter.chapterId === selectedChapterId) ?? chapters[0],
    [chapters, selectedChapterId],
  );
  const [selectedAwarenessId, setSelectedAwarenessId] = useState(selectedChapter?.points[0]?.awarenessId ?? 0);
  const [practiceNote, setPracticeNote] = useState("");

  const currentPoint = selectedChapter?.points.find((point) => point.awarenessId === selectedAwarenessId) ?? selectedChapter?.points[0];

  if (!chapters.length) {
    return (
      <section className="rounded-[24px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.98)_100%)] px-4 py-4 shadow-[var(--shadow-card)] md:px-6 md:py-6">
        <p className="text-sm text-[var(--foreground-soft)]">当前还没有可练的章节。</p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[22px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.98)_100%)] px-3.5 py-4 shadow-[var(--shadow-card)] md:rounded-[24px] md:px-6 md:py-6">
        <div className="mb-3 space-y-1.5 md:mb-4 md:space-y-2">
          <h2 className="text-[18px] font-semibold text-[var(--foreground)] md:text-[20px]">先选章节，再选意识点</h2>
          <p className="text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
            自由模式完全独立，不会计入每天一个点的打卡。你可以按章节挑，也可以一天练多个点。
          </p>
        </div>

        <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0 xl:grid-cols-4">
          {chapters.map((chapter) => {
            const isActive = chapter.chapterId === selectedChapterId;

            return (
              <ChapterChip
                key={chapter.chapterId}
                active={isActive}
                onClick={() => {
                  setSelectedChapterId(chapter.chapterId);
                  setSelectedAwarenessId(chapter.points[0]?.awarenessId ?? 0);
                }}
              >
                <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">第 {chapter.chapterNo} 章</p>
                <h3 className="mt-1.5 text-[14px] font-semibold leading-5 text-[var(--foreground)] md:mt-2 md:text-[15px]">{chapter.chapterTitle}</h3>
                <p className="mt-1 hidden text-[13px] leading-6 text-[var(--foreground-soft)] md:block">{chapter.chapterFullTitle}</p>
                <p className="mt-auto pt-3 text-[12px] text-[var(--foreground-faint)]">{chapter.points.length} 个意识点</p>
              </ChapterChip>
            );
          })}
        </div>
      </section>

      <section className="rounded-[22px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.98)_100%)] px-3.5 py-4 shadow-[var(--shadow-card)] md:rounded-[24px] md:px-6 md:py-6">
        <div className="mb-3 space-y-1.5 md:mb-4 md:space-y-2">
          <h2 className="text-[18px] font-semibold text-[var(--foreground)] md:text-[20px]">选一个意识点开始练</h2>
          <p className="text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
            先选这一章里你最想练的点，练完就直接留一条独立记录。
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <div className="grid max-h-[320px] gap-2 overflow-y-auto pr-1 md:max-h-none md:grid-cols-2 md:gap-3 md:overflow-visible md:pr-0">
              {(selectedChapter?.points ?? []).map((point) => {
                const active = point.awarenessId === selectedAwarenessId;

                return (
                  <button
                    key={point.awarenessId}
                    type="button"
                    onClick={() => setSelectedAwarenessId(point.awarenessId)}
                    className={[
                      "cursor-pointer rounded-[16px] border px-3.5 py-3 text-left transition md:rounded-[18px] md:px-4 md:py-4",
                      active
                        ? "border-[rgba(19,111,99,0.26)] bg-[linear-gradient(180deg,rgba(245,250,247,0.98)_0%,rgba(236,247,244,0.98)_100%)] shadow-[0_10px_20px_rgba(15,23,42,0.05)]"
                        : "border-[var(--border-soft)] bg-white/96 shadow-[0_8px_18px_rgba(15,23,42,0.035)] hover:border-[rgba(19,111,99,0.16)]",
                    ].join(" ")}
                  >
                    <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">点 {point.orderNo}</p>
                    <h3 className="mt-1.5 text-[14px] font-semibold leading-6 text-[var(--foreground)] md:mt-2">{point.title}</h3>
                    <p className="mt-1 max-h-[48px] overflow-hidden text-[12px] leading-6 text-[var(--foreground-soft)] md:max-h-none md:text-[13px]">
                      {point.summary || point.details || "这个点暂时没有补充说明。"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[20px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.98)_100%)] p-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] md:rounded-[22px] md:p-5">
            {currentPoint ? (
              <>
                <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]/75">
                  第 {selectedChapter?.chapterNo} 章 · {selectedChapter?.chapterTitle}
                </p>
                <h3 className="mt-2 text-[16px] font-semibold text-[var(--foreground)]">{currentPoint.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)]">{currentPoint.summary || "这条意识点暂无摘要。"}</p>
                {currentPoint.details ? (
                  <details className="group mt-3 rounded-[16px] border border-[var(--border-soft)] bg-white/86 px-3.5 py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-medium text-[var(--foreground)] marker:hidden">
                      <span>查看完整说明</span>
                      <span className="text-[12px] text-[var(--foreground-faint)] group-open:hidden">展开</span>
                      <span className="hidden text-[12px] text-[var(--foreground-faint)] group-open:inline">收起</span>
                    </summary>
                    <p className="mt-3 max-h-[280px] overflow-y-auto whitespace-pre-wrap text-[13px] leading-7 text-[var(--foreground-soft)] md:max-h-[420px]">
                      {currentPoint.details}
                    </p>
                  </details>
                ) : null}
                <p className="mt-3 text-[12px] text-[var(--foreground-faint)]">
                  {currentPoint.theme ? `${currentPoint.theme} · ` : ""}
                  {currentPoint.referenceMin && currentPoint.referenceMax
                    ? `参考范围 ${currentPoint.referenceMin}% - ${currentPoint.referenceMax}%`
                    : "这里会保存你这次独立练习的记录。"}
                </p>

                <form action={createFreemodePracticeAction} className="mt-4 space-y-4">
                  <input type="hidden" name="chapterId" value={selectedChapter?.chapterId ?? 0} />
                  <input type="hidden" name="awarenessId" value={currentPoint.awarenessId} />
                  <FormField
                    as="textarea"
                    name="practiceNote"
                    label="这次练习想记住什么"
                    hint="写一句就够，重点是把这次单独练习留下来。"
                    placeholder="例如：先把冲动看见，再决定要不要跟着走。"
                    value={practiceNote}
                    onChange={(event) => setPracticeNote(event.target.value)}
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <PrimaryButton type="submit">开始这次练习</PrimaryButton>
                    <PrimaryLinkButton href="/today" variant="secondary">
                      回到今日打卡
                    </PrimaryLinkButton>
                  </div>
                </form>
              </>
            ) : (
              <p className="text-sm text-[var(--foreground-soft)]">这一章还没有可选的意识点。</p>
            )}
          </div>
        </div>
      </section>

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
