"use server";

import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export type ParticipantBiodata = {
  full_name: string;
  nik: string | null;
  birth_place: string | null;
  birth_date: string | null;
  gender: string | null;
  whatsapp_phone: string | null;
  address: string | null;
  regency: string | null;
  province: string | null;
  postal_code: string | null;
  source_other: string | null;
};

async function getParticipantId() {
  const { data: { user } } = await (await getSupabaseServerClient()).auth.getUser();
  if (!user) return null;
  const { data } = await getSupabaseAdminClient().from("registrations").select("id").eq("auth_user_id", user.id).maybeSingle();
  return data?.id ?? null;
}

export async function getParticipantBiodata() {
  const id = await getParticipantId();
  if (!id) return { data: null, error: "Sesi peserta tidak ditemukan." };
  const { data, error } = await getSupabaseAdminClient().from("registrations").select("full_name, nik, birth_place, birth_date, gender, whatsapp_phone, address, regency, province, postal_code, source_other").eq("id", id).single();
  return { data: data as ParticipantBiodata | null, error: error?.message ?? null };
}

export async function updateParticipantBiodata(input: Omit<ParticipantBiodata, "full_name" | "nik">) {
  const id = await getParticipantId();
  if (!id) return { error: "Sesi peserta tidak ditemukan." };
  const { error } = await getSupabaseAdminClient().from("registrations").update({ birth_place: input.birth_place?.trim() || null, birth_date: input.birth_date || null, gender: input.gender || null, whatsapp_phone: input.whatsapp_phone?.trim() || null, address: input.address?.trim() || null, regency: input.regency?.trim() || null, province: input.province?.trim() || null, postal_code: input.postal_code?.trim() || null, source_other: input.source_other?.trim() || null }).eq("id", id);
  return { error: error?.message ?? null };
}
