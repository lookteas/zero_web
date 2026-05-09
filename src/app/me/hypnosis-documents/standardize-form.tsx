"use client";

import { ChangeEvent, useMemo, useState, useTransition } from "react";

import { PrimaryButton } from "@/components/primary-button";

import { analyzeHypnosisDocumentAction, standardizeHypnosisDocumentAction } from "./actions";

type Speaker = {
  name: string;
  count: number;
};

type AnalysisState = {
  speakers: Speaker[];
  date: string;
  duration: string;
};

function filenameFromDisposition(disposition: string) {
  const match = /filename="([^"]+)"/.exec(disposition);
  return match?.[1] || "hypnosis-standardized.docx";
}

function downloadBase64Docx(base64: string, contentType: string, disposition: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  const blob = new Blob([bytes], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filenameFromDisposition(disposition);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function HypnosisStandardizeForm() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null);
  const [hostName, setHostName] = useState("");
  const [message, setMessage] = useState("");
  const [isAnalyzing, startAnalyzeTransition] = useTransition();
  const [isSubmitting, startSubmitTransition] = useTransition();

  const subjectName = useMemo(() => {
    if (!analysis) {
      return "";
    }

    return analysis.speakers.find((speaker) => speaker.name !== hostName)?.name || "";
  }, [analysis, hostName]);
  const canSubmit = useMemo(() => Boolean(file && analysis && hostName && subjectName && hostName !== subjectName), [analysis, file, hostName, subjectName]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setAnalysis(null);
    setHostName("");
    setMessage("");

    if (!selectedFile) {
      return;
    }

    startAnalyzeTransition(async () => {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const result = await analyzeHypnosisDocumentAction(formData);

      if (!result.ok) {
        setMessage(result.message || "识别失败，请检查上传文件。");
        return;
      }

      const data = result.data;
      setAnalysis(data);
      setHostName(data.speakers[0]?.name || "");
      if (data.speakers.length < 2) {
        setMessage("未识别到两个说话人，请确认文档里包含“姓名(00:00:00):”格式的逐字稿。");
      }
    });
  }

  function handleSubmit(formData: FormData) {
    if (!file || !analysis) {
      setMessage("请先上传并识别 docx 文档。");
      return;
    }

    formData.set("file", file);
    formData.set("date", analysis.date);
    formData.set("duration", analysis.duration);
    formData.set("hostName", hostName);
    formData.set("subjectName", subjectName);

    startSubmitTransition(async () => {
      setMessage("");
      const result = await standardizeHypnosisDocumentAction(formData);

      if (!result.ok) {
        setMessage(result.message || "处理失败，请检查上传文件。");
        return;
      }

      downloadBase64Docx(result.base64, result.contentType, result.disposition);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <section className="rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-white/92 px-4 py-4 shadow-[var(--shadow-card)] md:px-5 md:py-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 md:col-span-2">
            <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">原始 docx 文档</span>
            <input
              name="file"
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              required
              onChange={handleFileChange}
              className="block w-full rounded-[18px] border border-[var(--border-soft)] bg-white/96 px-4 py-3 text-[14px] text-[var(--foreground-soft)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--surface-muted)] file:px-4 file:py-2 file:text-[13px] file:font-medium file:text-[var(--primary)]"
            />
            <span className="block text-[13px] leading-6 text-[var(--foreground-soft)]">上传后会自动识别说话人、日期和时长估算。</span>
          </label>

          <label className="block space-y-2 md:col-span-2">
            <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">互催主题</span>
            <input name="topic" required className="app-input min-h-12 px-4 py-3 text-sm" placeholder="例如：潜意识探索-复合体灵探索" />
          </label>
        </div>
      </section>

      {analysis ? (
        <section className="rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-white/92 px-4 py-4 shadow-[var(--shadow-card)] md:px-5 md:py-5">
          <div className="mb-4">
            <h2 className="text-[18px] font-semibold tracking-[0.01em] text-[var(--foreground)] md:text-[20px]">识别结果</h2>
            <p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)] md:text-sm md:leading-7">
              互催日期：{analysis.date || "当天"}；互催时长：{analysis.duration || "未识别到时间戳"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">主催</span>
              <select value={hostName} onChange={(event) => setHostName(event.target.value)} className="app-input min-h-12 px-4 py-3 text-sm">
                {analysis.speakers.map((speaker) => (
                  <option key={speaker.name} value={speaker.name}>
                    {speaker.name}（{speaker.count} 条）
                  </option>
                ))}
              </select>
            </label>
            <div className="block space-y-2">
              <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">被催</span>
              <div className="app-input flex min-h-12 items-center px-4 py-3 text-sm text-[var(--foreground-soft)]">
                {subjectName || "请先选择主催"}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {message ? (
        <section className="app-alert border border-amber-200 bg-amber-50 text-amber-700">
          {message}
        </section>
      ) : null}

      <PrimaryButton type="submit" disabled={!canSubmit || isAnalyzing || isSubmitting}>
        {isAnalyzing ? "正在识别文档" : isSubmitting ? "正在生成标准文档" : "生成并下载标准文档"}
      </PrimaryButton>
    </form>
  );
}
