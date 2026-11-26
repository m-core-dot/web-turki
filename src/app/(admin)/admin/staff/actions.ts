"use server";

import { createStaff, deleteStaff, listStaff, staffInputSchema, updateStaff } from "@/lib/staff";
import { getSupabaseAdminClient, getSupabaseServerClient, defaultPassword } from "@/lib/supabase/server";

export async function fetchStaff() {
  const { data, error } = await listStaff();
  if (error) {
    console.error("Failed to list staff", error);
    return { ok: false as const, message: "Data staff gagal dimuat." };
  }
  const client = await getSupabaseServerClient();
  const { data: authData } = await client.auth.getUser();
  const user = authData.user;
  let actorRole = "";
  if (user) {
    const { data: actor } = await getSupabaseAdminClient().from("staff").select("role").eq("auth_user_id", user.id).single();
    actorRole = actor?.role ?? "";
  }
  return { ok: true as const, data: data ?? [], actorRole };
}

export async function saveStaff(input: unknown, id?: string) {
  const parsed = staffInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "Data staff tidak valid." };

  if (id) {
    const admin = getSupabaseAdminClient();
    const [{ data: currentStaff }, { data: currentUser }] = await Promise.all([
      admin.from("staff").select("role").eq("id", id).single(),
      (async () => {
        const { data } = await (await getSupabaseServerClient()).auth.getUser();
        return data.user;
      })(),
    ]);
    if (currentStaff?.role === "Super Admin" && currentUser) {
      const { data: actor } = await admin.from("staff").select("role").eq("auth_user_id", currentUser.id).single();
      if (actor?.role === "Super Admin") return { ok: false as const, message: "Super Admin tidak dapat mengedit akun Super Admin lainnya." };
    }
  }

  const result = id ? await updateStaff(id, parsed.data) : await createStaff(parsed.data);
  if (result.error) {
    console.error("Failed to save staff", result.error);
    return { ok: false as const, message: "Data staff gagal disimpan." };
  }
  return { ok: true as const, data: result.data };
}

export async function resetStaffPassword(staffId: string) {
  const supabase = getSupabaseAdminClient();
  const { data: staff, error: staffError } = await supabase.from("staff").select("id, email, auth_user_id").eq("id", staffId).single();
  if (staffError || !staff?.auth_user_id) return { ok: false as const, message: "Akun Auth Staff tidak ditemukan." };
  const { error } = await supabase.auth.admin.updateUserById(staff.auth_user_id, { password: defaultPassword });
  if (error) return { ok: false as const, message: "Password Staff gagal direset." };
  await supabase.from("staff").update({ must_change_password: true }).eq("id", staffId);
  return { ok: true as const, email: staff.email, password: defaultPassword };
}

export async function removeStaff(id: string) {
  const { data: staff } = await getSupabaseAdminClient().from("staff").select("email, role").eq("id", id).single();
  if (staff?.role === "Super Admin" || staff?.email?.toLowerCase() === "muafihimam@mumtazacenter.com") {
    return { ok: false as const, message: "Akun Super Admin utama tidak dapat dihapus." };
  }
  const { error } = await deleteStaff(id);
  if (error) {
    console.error("Failed to delete staff", error);
    return { ok: false as const, message: "Staff gagal dihapus." };
  }
  return { ok: true as const };
}
