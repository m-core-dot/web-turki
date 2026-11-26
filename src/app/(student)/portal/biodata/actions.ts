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

async function getParticipantId() {
  const { data: { user } } = await (await getSupabaseServerClient()).auth.getUser();
  if (!user) return null;
  const { data } = await getSupabaseAdminClient().from("registrations").select("id").eq("auth_user_id", user.id).maybeSingle();
  return data?.id ?? null;
}

export async function getParticipantBiodata() {
  const id = await getParticipantId();
  if (!id) return { data: null, error: "Sesi peserta tidak ditemukan." };
  const { data, error } = await getSupabaseAdminClient().from("registrations").select("registration_number, program_level, full_name, email, nik, passport_number, birth_place, birth_date, gender, whatsapp_phone, telegram_username, father_name, father_phone, mother_name, mother_phone, address, rt_rw, village, district, regency, province, postal_code, school, school_city, school_province, major, preferences, source, batch, status").eq("id", id).single();
  return { data: data as ParticipantBiodata | null, error: error?.message ?? null };
}

export async function updateParticipantBiodata(input: EditableBiodata) {
  const id = await getParticipantId();
  if (!id) return { error: "Sesi peserta tidak ditemukan." };
  const { preferences, ...fields } = input;
  const { error } = await getSupabaseAdminClient().from("registrations").update({ ...fields, preferences }).eq("id", id);
  return { error: error?.message ?? null };
}
