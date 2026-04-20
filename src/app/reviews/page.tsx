import { ReactNode } from "react";

import { getApiUnavailableCopy } from "@/app/api-copy.mjs";
import { getFeedbackChrome, getEmptyStateCopy } from "@/app/feedback-chrome.mjs";
import { getWorkbenchPageCopy } from "@/app/workbench-copy.mjs";
import { AppShell } from "@/components/app-shell";
import { FormField } from "@/components/form-field";
import { PrimaryButton, PrimaryLinkButton } from "@/components/primary-button";
import { SectionCard } from "@/components/section-card";
import { requireLogin } from "@/lib/auth";
import { listReviewItems } from "@/lib/api";
import { reviewResultLabelMap, reviewStatusLabelMap } from "@/lib/labels";

import { submitRecoveryReviewAction, submitReviewAction } from "./actions";
import { getReviewFormCopy, getReviewResultOptions, getReviewSurfaceTone } from "./review-surface.mjs";
import { getReviewsFieldChrome } from "./reviews-form-chrome.mjs";

// copy anchors kept for source-level tests:
// \u67e5\u770b\u590d\u76d8\u5386\u53f2
// \u540e\u9762\u8fd8\u6709 ${pendingRemainingCount} \u6761\u5f85\u590d\u76d8
// \u540e\u9762\u8fd8\u6709 ${recoveryRemainingCount} \u7ec4\u5f85\u6062\u590d\u590d\u76d8
// \u5f53\u65f6\u7684\u4efb\u52a1\u80cc\u666f
// \u5f53\u65f6\u7684\u5361\u70b9
// \u5f53\u65f6\u7684\u9a8c\u8bc1\u65b9\u5f0f

const reviewStageLabelMap: Record<string, string> = {
  day3: "第 3 天复盘",
  day7: "第 7 天复盘",
  day30: "第 30 天复盘",
};

type ReviewsPageProps = {
  searchParams: Promise<{ submitted?: string }>;
};

function ReviewMetaPill({ children, recovery = false }: { children: ReactNode; recovery?: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-medium leading-5",
        recovery
          ? "border-amber-200 bg-white/85 text-[var(--warning-text)]"
          : "border-[var(--border-soft)] bg-[var(--surface-soft)] text-[var(--foreground-soft)]",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function ReviewInfoCard({
  title,
  children,
  recovery = false,
}: {
  title: string;
  children: ReactNode;
  recovery?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[22px] border px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]",
        recovery ? "border-amber-200/80 bg-white/78" : "border-[var(--border-soft)] bg-white/84",
      ].join(" ")}
    >
      <p className="text-[13px] font-semibold text-[var(--foreground)] md:text-sm">{title}</p>
      <div className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">{children}</div>
    </div>
  );
}

function QuietSuccessNotice({ children }: { children: ReactNode }) {
  const chrome = getFeedbackChrome("successAlert");

  return (
    <section className={["app-alert flex items-start gap-3", chrome.className].join(" ")}>
      <span className={["mt-1 flex h-3 w-3 shrink-0 rounded-full", chrome.markerClassName].join(" ")} />
      <p>{children}</p>
    </section>
  );
}

function EmptyStateCard({ kind }: { kind: "todayLogs" | "logs" | "reviews" }) {
  const chrome = getFeedbackChrome("emptyState");
  const copy = getEmptyStateCopy(kind);

  return (
    <section className={chrome.className}>
      <p className={chrome.eyebrowClassName}>当前状态</p>
      <p className={["mt-2", chrome.titleClassName].join(" ")}>{copy.title}</p>
      <p className={["mt-2", chrome.bodyClassName].join(" ")}>{copy.body}</p>
    </section>
  );
}

