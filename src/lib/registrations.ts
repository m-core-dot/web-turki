import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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

export async function listRegistrations() {
  const supabase = getSupabaseServerClient();
  return supabase
    .from("registrations")
    .select("id, registration_number, full_name, email, whatsapp_phone, batch, status, submitted_at")
    .order("submitted_at", { ascending: false });
}

export async function createRegistration(input: RegistrationInput) {
  const parsed = registrationInputSchema.parse(input);
  const values = parsed.values;
  const preferences = ["One", "Two", "Three", "Four", "Five"]
    .map((suffix) => values[`preference${suffix}`]?.trim())
    .filter((value): value is string => Boolean(value));

  const payload = {
    program_level: values.programLevel,
    full_name: values.fullName.trim(),
    birth_place: values.birthPlace.trim(),
    birth_date: values.birthDate || null,
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
  };

  return getSupabaseServerClient().from("registrations").insert(payload).select("id, registration_number").single();
}
