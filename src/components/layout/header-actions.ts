"use server";

import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";
import { staffInputSchema } from "@/lib/staff";

export async function updateCurrentStaffProfile(input: unknown) {
  const parsed = staffInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "Data profil tidak valid." };

  const sessionClient = await getSupabaseServerClient();
  const { data: { user } } = await sessionClient.auth.getUser();
  if (!user) return { ok: false as const, message: "Sesi login tidak valid." };

  const admin = getSupabaseAdminClient();
  const { error } = await admin.from("staff").update({
    name: parsed.data.name,
    gender: parsed.data.gender,
    phone: parsed.data.phone,
    address: parsed.data.address,
  }).eq("auth_user_id", user.id);
  if (error) return { ok: false as const, message: "Profil gagal diperbarui." };
  return { ok: true as const };
}

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
