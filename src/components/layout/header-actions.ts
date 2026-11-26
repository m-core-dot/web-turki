"use server";

import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentStaffProfile() {
  const sessionClient = await getSupabaseServerClient();
  const { data: { user } } = await sessionClient.auth.getUser();
  if (!user) return null;

  const { data: staff } = await getSupabaseAdminClient()
    .from("staff")
    .select("name, department")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  return {
    name: staff?.name || user.email?.split("@")[0] || "—",
    email: user.email || "—",
    department: staff?.department || "User",
  };
}
