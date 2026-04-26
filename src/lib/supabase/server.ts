import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env, hasPublicSupabaseEnv } from "@/lib/env";

export async function getSupabaseServer() {
  if (!hasPublicSupabaseEnv()) return null;

  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // server component read-only fallback
        }
      },
    },
  });
}