function ReviewsMoodHero() {
  return (
    <section className="reviews-hero app-surface relative overflow-hidden px-5 pt-6 pb-5 md:px-7 md:pt-7 md:pb-6">
      <div className="reviews-hero-glow reviews-hero-glow-left" />
      <div className="reviews-hero-glow reviews-hero-glow-right" />
      <div className="reviews-hero-orbit reviews-hero-orbit-outer" />
      <div className="reviews-hero-orbit reviews-hero-orbit-middle" />
      <div className="reviews-hero-orbit reviews-hero-orbit-inner" />
      <div className="reviews-hero-dot reviews-hero-dot-1" />
      <div className="reviews-hero-dot reviews-hero-dot-2" />
      <div className="reviews-hero-dot reviews-hero-dot-3" />

      <div className="relative z-[1] max-w-xl">
        <span className="inline-flex items-center rounded-full border border-[rgba(240,205,154,0.45)] bg-white/72 px-3 py-1 text-[12px] font-medium tracking-[0.04em] text-[var(--foreground-soft)] backdrop-blur-sm">
          到了时间，慢慢回看
        </span>
        <h2 className="mt-4 text-[28px] font-semibold tracking-[-0.04em] text-[var(--foreground)] md:text-[40px]">
          这次，先看清自己走到了哪
        </h2>
        <p className="mt-3 max-w-lg text-[14px] leading-7 text-[var(--foreground-soft)] md:text-[15px] md:leading-8">
          先把当时的任务和现在的状态放在一起，再写下这次真实发生了什么。
        </p>
      </div>
    </section>
  );
}

