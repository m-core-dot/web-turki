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
    if (error.code === "23505" || error.code === "NIK_ACTIVE") return { ok: false as const, message: error.message };
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
  if (status === "approved") {
    const { approveRegistration } = await import("./[registrationId]/actions");
    const result = await approveRegistration(registrationNumber);
    if (!result.ok) return result;
    return { ok: true as const };
  }
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

const participantDataFields = [
  "full_name", "email", "whatsapp_phone", "birth_place", "birth_date", "gender", "passport_number", "nik", "telegram_username",
  "father_name", "father_phone", "mother_name", "mother_phone", "address", "rt_rw", "village", "district", "regency", "province", "postal_code",
  "school", "school_city", "school_province", "major", "program_level", "source", "preferences",
] as const;

function hasValue(value: unknown) {
  return Array.isArray(value) ? value.length > 0 : Boolean(String(value ?? "").trim());
}

export async function fetchParticipantCompleteness(registrationNumbers: string[]) {
  if (registrationNumbers.length === 0) return { ok: true as const, data: {} as Record<string, number> };
  const supabase = getSupabaseAdminClient();
  const [{ data: registrations, error: registrationError }, { data: documents, error: documentError }] = await Promise.all([
    supabase.from("registrations").select("*").in("registration_number", registrationNumbers),
    supabase.from("participant_documents").select("registration_number, document_type, file_name").in("registration_number", registrationNumbers),
  ]);
  if (registrationError) return { ok: false as const, message: registrationError.message };
  if (documentError) return { ok: false as const, message: documentError.message };

  const requiredDocuments = 7;
  const documentCounts = (documents ?? []).reduce<Record<string, Set<string>>>((result, document) => {
    if (document.file_name) (result[document.registration_number] ??= new Set()).add(document.document_type);
    return result;
  }, {});
  const registrationMap = new Map((registrations ?? []).map((registration) => [registration.registration_number, registration]));
  return {
    ok: true as const,
    data: Object.fromEntries(registrationNumbers.map((number) => {
      const registration = registrationMap.get(number);
      const participantCount = participantDataFields.filter((field) => hasValue(registration?.[field])).length;
      const documentTypes = documentCounts[number] ?? new Set<string>();
      const proofUploaded = Boolean(registration?.proof_file_name || registration?.proof_drive_file_id || registration?.proof_drive_url || registration?.proof_storage_path);
      if (proofUploaded) documentTypes.add("Bukti pendaftaran");
      const documentScore = Math.round((Math.min(documentTypes.size, requiredDocuments) / requiredDocuments) * 50);
      const participantScore = Math.round((participantCount / participantDataFields.length) * 50);
      return [number, documentScore + participantScore];
    })),
  };
}

export async function fetchRegistrations() {
  const { data, error } = await listRegistrations();
  if (error) {
    console.error("Failed to list registrations", error);
    return { ok: false as const, message: `Data registrasi gagal dimuat: ${error.message}` };
  }
  return { ok: true as const, data: data ?? [] };
}
