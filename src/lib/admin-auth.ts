import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAdminSession() {
  const cookieStore = await cookies();
  return {
    adminId: cookieStore.get("zero_admin_id")?.value || "",
    adminName: cookieStore.get("zero_admin_name")?.value || "",
  };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.adminId) {
    redirect('/admin/login');
  }
  return session;
}
