import Link from "next/link";
import { ReactNode } from "react";

import { actionErrorCopy } from "@/app/action-copy.mjs";
import { getApiUnavailableCopy } from "@/app/api-copy.mjs";
import { getEmptyStateCopy, getFeedbackChrome } from "@/app/feedback-chrome.mjs";
import { getLogEntryPrimaryLine } from "@/app/logs/log-entry-card.mjs";
import { AppShell } from "@/components/app-shell";
import { FormField } from "@/components/form-field";
import { PrimaryButton } from "@/components/primary-button";
import { SectionCard } from "@/components/section-card";
import { parseAwarenessRecord } from "@/lib/awareness";
import { requireLogin } from "@/lib/auth";
import { createTodayTask, getTodayTask, listDailyTaskLogs, type DailyTask } from "@/lib/api";
import { taskStatusLabelMap } from "@/lib/labels";

import { saveTodayTaskAction, submitTodayTaskAction } from "./actions";
import { getTodayFieldChrome } from "./today-form-chrome.mjs";
import { TodaySharePanel } from "./today-share-panel";

type TodayPageProps = {
  searchParams: Promise<{ saved?: string; submitted?: string; error?: string }>;
};

const COPY = {
  pageTitle: "\u4eca\u65e5",
  savedNotice: "\u4eca\u5929\u7684\u6253\u5361\u5185\u5bb9\u5df2\u4fdd\u5b58\u3002",
  submittedNotice: "\u4eca\u5929\u7684\u6253\u5361\u5df2\u63d0\u4ea4\u3002",
  errorNotice: actionErrorCopy.todaySubmitFailed,
  historyLink: "\u67e5\u770b\u5386\u53f2\u6253\u5361",
  currentState: "\u5f53\u524d\u72b6\u6001",
  topicCardTitle: "\u4eca\u5929\u4e3b\u9898",
  topicFallback: "\u4eca\u5929\u7684\u4e3b\u9898\u8bf4\u660e\u8fd8\u6ca1\u6709\u8865\u5145\u3002",
  taskDetailDescription: "\u5148\u770b\u6e05\u4eca\u5929\u56f4\u7ed5\u4ec0\u4e48\u7ec3\uff0c\u518d\u5f00\u59cb\u586b\u5199\u3002",
  taskSummaryLabel: "\u610f\u8bc6\u70b9\u6458\u8981",
  taskDetailLabel: "\u8be6\u7ec6\u8bf4\u660e",
  taskDetailFallback: "\u4eca\u5929\u7684\u4efb\u52a1\u8be6\u60c5\u8fd8\u6ca1\u6709\u8865\u5145\uff0c\u5148\u56f4\u7ed5\u6458\u8981\u628a\u4eca\u5929\u6700\u5173\u952e\u7684\u7ec3\u4e60\u5199\u6e05\u695a\u3002",
  dateLabel: "\u6253\u5361\u65e5\u671f\uff1a",
  statusFallback: "\u4eca\u5929\u8fd8\u5728\u6574\u7406\u4e2d",
  formPanelBadge: "\u4eca\u5929\u7684\u7ec3\u4e60",
  formPanelBadgeSubmitted: "\u5df2\u63d0\u4ea4\uff0c\u53ef\u4fee\u6539",
  formTitle: "\u5f00\u59cb\u586b\u5199\u4eca\u5929\u7684\u7ec3\u4e60",
  formDescription: "\u76f4\u63a5\u5199\u5f53\u524d\u5361\u70b9\u3001\u6539\u8fdb\u884c\u52a8\u548c\u9a8c\u8bc1\u65b9\u5f0f\u3002",
  submittedEditableTitle: "\u6253\u5361\u5df2\u63d0\u4ea4\uff0c24 \u5c0f\u65f6\u5185\u53ef\u7ee7\u7eed\u4fee\u6539",
  submittedEditableDescription: "\u5982\u679c\u521a\u63d0\u4ea4\u540e\u53d1\u73b0\u9519\u5b57\u6216\u8868\u8fbe\u4e0d\u51c6\uff0c\u53ef\u4ee5\u76f4\u63a5\u4fee\u6539\uff0c\u4e0b\u65b9\u5206\u4eab\u5185\u5bb9\u4f1a\u540c\u6b65\u66f4\u65b0\u3002",
  submittedEditableCollapsedHint: "\u9700\u8981\u4fee\u6539\u65f6\uff0c\u70b9\u51fb\u5c55\u5f00\u7f16\u8f91",
  weaknessHint: "\u628a\u4eca\u5929\u6700\u5bb9\u6613\u5931\u63a7\u3001\u62d6\u5ef6\u6216\u7ed5\u5f00\u7684\u70b9\u5199\u5177\u4f53\u3002",
  weaknessPlaceholder: "\u4f8b\u5982\uff1a\u522b\u4eba\u4e00\u50ac\uff0c\u6211\u5c31\u4f1a\u4e71\uff1b\u4e00\u5fd9\u8d77\u6765\u5c31\u5fd8\u4e86\u505c\u4e00\u4e0b\u3002",
  planHint: "\u53ea\u5199\u4eca\u5929\u51c6\u5907\u771f\u6b63\u53bb\u505a\u7684\u52a8\u4f5c\uff0c\u4e0d\u6c42\u591a\uff0c\u53ea\u6c42\u80fd\u6267\u884c\u3002",
  planPlaceholder: "\u4f8b\u5982\uff1a\u6bcf\u6b21\u51c6\u5907\u56de\u5e94\u524d\uff0c\u5148\u505c\u4e09\u79d2\u518d\u5f00\u53e3\u3002",
  verificationHint: "\u5199\u4e0b\u4eca\u665a\u600e\u4e48\u68c0\u67e5\u81ea\u5df1\u662f\u5426\u771f\u7684\u505a\u5230\u4e86\u3002",
  verificationPlaceholder: "\u4f8b\u5982\uff1a\u665a\u4e0a\u56de\u770b\u4eca\u5929\u662f\u5426\u81f3\u5c11\u505a\u5230\u4e86\u4e24\u6b21\u3002",
  saveButton: "\u5148\u4fdd\u5b58",
  saveEditedButton: "\u4fdd\u5b58\u4fee\u6539",
  submitButton: "\u63d0\u4ea4\u4eca\u5929\u7684\u6253\u5361",
  submittedCardTitle: "\u4eca\u5929\u5df2\u5b8c\u6210\u6253\u5361",
  submittedCardDescription: "\u4eca\u5929\u7684\u539f\u59cb\u6253\u5361\u5185\u5bb9\u5df2\u9501\u5b9a\uff0c\u4e0b\u9762\u76f4\u63a5\u7528\u4e8e\u5206\u4eab\u5373\u53ef\u3002",
  submittedAtLabel: "\u63d0\u4ea4\u65f6\u95f4\uff1a",
  awarenessSection: "\u4eca\u65e5\u89c9\u5bdf\u8bb0\u5f55",
  awarenessDescription: "\u8fd9\u662f\u56de\u770b\u533a\uff0c\u9ed8\u8ba4\u5148\u6536\u8d77\u6765\u3002",
  awarenessSummary: "\u70b9\u51fb\u5c55\u5f00\u56de\u770b\u4eca\u5929\u7684\u89c9\u5bdf\u8bb0\u5f55",
  openLabel: "\u5c55\u5f00\u67e5\u770b",
  closeLabel: "\u6536\u8d77\u8bb0\u5f55",
  emotionLabel: "\u60c5\u7eea\uff1a",
  changeLabel: "\u53d8\u5316\uff1a",
  emptyLogFallback: "\u8fd9\u6b21\u8fd8\u6ca1\u8bb0\u4e0b",
};

function TodayMetaPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-1 text-[12px] font-medium leading-5 text-[var(--foreground-soft)]">
      {children}
    </span>
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
      <p className={chrome.eyebrowClassName}>{COPY.currentState}</p>
      <p className={["mt-2", chrome.titleClassName].join(" ")}>{copy.title}</p>
      <p className={["mt-2", chrome.bodyClassName].join(" ")}>{copy.body}</p>
    </section>
  );
}

function TodayFieldModule({
  field,
  hint,
  defaultValue,
  placeholder,
}: {
  field: "weakness" | "improvementPlan" | "verificationPath";
  hint: string;
  defaultValue?: string;
  placeholder: string;
}) {
  const chrome = getTodayFieldChrome(field);

  return (
    <section
      className={[
        "rounded-[20px] border px-4 py-4 shadow-[0_12px_26px_rgba(15,23,42,0.04)] md:px-4 md:py-4",
        chrome.panelClassName,
      ].join(" ")}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span className={["relative flex h-3 w-3 items-center justify-center", chrome.dotClassName].join(" ")}>
          <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
        </span>
        <span
          className={[
            "inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold leading-5 tracking-[0.01em]",
            chrome.pillClassName,
          ].join(" ")}
        >
          {chrome.label}
        </span>
      </div>

      <FormField
        as="textarea"
        name={field}
        hint={hint}
        defaultValue={defaultValue}
        placeholder={placeholder}
        label={undefined}
        className="min-h-[104px] border-white/75 bg-white/96 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_18px_rgba(15,23,42,0.03)] hover:border-[var(--border-strong)] focus:border-[rgba(19,111,99,0.28)] focus:shadow-[0_0_0_4px_rgba(19,111,99,0.08),0_10px_22px_rgba(15,23,42,0.04)]"
      />
    </section>
  );
}

