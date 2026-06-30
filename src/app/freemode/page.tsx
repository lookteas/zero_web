import { requireLogin } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { getApiUnavailableCopy } from "@/app/api-copy.mjs";
import { listFreemodeChapters, listFreemodePractices } from "@/lib/api";

import { FreemodeWorkbench } from "./freemode-workbench";

type FreemodePageProps = {
  searchParams: Promise<{ created?: string; error?: string }>;
};

function FreemodeNotice({ children }: { children: string }) {
  return (
    <section className="app-alert border border-[rgba(19,111,99,0.12)] bg-[linear-gradient(180deg,rgba(248,253,250,0.96)_0%,rgba(239,250,244,0.96)_100%)] text-[var(--success-text)]">
      {children}
    </section>
  );
}

export default async function FreemodePage({ searchParams }: FreemodePageProps) {
  await requireLogin();
  const query = await searchParams;
  let chapters: Awaited<ReturnType<typeof listFreemodeChapters>>;
  let practices: Awaited<ReturnType<typeof listFreemodePractices>>;

  try {
    [chapters, practices] = await Promise.all([listFreemodeChapters(), listFreemodePractices()]);
  } catch {
    const apiUnavailable = getApiUnavailableCopy();

    return (
      <AppShell title="自由模式" mobileThemeTitle="自由模式" description={apiUnavailable.pageDescription} hideHero>
        <SectionCard title={apiUnavailable.cardTitle} description={apiUnavailable.cardDescription}>
          <p className="text-sm text-[var(--foreground-soft)]">{apiUnavailable.hint}</p>
        </SectionCard>
      </AppShell>
    );
  }

  return (
    <AppShell title="自由模式" mobileThemeTitle="自由模式" description="按章节挑选意识点，随时开始一段独立练习。" hideHero>
      {query.created ? <FreemodeNotice>自由模式记录已保存，不会计入今天的打卡。</FreemodeNotice> : null}
      {query.error ? <FreemodeNotice>这次保存没有成功，稍后再试一次就好。</FreemodeNotice> : null}

      <FreemodeWorkbench chapters={chapters} recentPractices={practices} />
    </AppShell>
  );
}
