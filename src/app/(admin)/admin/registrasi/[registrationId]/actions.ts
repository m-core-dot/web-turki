"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function fetchRegistration(id: string) {
  const { data, error } = await getSupabaseServerClient()
    .from("registrations")
    .select("*")
    .eq("registration_number", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch registration", error);
    return { ok: false as const, message: "Detail registrasi gagal dimuat." };
  }
  if (!data) return { ok: false as const, message: "Registrasi tidak ditemukan." };
  return { ok: true as const, data };
}
