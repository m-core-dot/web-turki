"use server";

import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export type ParticipantBiodata = {
  registration_number: string;
  program_level: string;
  full_name: string;
  email: string;
  nik: string | null;
  passport_number: string | null;
  birth_place: string | null;
  birth_date: string | null;
  gender: string | null;
  whatsapp_phone: string | null;
  telegram_username: string | null;
  father_name: string | null;
  father_phone: string | null;
  mother_name: string | null;
  mother_phone: string | null;
  address: string | null;
  rt_rw: string | null;
  village: string | null;
  district: string | null;
  regency: string | null;
  province: string | null;
  postal_code: string | null;
  school: string | null;
  school_city: string | null;
  school_province: string | null;
  major: string | null;
  preferences: string[] | null;
  source: string | null;
  batch: number;
  status: string;
};

type EditableBiodata = Omit<ParticipantBiodata, "registration_number" | "program_level" | "full_name" | "email" | "nik" | "batch" | "status" | "school" | "school_city" | "school_province" | "major" | "source" | "preferences"> & { preferences: string[] };

async function getParticipantContext() {
  const { data: { user } } = await (await getSupabaseServerClient()).auth.getUser();
  if (!user) return null;
  const { data } = await getSupabaseAdminClient().from("registrations").select("id, registration_number, full_name").eq("auth_user_id", user.id).maybeSingle();
  return data ? { user, registration: data } : null;
}

export async function getParticipantBiodata() {
  const context = await getParticipantContext();
  if (!context) return { data: null, error: "Sesi peserta tidak ditemukan." };
  const id = context.registration.id;
  const { data, error } = await getSupabaseAdminClient().from("registrations").select("registration_number, program_level, full_name, email, nik, passport_number, birth_place, birth_date, gender, whatsapp_phone, telegram_username, father_name, father_phone, mother_name, mother_phone, address, rt_rw, village, district, regency, province, postal_code, school, school_city, school_province, major, preferences, source, batch, status").eq("id", id).single();
  return { data: data as ParticipantBiodata | null, error: error?.message ?? null };
}

export async function updateParticipantBiodata(input: EditableBiodata) {
  const context = await getParticipantContext();
  if (!context) return { error: "Sesi peserta tidak ditemukan." };
  const { preferences, ...fields } = input;
  const admin = getSupabaseAdminClient();
  const { error } = await admin.from("registrations").update({ ...fields, preferences }).eq("id", context.registration.id);
  if (error) return { error: error.message };
  const changedFields = Object.keys(fields).filter((field) => fields[field as keyof typeof fields] !== null && fields[field as keyof typeof fields] !== "");
  const { error: auditError } = await admin.from("audit_logs").insert({ actor_id: context.user.id, actor_name: context.registration.full_name, action: `Memperbarui biodata peserta (${changedFields.join(", ") || "tidak ada perubahan"})`, target: context.registration.registration_number });
  if (auditError) return { error: `Biodata tersimpan, tetapi audit log gagal dibuat: ${auditError.message}` };
  return { error: null };
}
