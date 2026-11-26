"use server";

import { createRegistration, listRegistrations, registrationInputSchema } from "@/lib/registrations";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

function getDatabaseErrorMessage(error: { code?: string; message?: string } | null) {
  if (error?.code === "22008") return "Format tanggal lahir tidak valid. Gunakan format YYYY-MM-DD atau DD/MM/YYYY.";
  if (error?.code === "23505") return "NIK atau nomor registrasi sudah terdaftar.";
  return error?.message || "Gagal menyimpan ke database.";
}

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

export async function validateRegistrations(inputs: unknown[]) {
  return inputs.map((input, index) => {
    const parsed = registrationInputSchema.safeParse(input);
    if (parsed.success) return { row: index + 2, valid: true as const, errors: [] };
    return { row: index + 2, valid: false as const, errors: parsed.error.issues.map((issue) => `${issue.path.join(".") || "data"}: ${issue.message}`) };
  });
}

export async function importRegistrations(inputs: unknown[]) {
  const results = [];
  const errors: Array<{ row: number; messages: string[] }> = [];
  for (const [index, input] of inputs.entries()) {
    const parsed = registrationInputSchema.safeParse(input);
    if (!parsed.success) {
      errors.push({ row: index + 2, messages: parsed.error.issues.map((issue) => `${issue.path.join(".") || "data"}: ${issue.message}`) });
      continue;
    }
    const result = await createRegistration(parsed.data);
    if (result.data) results.push(result.data);
    else errors.push({ row: index + 2, messages: [getDatabaseErrorMessage(result.error)] });
  }
  return { ok: true as const, count: results.length, errors };
}

export async function updateRegistrationStatus(registrationNumber: string, status: "approved" | "rejected") {
  const { error } = await getSupabaseAdminClient()
    .from("registrations")
    .update({ status })
    .eq("registration_number", registrationNumber);

  if (error) {
    console.error("Failed to update registration status", error);
    return { ok: false as const, message: "Status registrasi gagal diperbarui." };
  }

  return { ok: true as const };
}

export async function fetchParticipantCompleteness(registrationNumbers: string[]) {
  if (registrationNumbers.length === 0) return { ok: true as const, data: {} as Record<string, number> };
  const { data, error } = await getSupabaseAdminClient()
    .from("participant_documents")
    .select("registration_number, file_name")
    .in("registration_number", registrationNumbers);
  if (error) return { ok: false as const, message: error.message };
  const requiredDocuments = 7;
  const counts = (data ?? []).reduce<Record<string, number>>((result, document) => {
    if (document.file_name) result[document.registration_number] = (result[document.registration_number] ?? 0) + 1;
    return result;
  }, {});
  return { ok: true as const, data: Object.fromEntries(registrationNumbers.map((number) => [number, Math.round(((counts[number] ?? 0) / requiredDocuments) * 50)])) };
}

export async function fetchRegistrations() {
  const { data, error } = await listRegistrations();
  if (error) {
    console.error("Failed to list registrations", error);
    return { ok: false as const, message: `Data registrasi gagal dimuat: ${error.message}` };
  }
  return { ok: true as const, data: data ?? [] };
}
