import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const staffInputSchema = z.object({
  name: z.string().trim().min(1),
  gender: z.enum(["LAKI-LAKI", "PEREMPUAN"]),
  phone: z.string().trim().min(1),
  address: z.string().trim().min(1),
  department: z.string().trim().min(1),
  role: z.string().trim().min(1),
  status: z.enum(["active", "inactive"]),
});

export type StaffInput = z.infer<typeof staffInputSchema>;

export async function listStaff() {
  return getSupabaseServerClient()
    .from("staff")
    .select("id, name, gender, phone, address, department, role, status")
    .order("created_at", { ascending: false });
}

export async function createStaff(input: StaffInput) {
  const parsed = staffInputSchema.parse(input);
  return getSupabaseServerClient()
    .from("staff")
    .insert(parsed)
    .select("id, name, gender, phone, address, department, role, status")
    .single();
}

export async function updateStaff(id: string, input: StaffInput) {
  const parsed = staffInputSchema.parse(input);
  return getSupabaseServerClient()
    .from("staff")
    .update(parsed)
    .eq("id", id)
    .select("id, name, gender, phone, address, department, role, status")
    .single();
}

export async function deleteStaff(id: string) {
  return getSupabaseServerClient().from("staff").delete().eq("id", id);
}
