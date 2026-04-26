import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function assertAdminApiAccess() {
  const supabase = await getSupabaseServer();
  if (!supabase) {
    // allow local demo without Supabase
    return { ok: true as const, userId: "demo" };
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const email = (user.email ?? "").toLowerCase();
  if (env.adminEmails.length > 0 && !env.adminEmails.includes(email)) {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true as const, userId: user.id };
}