function TodayTaskDetailCard({ task }: { task: DailyTask }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-[linear-gradient(180deg,rgba(245,250,247,0.96)_0%,rgba(255,255,255,0.98)_48%,rgba(243,248,245,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.94)]">
      <div className="border-b border-[rgba(205,219,212,0.72)] bg-[radial-gradient(circle_at_top_left,rgba(35,133,117,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,250,248,0.9)_100%)] px-4 py-4 md:px-5 md:py-5">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-[rgba(41,122,106,0.18)] bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[var(--primary)] shadow-[0_6px_16px_rgba(19,111,99,0.08)]">
            {COPY.topicCardTitle}
          </span>
          <div>
            <h2 className="text-[18px] font-semibold tracking-[0.01em] text-[var(--foreground)] md:text-[20px]">{task.topicTitle}</h2>
            <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
              {COPY.taskDetailDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 md:px-5 md:py-5">
        <div className="flex flex-wrap gap-2">
          <TodayMetaPill>{`${COPY.dateLabel}${task.taskDate}`}</TodayMetaPill>
          <TodayMetaPill>{taskStatusLabelMap[task.status] || COPY.statusFallback}</TodayMetaPill>
        </div>

        <div className="mt-4 rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-white/92 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-5">
          <div className="space-y-3">
            <div>
              <p className="text-[13px] font-semibold text-[var(--primary)]/80 md:text-[14px]">{COPY.taskSummaryLabel}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--foreground-soft)]">{task.topicSummary || COPY.topicFallback}</p>
            </div>

            <div>
              <p className="text-[13px] font-semibold text-[var(--primary)]/80 md:text-[14px]">{COPY.taskDetailLabel}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--foreground-soft)]">
                {task.topicDescription || COPY.taskDetailFallback}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TodaySubmittedSummaryCard({ task }: { task: DailyTask }) {
  return (
    <section className="rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,248,0.94)_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] md:p-5">
      <div className="flex flex-wrap gap-2">
        <TodayMetaPill>{COPY.submittedCardTitle}</TodayMetaPill>
        {task.submittedAt ? <TodayMetaPill>{`${COPY.submittedAtLabel}${task.submittedAt}`}</TodayMetaPill> : null}
      </div>
      <p className="mt-3 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
        {COPY.submittedCardDescription}
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <section className="rounded-[20px] border border-[rgba(210,221,215,0.86)] bg-white/92 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <p className="text-[12px] font-medium text-[var(--foreground-soft)]">{getTodayFieldChrome("weakness").label}</p>
          <p className="mt-2 text-[13px] leading-6 text-[var(--foreground)] md:text-sm md:leading-7">{task.weakness || COPY.emptyLogFallback}</p>
        </section>
        <section className="rounded-[20px] border border-[rgba(210,221,215,0.86)] bg-white/92 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <p className="text-[12px] font-medium text-[var(--foreground-soft)]">{getTodayFieldChrome("improvementPlan").label}</p>
          <p className="mt-2 text-[13px] leading-6 text-[var(--foreground)] md:text-sm md:leading-7">{task.improvementPlan || COPY.emptyLogFallback}</p>
        </section>
        <section className="rounded-[20px] border border-[rgba(210,221,215,0.86)] bg-white/92 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <p className="text-[12px] font-medium text-[var(--foreground-soft)]">{getTodayFieldChrome("verificationPath").label}</p>
          <p className="mt-2 text-[13px] leading-6 text-[var(--foreground)] md:text-sm md:leading-7">{task.verificationPath || COPY.emptyLogFallback}</p>
        </section>
      </div>
    </section>
  );
}

