"use server";

import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export type EducationRecord = {
  id: string;
  education_level: string;
  institution_name: string;
  major: string | null;
  completion_year: number | null;
  status: "verified" | "in_progress" | "pending";
};

async function participantId() {
  const server = await getSupabaseServerClient();
  const { data: { user } } = await server.auth.getUser();
  if (!user) return null;
  const { data } = await getSupabaseAdminClient().from("registrations").select("id").eq("auth_user_id", user.id).maybeSingle();
  return data?.id ?? null;
}

export async function getEducation() {
  const id = await participantId();
  if (!id) return { data: [] as EducationRecord[], error: "Sesi peserta tidak ditemukan." };
  const { data, error } = await getSupabaseAdminClient().from("participant_education").select("id, education_level, institution_name, major, completion_year, status").eq("registration_id", id).order("completion_year", { ascending: false, nullsFirst: false });
  return { data: (data ?? []) as EducationRecord[], error: error?.message ?? null };
}

export async function saveEducation(input: { id?: string; education_level: string; institution_name: string; major?: string; completion_year?: number; status?: EducationRecord["status"] }) {
  const id = await participantId();
  if (!id) return { error: "Sesi peserta tidak ditemukan." };
  const admin = getSupabaseAdminClient();
  const payload = { registration_id: id, education_level: input.education_level.trim(), institution_name: input.institution_name.trim(), major: input.major?.trim() || null, completion_year: input.completion_year || null, status: input.status ?? "pending" };
  const query = input.id ? admin.from("participant_education").update(payload).eq("id", input.id).eq("registration_id", id) : admin.from("participant_education").insert(payload);
  const { error } = await query;
  return { error: error?.message ?? null };
}

export async function deleteEducation(id: string) {
  const registrationId = await participantId();
  if (!registrationId) return { error: "Sesi peserta tidak ditemukan." };
  const { error } = await getSupabaseAdminClient().from("participant_education").delete().eq("id", id).eq("registration_id", registrationId);
  return { error: error?.message ?? null };
}
