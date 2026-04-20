import { cookies } from "next/headers";

import { AppShell } from "@/components/app-shell";
import { PrimaryButton } from "@/components/primary-button";
import { SectionCard } from "@/components/section-card";
import { logoutAction } from "@/app/login/actions";
import { requireLogin } from "@/lib/auth";

export default async function MePage() {
  await requireLogin();

  const cookieStore = await cookies();
  const account = cookieStore.get("zero_user_account")?.value || "当前账号";

  return (
    <AppShell title="我的" description="查看当前登录账号，并从这里安全退出。">
      <SectionCard title="当前账号" description="后续头像、昵称和更多个人信息也会放在这里。">
        <div className="space-y-4 text-sm text-[var(--foreground-soft)]">
          <p className="rounded-[20px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-4 py-4 text-[var(--foreground)]">
            {account}
          </p>
          <form action={logoutAction}>
            <PrimaryButton type="submit" variant="secondary">
              退出登录
            </PrimaryButton>
          </form>
        </div>
      </SectionCard>
    </AppShell>
  );
}