function ReviewResultGroup({
  label,
  recovery = false,
}: {
  label: string;
  recovery?: boolean;
}) {
  const options = getReviewResultOptions();

  return (
    <fieldset className="space-y-3">
      <legend className="text-[14px] font-semibold text-[var(--foreground)] md:text-[15px]">{label}</legend>
      <p className="text-[12px] leading-5 text-[var(--foreground-soft)] md:text-[13px]">
        先给这次复盘一个结果判断，再继续往下写过程和调整。
      </p>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const optionLabel = reviewResultLabelMap[option.value as keyof typeof reviewResultLabelMap] ?? option.value;

          return (
            <label key={option.value} className="min-w-[calc(50%-5px)] flex-1 cursor-pointer sm:min-w-[140px] sm:flex-none">
              <input
                type="radio"
                name="result"
                value={option.value}
                defaultChecked={option.value === "partial"}
                className="peer sr-only"
              />
              <span
                className={[
                  "inline-flex min-h-[46px] w-full items-center justify-center rounded-[18px] border px-4 text-center text-[13px] font-medium leading-5 transition md:min-h-12 md:text-sm",
                  recovery
                    ? "border-amber-200 bg-white/90 text-[var(--foreground-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] peer-checked:border-amber-300 peer-checked:bg-[linear-gradient(180deg,#fff7ed_0%,#ffedd5_100%)] peer-checked:text-[var(--warning-text)] peer-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_20px_rgba(180,83,9,0.12)]"
                    : "border-[var(--border-soft)] bg-[var(--surface-soft)] text-[var(--foreground-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] peer-checked:border-[color:rgba(19,111,99,0.2)] peer-checked:bg-[linear-gradient(180deg,rgba(232,244,238,0.98)_0%,rgba(219,238,229,0.96)_100%)] peer-checked:text-[var(--primary)] peer-checked:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_22px_rgba(19,111,99,0.14)]",
                ].join(" ")}
              >
                {optionLabel}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ReviewWritingModule({
  field,
  hint,
  placeholder,
}: {
  field: "actualSituation" | "suggestion";
  hint: string;
  placeholder: string;
}) {
  const chrome = getReviewsFieldChrome(field);

  return (
    <section className={["rounded-[20px] border px-4 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.04)] md:px-5 md:py-5", chrome.panelClassName].join(" ")}>
      <div className="mb-3 flex items-center gap-2.5">
        <span className={["relative flex h-3 w-3 items-center justify-center", chrome.dotClassName].join(" ")}>
          <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
        </span>
        <span className={["inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold leading-5 tracking-[0.01em]", chrome.pillClassName].join(" ")}>
          {chrome.label}
        </span>
      </div>

      <FormField
        as="textarea"
        name={field}
        hint={hint}
        placeholder={placeholder}
        className="min-h-[108px] border-white/78 bg-white/97 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_8px_18px_rgba(15,23,42,0.03)] hover:border-[var(--border-strong)] focus:border-[rgba(19,111,99,0.22)] focus:shadow-[0_0_0_4px_rgba(19,111,99,0.07),0_10px_20px_rgba(15,23,42,0.035)]"
      />
    </section>
  );
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  await requireLogin();

  const query = await searchParams;
  const pageCopy = getWorkbenchPageCopy("reviews");
  let reviewsData;

  try {
    reviewsData = await listReviewItems();
  } catch {
    const apiUnavailable = getApiUnavailableCopy();

    return (
      <AppShell title="复盘" description={apiUnavailable.pageDescription}>
        <SectionCard title={apiUnavailable.cardTitle} description={apiUnavailable.cardDescription}>
          <p className="text-sm text-[var(--foreground-soft)]">{apiUnavailable.hint}</p>
        </SectionCard>
      </AppShell>
    );
  }

  const reviews = reviewsData.list;
  const recoveryGroups = reviewsData.recoveryGroups ?? [];
  const pendingRemainingCount = reviewsData.pendingRemainingCount ?? 0;
  const recoveryRemainingCount = reviewsData.recoveryRemainingCount ?? 0;

  return (
    <AppShell title="复盘" description={pageCopy.formDescription} hideHero>
      <ReviewsMoodHero />

      {query.submitted ? <QuietSuccessNotice>这次复盘已经记下来了。</QuietSuccessNotice> : null}

      <section className="overflow-hidden rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-[linear-gradient(180deg,rgba(245,250,247,0.96)_0%,rgba(255,255,255,0.98)_48%,rgba(243,248,245,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.94)]">
        <div className="border-b border-[rgba(205,219,212,0.72)] bg-[radial-gradient(circle_at_top_left,rgba(35,133,117,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,250,248,0.9)_100%)] px-4 py-4 md:px-5 md:py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full border border-[rgba(41,122,106,0.18)] bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[var(--primary)] shadow-[0_6px_16px_rgba(19,111,99,0.08)]">
                待处理复盘
              </span>
              <div>
                <h2 className="text-[18px] font-semibold tracking-[0.01em] text-[var(--foreground)] md:text-[20px]">
                  现在该先处理的复盘
                </h2>
                <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
                  每张卡都按“任务信息 → 背景信息 → 填写复盘”的顺序展开，先看清，再填写。
                </p>
              </div>
            </div>

            <PrimaryLinkButton href="/reviews/history" variant="secondary" block={false}>
              查看复盘历史
            </PrimaryLinkButton>
          </div>
        </div>

        <div className="px-4 py-4 md:px-5 md:py-5">
          <div className="space-y-5 text-sm leading-7 text-[var(--foreground-soft)]">
            {reviews.length === 0 && recoveryGroups.length === 0 ? <EmptyStateCard kind="reviews" /> : null}

            {pendingRemainingCount > 0 ? (
              <section className="rounded-[20px] border border-[rgba(210,221,215,0.86)] bg-[rgba(243,249,246,0.72)] px-4 py-3 text-[13px] leading-6 text-[var(--foreground-soft)]">
                {`后面还有 ${pendingRemainingCount} 条待复盘，先完成这一条再继续。`}
              </section>
            ) : null}

            {recoveryRemainingCount > 0 ? (
              <section className="rounded-[20px] border border-[rgba(240,205,154,0.8)] bg-[rgba(255,248,238,0.86)] px-4 py-3 text-[13px] leading-6 text-[var(--foreground-soft)]">
                {`后面还有 ${recoveryRemainingCount} 组待恢复复盘，完成当前这组后再继续。`}
              </section>
            ) : null}

            {reviews.map((item) => {
              const tone = getReviewSurfaceTone({ recovery: false });
              const copy = getReviewFormCopy({ recovery: false });

              return (
                <form
                  key={item.id}
                  action={submitReviewAction}
                  className={`space-y-4 rounded-[30px] border p-4 shadow-[0_14px_32px_rgba(15,23,42,0.05)] md:space-y-5 md:p-6 ${tone.className}`}
                >
                  <input type="hidden" name="reviewItemId" value={item.id} />

                  <section className="rounded-[24px] border border-white/80 bg-white/92 px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:px-5 md:py-5">
                    <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--primary)]">{tone.title}</p>
                    <h3 className="mt-3 text-[17px] font-semibold leading-7 text-[var(--foreground)] md:text-[20px] md:leading-8">
                      {item.dailyTask.topicTitle}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <ReviewMetaPill>{reviewStageLabelMap[item.reviewStage] || item.reviewStage}</ReviewMetaPill>
                      <ReviewMetaPill>{reviewStatusLabelMap[item.status] || item.status}</ReviewMetaPill>
                      <ReviewMetaPill>任务日期：{item.dailyTask.taskDate}</ReviewMetaPill>
                    </div>
                  </section>

                  <div className="grid gap-3 md:grid-cols-2">
                    <ReviewInfoCard title="当时的任务背景">
                      {item.dailyTask.topicDescription || item.dailyTask.topicSummary || "这条任务当时没有额外补充背景说明。"}
                    </ReviewInfoCard>
                    <ReviewInfoCard title="当时准备怎么练">
                      {item.dailyTask.improvementPlan || "当时没有额外写下这次准备怎么练。"}
                    </ReviewInfoCard>
                    <ReviewInfoCard title="当时的卡点">
                      {item.dailyTask.weakness || "当时没有额外写下具体卡点。"}
                    </ReviewInfoCard>
                    <ReviewInfoCard title="当时的验证方式">
                      {item.dailyTask.verificationPath || "当时没有额外写下验证方式。"}
                    </ReviewInfoCard>
                  </div>

                  <section className="rounded-[24px] border border-white/80 bg-white/92 px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:px-5 md:py-5">
                    <div className="space-y-4 md:space-y-5">
                      <ReviewResultGroup label={copy.resultLabel} />
                      <ReviewWritingModule field="actualSituation" hint={copy.actualHint} placeholder="比如：原本计划怎么做，实际怎么偏了，真正卡在哪里。" />
                      <ReviewWritingModule field="suggestion" hint={copy.suggestionHint} placeholder="比如：下次先做哪个更小的动作，怎么避免再次滑走。" />
                      <PrimaryButton type="submit">提交这次复盘</PrimaryButton>
                    </div>
                  </section>
                </form>
              );
            })}

            {recoveryGroups.map((group) => {
              const tone = getReviewSurfaceTone({ recovery: true });
              const copy = getReviewFormCopy({ recovery: true });

              return (
                <form
                  key={`${group.dailyTaskId}-${group.reviewItemIds.join("-")}`}
                  action={submitRecoveryReviewAction}
                  className={`space-y-4 rounded-[30px] border p-4 shadow-[0_14px_32px_rgba(180,83,9,0.08)] md:space-y-5 md:p-6 ${tone.className}`}
                >
                  <input type="hidden" name="reviewItemIds" value={group.reviewItemIds.join(",")} />

                  <section className="rounded-[24px] border border-white/80 bg-white/92 px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:px-5 md:py-5">
                    <p className="text-[12px] font-semibold tracking-[0.08em] text-[var(--warning-text)]">{tone.title}</p>
                    <h3 className="mt-3 text-[17px] font-semibold leading-7 text-[var(--foreground)] md:text-[20px] md:leading-8">
                      {group.dailyTask.topicTitle}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <ReviewMetaPill recovery>{group.mergedStageLabel}</ReviewMetaPill>
                      <ReviewMetaPill recovery>{reviewStatusLabelMap.pending}</ReviewMetaPill>
                      <ReviewMetaPill recovery>任务日期：{group.dailyTask.taskDate}</ReviewMetaPill>
                    </div>
                  </section>

                  <div className="grid gap-3 md:grid-cols-2">
                    <ReviewInfoCard title="当时的任务背景" recovery>
                      {group.dailyTask.topicDescription || group.dailyTask.topicSummary || "这组任务当时没有额外补充背景说明。"}
                    </ReviewInfoCard>
                    <ReviewInfoCard title="当时准备怎么练" recovery>
                      {group.dailyTask.improvementPlan || "当时没有额外写下这段准备怎么练。"}
                    </ReviewInfoCard>
                    <ReviewInfoCard title="当时的卡点" recovery>
                      {group.dailyTask.weakness || "当时没有额外写下具体卡点。"}
                    </ReviewInfoCard>
                    <ReviewInfoCard title="当时的验证方式" recovery>
                      {group.dailyTask.verificationPath || "当时没有额外写下验证方式。"}
                    </ReviewInfoCard>
                  </div>

                  <section className="rounded-[24px] border border-white/80 bg-white/92 px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:px-5 md:py-5">
                    <div className="space-y-4 md:space-y-5">
                      <ReviewResultGroup label={copy.resultLabel} recovery />
                      <ReviewWritingModule field="actualSituation" hint={copy.actualHint} placeholder="比如：这段时间里发生了什么变化，为什么没有按原来的节奏继续。" />
                      <ReviewWritingModule field="suggestion" hint={copy.suggestionHint} placeholder="比如：下一轮怎么重新接回来，先用哪个更容易做到的小动作。" />
                      <PrimaryButton type="submit">提交这组恢复复盘</PrimaryButton>
                    </div>
                  </section>
                </form>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}