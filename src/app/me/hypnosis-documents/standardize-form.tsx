"use client";

import { useActionState, useEffect } from "react";

import { PrimaryButton } from "@/components/primary-button";

import { standardizeHypnosisDocumentAction } from "./actions";

type ActionState = Awaited<ReturnType<typeof standardizeHypnosisDocumentAction>> | null;

function filenameFromDisposition(disposition: string) {
  const match = /filename="([^"]+)"/.exec(disposition);
  return match?.[1] || "hypnosis-standardized.docx";
}

export function HypnosisStandardizeForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_previousState, formData) => standardizeHypnosisDocumentAction(formData),
    null
  );

  useEffect(() => {
    if (!state?.ok || !state.base64) {
      return;
    }

    const binary = atob(state.base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    const blob = new Blob([bytes], { type: state.contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filenameFromDisposition(state.disposition);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <section className="rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-white/92 px-4 py-4 shadow-[var(--shadow-card)] md:px-5 md:py-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 md:col-span-2">
            <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">原始 docx 文档</span>
            <input
              name="file"
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              required
              className="block w-full rounded-[18px] border border-[var(--border-soft)] bg-white/96 px-4 py-3 text-[14px] text-[var(--foreground-soft)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--surface-muted)] file:px-4 file:py-2 file:text-[13px] file:font-medium file:text-[var(--primary)]"
            />
            <span className="block text-[13px] leading-6 text-[var(--foreground-soft)]">上传互催逐字稿，系统会生成一份新的标准化 Word 文档。</span>
          </label>

          <label className="block space-y-2">
            <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">互催主题</span>
            <input name="topic" className="app-input min-h-12 px-4 py-3 text-sm" placeholder="例如：潜意识探索" />
          </label>
          <label className="block space-y-2">
            <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">互催日期</span>
            <input name="date" className="app-input min-h-12 px-4 py-3 text-sm" placeholder="例如：2026年02月09日" />
          </label>
          <label className="block space-y-2">
            <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">互催时长</span>
            <input name="duration" className="app-input min-h-12 px-4 py-3 text-sm" placeholder="例如：约2小时" />
          </label>
          <label className="block space-y-2">
            <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">主催名称</span>
            <input name="hostName" className="app-input min-h-12 px-4 py-3 text-sm" placeholder="原文里的主催姓名" />
          </label>
          <label className="block space-y-2">
            <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">被催名称</span>
            <input name="subjectName" className="app-input min-h-12 px-4 py-3 text-sm" placeholder="原文里的被催姓名" />
          </label>
        </div>
      </section>

      <section className="rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-white/92 px-4 py-4 shadow-[var(--shadow-card)] md:px-5 md:py-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">主催复盘</span>
            <textarea name="hostReview" className="app-input min-h-[132px] px-4 py-3 text-sm leading-7" />
          </label>
          <label className="block space-y-2">
            <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">被催复盘</span>
            <textarea name="subjectReview" className="app-input min-h-[132px] px-4 py-3 text-sm leading-7" />
          </label>
        </div>
      </section>

      {state && !state.ok ? (
        <section className="app-alert border border-rose-200 bg-rose-50 text-rose-700">
          {state.message || "处理失败，请检查上传文件。"}
        </section>
      ) : null}

      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "正在生成标准文档" : "生成并下载标准文档"}
      </PrimaryButton>
    </form>
  );
}
