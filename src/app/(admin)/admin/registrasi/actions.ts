"use server";

import { createRegistration, listRegistrations, registrationInputSchema } from "@/lib/registrations";

export async function submitRegistration(input: unknown) {
  const parsed = registrationInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, message: "Data registrasi tidak valid." };

  const { data, error } = await createRegistration(parsed.data);
  if (error) {
    if (error.code === "23505") return { ok: false as const, message: "NIK atau nomor registrasi sudah terdaftar." };
    console.error("Failed to create registration", error);
    return { ok: false as const, message: "Registrasi gagal disimpan. Coba lagi." };
  }

  return { ok: true as const, data };
}

export async function fetchRegistrations() {
  const { data, error } = await listRegistrations();
  if (error) {
    console.error("Failed to list registrations", error);
    return { ok: false as const, message: "Data registrasi gagal dimuat." };
  }
  return { ok: true as const, data: data ?? [] };
}
