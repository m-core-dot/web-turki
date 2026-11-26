import { createClient } from "@supabase/supabase-js";

function getSupabaseConfig(keyName: "NEXT_PUBLIC_SUPABASE_ANON_KEY" | "SUPABASE_SERVICE_ROLE_KEY") {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env[keyName];

  if (!url || !key) {
    throw new Error(`Supabase environment variables are not configured: ${keyName}.`);
  }

  return { url, key };
}

export function getSupabaseServerClient() {
  const { url, key } = getSupabaseConfig("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
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
