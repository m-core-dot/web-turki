"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function checkMustChangePassword(userId: string): Promise<boolean> {
  const admin = getSupabaseAdminClient();

  const { data: staff } = await admin.from("staff").select("must_change_password").eq("auth_user_id", userId).maybeSingle();
  if (staff?.must_change_password) return true;

  const { data: reg } = await admin.from("registrations").select("must_change_password").eq("auth_user_id", userId).maybeSingle();
  if (reg?.must_change_password) return true;

  return false;
}

export async function getLoginDestination(userId: string): Promise<"/admin" | "/portal"> {
  const admin = getSupabaseAdminClient();
  const { data: staff } = await admin.from("staff").select("auth_user_id").eq("auth_user_id", userId).maybeSingle();
  if (staff) return "/admin";

  const { data: participant } = await admin.from("registrations").select("auth_user_id").eq("auth_user_id", userId).maybeSingle();
  return participant ? "/portal" : "/portal";
}
