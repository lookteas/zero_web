import { AppShell } from "@/components/app-shell";
import { requireLogin } from "@/lib/auth";

import { HypnosisStandardizeForm } from "./standardize-form";

export default async function HypnosisDocumentsPage() {
  await requireLogin();

  return (
    <AppShell title="潜催文档优化" mobileThemeTitle="潜催文档优化" description="上传互催逐字稿，自动替换误识别词并生成标准格式 docx。" hideHero>
      <section className="rounded-[30px] border border-[rgba(204,219,212,0.92)] bg-[radial-gradient(circle_at_top_right,rgba(174,228,220,0.72)_0,rgba(174,228,220,0)_38%),linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(241,249,247,0.95)_100%)] px-5 py-5 shadow-[var(--shadow-card)] md:px-7 md:py-7">
        <p className="text-[12px] font-semibold uppercase leading-none tracking-[0.16em] text-[var(--primary)]/70">Document Tool</p>
        <h1 className="mt-3 text-[24px] font-semibold tracking-tight text-[var(--foreground)] md:text-[32px]">潜催文档标准化</h1>
        <p className="mt-3 max-w-2xl text-[14px] leading-7 text-[var(--foreground-soft)] md:text-[15px] md:leading-8">
          第一版专注批量替换错别字、语音误识别和潜催专业术语，并在文档开头补充标准复盘信息。
        </p>
      </section>

      <HypnosisStandardizeForm />
    </AppShell>
  );
}
