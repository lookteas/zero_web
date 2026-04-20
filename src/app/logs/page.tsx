import { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { FormField } from "@/components/form-field";
import { PrimaryButton } from "@/components/primary-button";
import { SectionCard } from "@/components/section-card";
import { listDailyTasks, listDailyTaskLogs } from "@/lib/api";
import { parseAwarenessRecord } from "@/lib/awareness";
import { requireLogin } from "@/lib/auth";

import { getApiUnavailableCopy } from "@/app/api-copy.mjs";
import { getFeedbackChrome, getEmptyStateCopy } from "@/app/feedback-chrome.mjs";

import { createLogAction } from "./actions";
import { getLogEntryPrimaryLine } from "./log-entry-card.mjs";
import { getLogsFieldChrome } from "./logs-form-chrome.mjs";

const COPY = {
  pageTitle: "\u89c9\u5bdf\u8bb0\u5f55",

  currentState: "\u5f53\u524d\u72b6\u6001",
  topicCardTitle: "\u8fd9\u6761\u89c9\u5bdf\u548c\u4eca\u5929\u4e3b\u9898\u7684\u5173\u7cfb",
  topicCardBadge: "\u5173\u8054\u4e3b\u9898",
  noTaskTitle: "\u4eca\u5929\u8fd8\u6ca1\u6709\u53ef\u5173\u8054\u7684\u4e3b\u9898",
  noTaskBody: "\u5148\u53bb\u201c\u4eca\u65e5\u201d\u9875\u5199\u4e0b\u4eca\u5929\u5728\u7ec3\u4ec0\u4e48\uff0c\u8fd9\u91cc\u7684\u89c9\u5bdf\u624d\u77e5\u9053\u8981\u56f4\u7ed5\u4ec0\u4e48\u8bb0\u3002",
  relationBodyPrefix: "\u56f4\u7ed5\u4eca\u5929\u4e3b\u9898\u300c",
  relationBodySuffix: "\u300d\u8bb0\u4e0b\u8fd9\u4e00\u523b\u7684\u771f\u5b9e\u53d8\u5316\uff0c\u540e\u9762\u590d\u76d8\u65f6\u4f1a\u66f4\u5bb9\u6613\u770b\u89c1\u81ea\u5df1\u53cd\u590d\u51fa\u73b0\u7684\u6a21\u5f0f\u3002",
  dateLabel: "\u6253\u5361\u65e5\u671f\uff1a",
  formTitle: "\u5f00\u59cb\u8bb0\u5f55\u8fd9\u6b21\u89c9\u5bdf",
  formBadge: "\u5373\u65f6\u8bb0\u5f55",
  formDescription: "\u76f4\u63a5\u5199\u53d1\u751f\u4e86\u4ec0\u4e48\u3001\u6211\u5f53\u65f6\u7684\u72b6\u6001\uff0c\u4ee5\u53ca\u60f3\u7559\u7ed9\u81ea\u5df1\u7684\u63d0\u9192\u3002",
  waitTitle: "\u73b0\u5728\u8fd8\u4e0d\u80fd\u5f00\u59cb\u8bb0\u5f55",
  waitBody: "\u8bf7\u5148\u53bb\u201c\u4eca\u65e5\u201d\u9875\u9762\u5b8c\u6210\u4eca\u5929\u4e3b\u9898\u3002",
  eventHint: "\u53d1\u751f\u4e86\u4ec0\u4e48\uff0c\u7528\u6700\u76f4\u63a5\u7684\u8bdd\u5199\u51fa\u6765\u3002",
  eventPlaceholder: "\u521a\u624d\u53d1\u751f\u4e86\u4ec0\u4e48",
  changeHint: "\u5199\u4e0b\u4f60\u5728\u8fd9\u4e00\u523b\u89c9\u5bdf\u5230\u7684\u53d8\u5316\u6216\u53cd\u5e94\u3002",
  changePlaceholder: "\u4f60\u89c9\u5bdf\u5230\u81ea\u5df1\u6709\u4e86\u4ec0\u4e48\u53d8\u5316",
  noteHint: "\u7559\u4e00\u53e5\u7ed9\u4e4b\u540e\u56de\u770b\u7684\u81ea\u5df1\uff0c\u4e0d\u6c42\u5b8c\u6574\uff0c\u53ea\u6c42\u6709\u7528\u3002",
  notePlaceholder: "\u60f3\u7559\u7ed9\u540e\u9762\u590d\u76d8\u65f6\u81ea\u5df1\u7684\u63d0\u9192",
  submitButton: "\u8bb0\u4e0b\u8fd9\u6b21\u89c9\u5bdf",
  historyTitle: "\u6700\u8fd1\u8bb0\u4e0b\u7684\u89c9\u5bdf",
  historyBadge: "\u56de\u770b\u8bb0\u5f55",
  historyDescription: "\u8fd9\u662f\u56de\u770b\u533a\uff0c\u9ed8\u8ba4\u5148\u6536\u8d77\u6765\u3002",
  historySummary: "\u70b9\u51fb\u5c55\u5f00\u56de\u770b\u6700\u8fd1\u7684\u89c9\u5bdf\u8bb0\u5f55",
  openLabel: "\u5c55\u5f00\u67e5\u770b",
  closeLabel: "\u6536\u8d77\u8bb0\u5f55",
  linkedTopicLabel: "\u5173\u8054\u4e3b\u9898\uff1a",
  linkedTopicFallback: "\u6cbf\u7528\u4eca\u5929\u4e3b\u9898",
  changeRowLabel: "\u53d8\u5316\uff1a",
  noteRowLabel: "\u8865\u5145\uff1a",
  emptyLogFallback: "\u8fd9\u6b21\u8fd8\u6ca1\u8bb0\u4e0b",
};

function LogsMetaPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[rgba(236,248,244,0.92)] px-3 py-1 text-[12px] font-medium leading-5 text-[var(--primary)]">
      {children}
    </span>
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


function LogsMoodHero() {
  return (
    <section className="logs-hero app-surface relative overflow-hidden px-5 pt-6 pb-5 md:px-7 md:pt-7 md:pb-6">
      <div className="logs-hero-glow logs-hero-glow-left" />
      <div className="logs-hero-glow logs-hero-glow-right" />
      <div className="logs-hero-orbit logs-hero-orbit-outer" />
      <div className="logs-hero-orbit logs-hero-orbit-middle" />
      <div className="logs-hero-orbit logs-hero-orbit-inner" />
      <div className="logs-hero-dot logs-hero-dot-1" />
      <div className="logs-hero-dot logs-hero-dot-2" />
      <div className="logs-hero-dot logs-hero-dot-3" />
      <div className="logs-hero-dot logs-hero-dot-4" />

      <div className="relative z-[1] max-w-xl">
        <span className="inline-flex items-center rounded-full border border-[rgba(105,190,198,0.28)] bg-white/68 px-3 py-1 text-[12px] font-medium tracking-[0.04em] text-[var(--foreground-soft)] backdrop-blur-sm">
          先停一下，看看这一刻
        </span>
        <h2 className="mt-4 text-[28px] font-semibold tracking-[-0.04em] text-[var(--foreground)] md:text-[40px]">
          把刚才那一下，轻轻照亮
        </h2>
        <p className="mt-3 max-w-lg text-[14px] leading-7 text-[var(--foreground-soft)] md:text-[15px] md:leading-8">
          记下发生了什么、你当时的反应，以及想留给自己的那句提醒。
        </p>
      </div>
    </section>
  );
}
function LogsFieldModule({
  field,
  hint,
  placeholder,
  multiline = false,
}: {
  field: "event" | "change" | "note";
  hint: string;
  placeholder: string;
  multiline?: boolean;
}) {
  const chrome = getLogsFieldChrome(field);

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
        as={multiline ? "textarea" : "input"}
        name={field}
        hint={hint}
        placeholder={placeholder}
        label={undefined}
        className="border-white/75 bg-white/96 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_18px_rgba(15,23,42,0.03)] hover:border-[var(--border-strong)] focus:border-[rgba(19,111,99,0.28)] focus:shadow-[0_0_0_4px_rgba(19,111,99,0.08),0_10px_22px_rgba(15,23,42,0.04)]"
      />
    </section>
  );
}

