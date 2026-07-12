"use client";

import { useState } from "react";

import { logoutAction } from "@/app/login/actions";
import { FormField } from "@/components/form-field";

import { changePasswordAction } from "./actions";

export function SecurityPanel({ passwordError }: { passwordError: boolean }) {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(passwordError);

  return (
    <section id="security-center" className="rounded-[22px] border border-[oklch(88%_0.018_185)] bg-white/78 px-5 py-4 shadow-[0_12px_28px_rgba(25,83,80,0.06)] md:flex md:items-center md:justify-between md:px-6">
      <div className="min-w-0">
        <span className="text-[12px] font-bold tracking-[0.08em] text-[oklch(50%_0.095_175)]">账号安全</span>
        <h2 className="mt-1 text-[18px] font-bold text-[oklch(24%_0.042_215)]">登录与安全设置</h2>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 md:mt-0 md:flex md:items-center md:gap-3">
        <button
          type="button"
          onClick={() => setIsPasswordDialogOpen(true)}
          className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-[14px] border border-[color-mix(in_oklch,oklch(50%_0.095_175),white_62%)] bg-[color-mix(in_oklch,oklch(50%_0.095_175),white_91%)] px-4 text-[13px] font-semibold text-[oklch(31%_0.070_185)] transition hover:border-[oklch(50%_0.095_175)] hover:bg-[color-mix(in_oklch,oklch(50%_0.095_175),white_85%)] md:w-auto"
        >
          修改密码
        </button>
        <form action={logoutAction}>
          <button type="submit" className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-[14px] border border-[var(--border-soft)] bg-white px-4 text-[13px] font-semibold text-[var(--foreground)] transition hover:border-[oklch(50%_0.095_175)] hover:text-[oklch(50%_0.095_175)] md:w-auto">
            退出登录
          </button>
        </form>
      </div>

      {isPasswordDialogOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(12,32,42,0.34)] p-4" role="presentation" onMouseDown={() => setIsPasswordDialogOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-password-title"
            className="w-full max-w-[460px] rounded-[20px] border border-[var(--border-soft)] bg-white p-5 shadow-[0_24px_64px_rgba(15,48,60,0.22)] md:p-6"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] text-[oklch(50%_0.095_175)]">账号安全</p>
                <h3 id="change-password-title" className="mt-1 text-[20px] font-bold text-[var(--foreground)]">修改密码</h3>
              </div>
              <button type="button" onClick={() => setIsPasswordDialogOpen(false)} aria-label="关闭修改密码" className="grid h-9 w-9 cursor-pointer place-items-center rounded-[10px] border border-[var(--border-soft)] bg-white text-[18px] leading-none text-[var(--foreground-soft)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]">
                x
              </button>
            </div>

            <form action={changePasswordAction} className="mt-5 grid gap-4">
              <FormField label="当前密码" name="currentPassword" type="password" autoComplete="current-password" minLength={6} required />
              <FormField label="新密码" name="newPassword" type="password" autoComplete="new-password" minLength={6} required hint="至少 6 位" />
              <FormField label="确认新密码" name="confirmPassword" type="password" autoComplete="new-password" minLength={6} required />
              {passwordError ? <p className="rounded-[12px] border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] leading-5 text-rose-700">密码修改失败，请检查当前密码与新密码后重试。</p> : null}
              <div className="mt-1 flex justify-end gap-3">
                <button type="button" onClick={() => setIsPasswordDialogOpen(false)} className="inline-flex min-h-[42px] cursor-pointer items-center justify-center rounded-[12px] border border-[var(--border-soft)] bg-white px-4 text-[13px] font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-soft)]">
                  取消
                </button>
                <button type="submit" className="inline-flex min-h-[42px] cursor-pointer items-center justify-center rounded-[12px] bg-[oklch(50%_0.095_175)] px-4 text-[13px] font-semibold text-white shadow-[0_8px_18px_oklch(50%_0.095_175/.18)] transition hover:bg-[oklch(45%_0.09_180)]">
                  更新并重新登录
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </section>
  );
}
