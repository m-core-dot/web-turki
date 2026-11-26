import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const staffInputSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  gender: z.enum(["LAKI-LAKI", "PEREMPUAN"]),
  phone: z.string().trim().min(1),
  address: z.string().trim().min(1),
  department: z.string().trim().min(1),
  role: z.string().trim().min(1),
  status: z.enum(["active", "inactive"]),
});

export type StaffInput = z.infer<typeof staffInputSchema>;

export async function listStaff() {
  return getSupabaseAdminClient()
    .from("staff")
    .select("id, auth_user_id, name, email, gender, phone, address, department, role, status")
    .order("created_at", { ascending: true });
}

export async function createStaff(input: StaffInput) {
  const parsed = staffInputSchema.parse(input);
  const supabase = getSupabaseAdminClient();
  const email = parsed.email.toLowerCase();
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({ email, password: `Masistur2019-${crypto.randomUUID().replace(/-/g, "").slice(0, 6)}`, email_confirm: true });
  if (authError || !authUser.user) return { data: null, error: authError ?? new Error("Akun staff gagal dibuat.") };
  return supabase
    .from("staff")
    .insert({ ...parsed, auth_user_id: authUser.user.id })
    .select("id, name, email, gender, phone, address, department, role, status")
    .single();
}

export async function updateStaff(id: string, input: StaffInput) {
  const parsed = staffInputSchema.parse(input);
  return getSupabaseAdminClient()
    .from("staff")
    .update(parsed)
    .eq("id", id)
    .select("id, auth_user_id, name, email, gender, phone, address, department, role, status")
    .single();
}

export async function deleteStaff(id: string) {
  return getSupabaseAdminClient().from("staff").delete().eq("id", id);
}