function ShareLikeShell({
  badge,
  title,
  description,
  children,
}: {
  badge: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-[linear-gradient(180deg,rgba(245,250,247,0.96)_0%,rgba(255,255,255,0.98)_48%,rgba(243,248,245,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.94)]">
      <div className="border-b border-[rgba(205,219,212,0.72)] bg-[radial-gradient(circle_at_top_left,rgba(35,133,117,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,250,248,0.9)_100%)] px-4 py-4 md:px-5 md:py-5">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-[rgba(41,122,106,0.18)] bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[var(--primary)] shadow-[0_6px_16px_rgba(19,111,99,0.08)]">
            {badge}
          </span>
          <div>
            <h2 className="text-[18px] font-semibold tracking-[0.01em] text-[var(--foreground)] md:text-[20px]">{title}</h2>
            <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">{description}</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 md:px-5 md:py-5">{children}</div>
    </section>
  );
}

export default async function LogsPage() {
  await requireLogin();

  let tasks;

  try {
    tasks = await listDailyTasks();
  } catch {
    const apiUnavailable = getApiUnavailableCopy();

    return (
      <AppShell title={COPY.pageTitle} description={apiUnavailable.pageDescription} hideHero>
      <LogsMoodHero />
        <SectionCard title={apiUnavailable.cardTitle} description={apiUnavailable.cardDescription}>
          <p className="text-sm text-[var(--foreground-soft)]">{apiUnavailable.hint}</p>
        </SectionCard>
      </AppShell>
    );
  }

  const latestTask = tasks[0];
  let logs: Awaited<ReturnType<typeof listDailyTaskLogs>> = [];

  if (latestTask) {
    try {
      logs = await listDailyTaskLogs(latestTask.id);
    } catch {
      logs = [];
    }
  }

  const relationDescription = latestTask
    ? `${COPY.relationBodyPrefix}${latestTask.topicTitle}${COPY.relationBodySuffix}`
    : COPY.noTaskBody;

  return (
    <AppShell title={COPY.pageTitle} hideHero>
      <LogsMoodHero />
      <ShareLikeShell badge={COPY.topicCardBadge} title={COPY.topicCardTitle} description={relationDescription}>
        <section className="rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-white/92 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-5">
          {latestTask ? (
            <>
              <h3 className="text-[18px] font-semibold tracking-[0.01em] text-[var(--foreground)] md:text-[20px]">{latestTask.topicTitle}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <LogsMetaPill>{`${COPY.dateLabel}${latestTask.taskDate}`}</LogsMetaPill>
              </div>
            </>
          ) : (
            <h3 className="text-[18px] font-semibold tracking-[0.01em] text-[var(--foreground)] md:text-[20px]">{COPY.noTaskTitle}</h3>
          )}
        </section>
      </ShareLikeShell>

      <ShareLikeShell
        badge={COPY.formBadge}
        title={COPY.formTitle}
        description={latestTask ? COPY.formDescription : COPY.waitBody}
      >
        {latestTask ? (
          <section className="rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,248,0.94)_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] md:p-5">
            <form action={createLogAction} className="space-y-4">
              <input type="hidden" name="taskId" value={latestTask.id} />
              <input type="hidden" name="topicTitle" value={latestTask.topicTitle} />

              <LogsFieldModule field="event" hint={COPY.eventHint} placeholder={COPY.eventPlaceholder} multiline />
              <LogsFieldModule field="change" hint={COPY.changeHint} placeholder={COPY.changePlaceholder} multiline />
              <LogsFieldModule field="note" hint={COPY.noteHint} placeholder={COPY.notePlaceholder} multiline />

              <PrimaryButton type="submit">{COPY.submitButton}</PrimaryButton>
            </form>
          </section>
        ) : (
          <section className="rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-white/92 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-5">
            <h3 className="text-[18px] font-semibold tracking-[0.01em] text-[var(--foreground)] md:text-[20px]">{COPY.waitTitle}</h3>
          </section>
        )}
      </ShareLikeShell>

      <ShareLikeShell badge={COPY.historyBadge} title={COPY.historyTitle} description={COPY.historyDescription}>
        <details className="group rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,248,0.94)_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-[var(--foreground)] marker:hidden">
            <span>{COPY.historySummary}</span>
            <span className="inline-flex min-h-10 items-center rounded-full border border-[var(--border-soft)] bg-white/90 px-3 text-[12px] font-medium text-[var(--foreground-soft)] transition group-open:border-[var(--border-strong)] group-open:text-[var(--foreground)]">
              <span className="group-open:hidden">{COPY.openLabel}</span>
              <span className="hidden group-open:inline">{COPY.closeLabel}</span>
            </span>
          </summary>

          <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--foreground-soft)]">
            {logs.length > 0 ? (
              logs.map((item) => {
                const awareness = parseAwarenessRecord(item);

                return (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-[rgba(210,221,215,0.86)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,251,249,0.95)_100%)] px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-white/92 px-3 py-1 text-[11px] font-medium leading-5 text-[var(--foreground-soft)]">
                        {item.logTime}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-[rgba(205,219,212,0.86)] bg-[rgba(243,249,246,0.9)] px-3 py-1 text-[11px] font-medium leading-5 text-[var(--primary)]">
                        {COPY.linkedTopicLabel}{awareness.topicTitle || COPY.linkedTopicFallback}
                      </span>
                    </div>

                    <p className="mt-3 text-[15px] font-semibold leading-7 text-[var(--foreground)]">
                      {getLogEntryPrimaryLine({ summary: awareness.summary, remark: item.remark })}
                    </p>

                    <div className="mt-3 rounded-[18px] border border-[rgba(216,226,221,0.9)] bg-[rgba(243,249,246,0.82)] px-3 py-2">
                      <div className="space-y-1 text-[13px] leading-6 text-[var(--foreground-soft)]">
                        {awareness.change ? <p>{COPY.changeRowLabel}{awareness.change}</p> : null}
                        {awareness.note ? <p>{COPY.noteRowLabel}{awareness.note}</p> : null}
                        {!awareness.change && !awareness.note ? <p>{COPY.emptyLogFallback}</p> : null}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyStateCard kind="logs" />
            )}
          </div>
        </details>
      </ShareLikeShell>
    </AppShell>
  );
}