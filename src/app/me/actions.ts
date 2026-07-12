"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { changePassword } from "@/lib/api";

export async function changePasswordAction(formData: FormData) {
  const currentPassword = String(formData.get("currentPassword") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "").trim();
  const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

  if (currentPassword.length < 6 || newPassword.length < 6 || newPassword !== confirmPassword) {
    redirect("/me?passwordError=1#security-center");
  }

  try {
    await changePassword({ currentPassword, newPassword });
  } catch {
    redirect("/me?passwordError=1#security-center");
  }

  const cookieStore = await cookies();
  cookieStore.delete("zero_user_id");
  cookieStore.delete("zero_user_account");
  redirect("/login?passwordChanged=1");
}
