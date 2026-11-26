import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getSupabaseConfig(keyName: "NEXT_PUBLIC_SUPABASE_ANON_KEY" | "SUPABASE_SERVICE_ROLE_KEY") {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env[keyName];

  if (!url || !key) {
    throw new Error(`Supabase environment variables are not configured: ${keyName}.`);
  }

  return { url, key };
}

export async function getSupabaseServerClient() {
  const { url, key } = getSupabaseConfig("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot always write cookies; middleware handles refreshes.
        }
      },
    },
  });
}

// Server actions use this client for admin operations because the current admin UI
// does not establish a Supabase user session. The key is never sent to the browser.
export function getSupabaseAdminClient() {
  const { url, key } = getSupabaseConfig("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const participantDefaultPasswordPrefix = "Masistur2019-";
export const defaultPassword = "Masistur2019";
