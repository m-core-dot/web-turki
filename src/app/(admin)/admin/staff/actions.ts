"use server";

import { createStaff, deleteStaff, listStaff, staffInputSchema, updateStaff } from "@/lib/staff";

export async function fetchStaff() {
  const { data, error } = await listStaff();
  if (error) {
    console.error("Failed to list staff", error);
    return { ok: false as const, message: "Data staff gagal dimuat." };
  }
  return { ok: true as const, data: data ?? [] };
}

export async function saveStaff(input: unknown, id?: string) {
  const parsed = staffInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "Data staff tidak valid." };
  const result = id ? await updateStaff(id, parsed.data) : await createStaff(parsed.data);
  if (result.error) {
    console.error("Failed to save staff", result.error);
    return { ok: false as const, message: "Data staff gagal disimpan." };
  }
  return { ok: true as const, data: result.data };
}

export async function removeStaff(id: string) {
  const { error } = await deleteStaff(id);
  if (error) {
    console.error("Failed to delete staff", error);
    return { ok: false as const, message: "Staff gagal dihapus." };
  }
  return { ok: true as const };
}
