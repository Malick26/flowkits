import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await getSupabaseServer();
  if (!supabase) {
    // local demo without Supabase
    return { userId: "demo", email: "demo@local" };
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/admin/sign-in");

  const email = (user.email ?? "").toLowerCase();
  /**
   * Simple mode (small project):
   * - If ADMIN_EMAILS is set, restrict /admin to those emails.
   * - Otherwise, allow any authenticated user to access /admin.
   */
  if (env.adminEmails.length > 0 && !env.adminEmails.includes(email)) {
    redirect("/admin/sign-in");
  }

  return { userId: user.id, email };
}

