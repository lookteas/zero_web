import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getLoginUserId() {
  const cookieStore = await cookies();
  return cookieStore.get("zero_user_id")?.value || "";
}

export async function requireLogin() {
  const userId = await getLoginUserId();
  if (!userId) {
    redirect('/login');
  }
  return userId;
}
