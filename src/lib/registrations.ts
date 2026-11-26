import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const registrationInputSchema = z.object({
  values: z.record(z.string(), z.string()),
  source: z.string().trim().min(1),
  sourceOther: z.string().trim().optional().default(""),
});

export type RegistrationInput = z.infer<typeof registrationInputSchema>;

export type RegistrationRecord = {
  id: string;
  registration_number: string;
  full_name: string;
  email: string;
  whatsapp_phone: string;
  batch: number;
  status: string;
  submitted_at: string;
};

function normalizeDate(value: string) {
  const date = value.trim();
  const dayFirstMatch = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/.exec(date);
  if (dayFirstMatch) {
    const [, day, month, year] = dayFirstMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return date;
}

export async function listRegistrations() {
  const supabase = getSupabaseAdminClient();
  return supabase
    .from("registrations")
    .select("id, registration_number, full_name, email, whatsapp_phone, batch, status, submitted_at")
    .order("submitted_at", { ascending: false });
}

export async function createRegistration(input: RegistrationInput, payment?: { amount: number; uniqueCode: number; proofFileName: string; proofStoragePath: string; proofDriveFileId?: string; proofDriveUrl?: string }) {
  const parsed = registrationInputSchema.parse(input);
  const values = parsed.values;
  const nik = values.nik.trim();
  const existing = await getSupabaseAdminClient()
    .from("registrations")
    .select("status")
    .eq("nik", nik)
    .neq("status", "rejected")
    .maybeSingle();
  if (existing.error) return { data: null, error: existing.error };
  if (existing.data) return { data: null, error: { code: "NIK_ACTIVE", message: existing.data.status === "approved" ? "NIK sudah terdaftar dan registrasinya telah disetujui." : "NIK sudah terdaftar dan registrasinya masih menunggu review." } };

  const preferences = ["One", "Two", "Three", "Four", "Five"]
    .map((suffix) => values[`preference${suffix}`]?.trim())
    .filter((value): value is string => Boolean(value));

  const payload = {
    program_level: values.programLevel,
    full_name: values.fullName.trim(),
    birth_place: values.birthPlace.trim(),
    birth_date: values.birthDate ? normalizeDate(values.birthDate) : null,
    gender: values.gender || null,
    passport_number: values.passport?.trim() || null,
    nik: values.nik.trim(),
    telegram_username: values.telegram?.trim() || null,
    email: values.email.trim().toLowerCase(),
    whatsapp_phone: values.phone.trim(),
    father_name: values.fatherName.trim(),
    father_phone: values.fatherPhone?.trim() || null,
    mother_name: values.motherName.trim(),
    mother_phone: values.motherPhone.trim(),
    address: values.address.trim(),
    rt_rw: values.rtRw?.trim() || null,
    village: values.village.trim(),
    district: values.district.trim(),
    regency: values.regency.trim(),
    province: values.province.trim(),
    postal_code: values.postalCode.trim(),
    school: values.school.trim(),
    school_city: values.schoolCity.trim(),
    school_province: values.schoolProvince.trim(),
    major: values.major?.trim() || null,
    preferences,
    source: parsed.source,
    source_other: parsed.source === "Lainnya" ? parsed.sourceOther : null,
    batch: new Date().getFullYear(),
    ...(payment ? { payment_amount: payment.amount, payment_unique_code: payment.uniqueCode, payment_status: "proof_submitted", proof_file_name: payment.proofFileName, proof_storage_path: payment.proofStoragePath, ...(payment.proofDriveFileId ? { proof_drive_file_id: payment.proofDriveFileId } : {}), ...(payment.proofDriveUrl ? { proof_drive_url: payment.proofDriveUrl } : {}), payment_submitted_at: new Date().toISOString() } : {}),
  };

  return getSupabaseAdminClient().from("registrations").insert(payload).select("id, registration_number").single();
}
