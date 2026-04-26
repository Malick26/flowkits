import { createBrowserClient } from "@supabase/ssr";
import { env, hasPublicSupabaseEnv } from "@/lib/env";

declare global {
  var __ms_supabaseBrowserClient: ReturnType<typeof createBrowserClient> | undefined;
}

/**
 * IMPORTANT:
 * Use @supabase/ssr in the browser so the session is stored in cookies.
 * This allows server components (createServerClient) to read the session.
 */
export function getSupabaseBrowser() {
  if (!hasPublicSupabaseEnv()) return null;

  if (!globalThis.__ms_supabaseBrowserClient) {
    globalThis.__ms_supabaseBrowserClient = createBrowserClient(
      env.supabaseUrl,
      env.supabaseAnonKey,
    );
  }

  return globalThis.__ms_supabaseBrowserClient;
}