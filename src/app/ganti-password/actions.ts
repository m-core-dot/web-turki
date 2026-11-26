"use server";

import { getSupabaseServerClient, getSupabaseAdminClient } from "@/lib/supabase/server";

export async function changePassword(newPassword: string) {
  if (!newPassword || newPassword.length < 8) {
    return { ok: false as const, message: "Password baru minimal 8 karakter." };
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, message: "Sesi tidak valid. Silakan login ulang." };

  const admin = getSupabaseAdminClient();

  // Update password in Supabase Auth
  const { error } = await admin.auth.admin.updateUserById(user.id, { password: newPassword });
  if (error) return { ok: false as const, message: "Password gagal diperbarui." };

  // Clear must_change_password flag on both staff and registrations
  await admin.from("staff").update({ must_change_password: false }).eq("auth_user_id", user.id);
  await admin.from("registrations").update({ must_change_password: false }).eq("auth_user_id", user.id);

  return { ok: true as const };
}
