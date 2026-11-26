"use server";

import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentStaffProfile() {
  const sessionClient = await getSupabaseServerClient();
  const { data: { user } } = await sessionClient.auth.getUser();
  if (!user) return null;

  const admin = getSupabaseAdminClient();
  const fields = "name, email, gender, phone, address, department, role, status";
  let { data: staff } = await admin
    .from("staff")
    .select(fields)
    .eq("auth_user_id", user.id)
    .maybeSingle();

  // Fall back to email when an older staff row has no auth_user_id link.
  if (!staff && user.email) {
    const result = await admin
      .from("staff")
      .select(fields)
      .eq("email", user.email)
      .maybeSingle();
    staff = result.data;
  }

  return {
    name: staff?.name || user.email?.split("@")[0] || "—",
    email: user.email || staff?.email || "—",
    gender: staff?.gender || "",
    phone: staff?.phone || "",
    address: staff?.address || "",
    department: staff?.department || "User",
    role: staff?.role || "",
    status: staff?.status || "active",
  };
}