export default async function TodayPage({ searchParams }: TodayPageProps) {
  await requireLogin();

  const query = await searchParams;
  const secondaryButtonChrome = getFeedbackChrome("secondaryButton");

  let task: DailyTask;

  try {
    task = await getTodayTask();
  } catch {
    try {
      task = await createTodayTask();
    } catch {
      const apiUnavailable = getApiUnavailableCopy();

      return (
        <AppShell title={COPY.pageTitle} description={apiUnavailable.pageDescription} hideHero>
          <SectionCard title={apiUnavailable.cardTitle} description={apiUnavailable.cardDescription}>
            <p className="text-sm text-[var(--foreground-soft)]">{apiUnavailable.hint}</p>
          </SectionCard>
        </AppShell>
      );
    }
  }

  let awarenessLogs: Awaited<ReturnType<typeof listDailyTaskLogs>> = [];

  try {
    awarenessLogs = await listDailyTaskLogs(task.id);
  } catch {
    awarenessLogs = [];
  }

  const isSubmitted = task.status === "submitted";
  const canEditSubmittedContent = isSubmitted && task.canEditContent;
  const formPanelBadge = canEditSubmittedContent ? COPY.formPanelBadgeSubmitted : COPY.formPanelBadge;
  const formPanelTitle = canEditSubmittedContent ? COPY.submittedEditableTitle : COPY.formTitle;
  const formPanelDescription = canEditSubmittedContent ? COPY.submittedEditableDescription : COPY.formDescription;

  return (
    <AppShell title={COPY.pageTitle} hideHero>
      <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
        <Link
          href="/today/history"
          className={[
            "inline-flex min-h-12 items-center justify-center rounded-[18px] px-5 text-sm font-medium transition",
            secondaryButtonChrome.className,
          ].join(" ")}
        >
          {COPY.historyLink}
        </Link>
      </div>

      {query.saved ? <QuietSuccessNotice>{COPY.savedNotice}</QuietSuccessNotice> : null}
      {query.submitted ? <QuietSuccessNotice>{COPY.submittedNotice}</QuietSuccessNotice> : null}
      {query.error ? <section className="app-alert border border-rose-200 bg-rose-50 text-rose-700">{COPY.errorNotice}</section> : null}

      <TodayTaskDetailCard task={task} />

      <section className="overflow-hidden rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-[linear-gradient(180deg,rgba(245,250,247,0.96)_0%,rgba(255,255,255,0.98)_48%,rgba(243,248,245,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.94)]">
        <div className="border-b border-[rgba(205,219,212,0.72)] bg-[radial-gradient(circle_at_top_left,rgba(35,133,117,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,250,248,0.9)_100%)] px-4 py-4 md:px-5 md:py-5">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-[rgba(41,122,106,0.18)] bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[var(--primary)] shadow-[0_6px_16px_rgba(19,111,99,0.08)]">
              {formPanelBadge}
            </span>
            <div>
              <h2 className="text-[18px] font-semibold tracking-[0.01em] text-[var(--foreground)] md:text-[20px]">{formPanelTitle}</h2>
              <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
                {formPanelDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 md:px-5 md:py-5">
          {task.status === "submitted" && !task.canEditContent ? (
            <TodaySubmittedSummaryCard task={task} />
          ) : canEditSubmittedContent ? (
            <details className="rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,248,0.94)_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] md:p-5 group">
              <summary className="cursor-pointer list-none marker:hidden">
                <div className="flex items-center justify-between gap-3 rounded-[18px] border border-[rgba(41,122,106,0.1)] bg-[rgba(248,252,250,0.88)] px-3.5 py-2.5 text-[12px] leading-5 text-[var(--foreground-faint)]">
                  <span>{COPY.submittedEditableCollapsedHint}</span>
                  <span className="text-[14px] leading-none text-[var(--foreground-faint)] transition-transform group-open:rotate-180">⌄</span>
                </div>
              </summary>

              <form action={saveTodayTaskAction} className="mt-4 space-y-3.5 md:space-y-5">
                <input type="hidden" name="taskId" value={task.id} />

                <TodayFieldModule
                  field="weakness"
                  hint={COPY.weaknessHint}
                  defaultValue={task.weakness}
                  placeholder={COPY.weaknessPlaceholder}
                />

                <TodayFieldModule
                  field="improvementPlan"
                  hint={COPY.planHint}
                  defaultValue={task.improvementPlan}
                  placeholder={COPY.planPlaceholder}
                />

                <TodayFieldModule
                  field="verificationPath"
                  hint={COPY.verificationHint}
                  defaultValue={task.verificationPath}
                  placeholder={COPY.verificationPlaceholder}
                />

                <div className="grid gap-3 pt-0.5">
                  <PrimaryButton type="submit">{COPY.saveEditedButton}</PrimaryButton>
                </div>
              </form>
            </details>
          ) : (
            <section className="rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,248,0.94)_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] md:p-5">
              <form action={saveTodayTaskAction} className="space-y-3.5 md:space-y-5">
                <input type="hidden" name="taskId" value={task.id} />

                <TodayFieldModule
                  field="weakness"
                  hint={COPY.weaknessHint}
                  defaultValue={task.weakness}
                  placeholder={COPY.weaknessPlaceholder}
                />

                <TodayFieldModule
                  field="improvementPlan"
                  hint={COPY.planHint}
                  defaultValue={task.improvementPlan}
                  placeholder={COPY.planPlaceholder}
                />

                <TodayFieldModule
                  field="verificationPath"
                  hint={COPY.verificationHint}
                  defaultValue={task.verificationPath}
                  placeholder={COPY.verificationPlaceholder}
                />

                <div className={isSubmitted ? "grid gap-3 pt-0.5" : "grid gap-3 pt-0.5 md:grid-cols-2"}>
                  <PrimaryButton type="submit">{COPY.saveButton}</PrimaryButton>
                  {!isSubmitted ? (
                    <PrimaryButton
                      type="submit"
                      variant="secondary"
                      formAction={submitTodayTaskAction}
                      className={secondaryButtonChrome.className}
                    >
                      {COPY.submitButton}
                    </PrimaryButton>
                  ) : null}
                </div>
              </form>
            </section>
          )}
        </div>
      </section>

      {isSubmitted ? <TodaySharePanel task={task} /> : null}

      <SectionCard title={COPY.awarenessSection} description={COPY.awarenessDescription}>
        <details className="group rounded-[24px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,252,250,0.96)_100%)] px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-[var(--foreground)] marker:hidden">
            <span>{COPY.awarenessSummary}</span>
            <span className="inline-flex min-h-10 items-center rounded-full border border-[var(--border-soft)] bg-white/90 px-3 text-[12px] font-medium text-[var(--foreground-soft)] transition group-open:border-[var(--border-strong)] group-open:text-[var(--foreground)]">
              <span className="group-open:hidden">{COPY.openLabel}</span>
              <span className="hidden group-open:inline">{COPY.closeLabel}</span>
            </span>
          </summary>

          <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--foreground-soft)]">
            {awarenessLogs.length > 0 ? (
              awarenessLogs.map((item) => {
                const awareness = parseAwarenessRecord(item);

                return (
                  <div key={item.id} className="app-panel px-4 py-4">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {getLogEntryPrimaryLine({ summary: awareness.summary, remark: item.remark })}
                    </p>
                    <p className="mt-2 text-xs text-[var(--foreground-faint)]">{item.logTime}</p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      <p>{COPY.emotionLabel}{awareness.emotion || COPY.emptyLogFallback}</p>
                      <p>{COPY.changeLabel}{awareness.change || COPY.emptyLogFallback}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyStateCard kind="todayLogs" />
            )}
          </div>
        </details>
      </SectionCard>
    </AppShell>
  );
}

