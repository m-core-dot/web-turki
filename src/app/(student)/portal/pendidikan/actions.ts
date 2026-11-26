"use server";

import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export type EducationRecord = {
  id: string;
  education_level: string;
  institution_name: string;
  major: string | null;
  school_city: string | null;
  school_province: string | null;
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
  const { data, error } = await getSupabaseAdminClient().from("registrations").select("school, school_city, school_province, major, batch, status").eq("id", id).single();
  if (error) return { data: [] as EducationRecord[], error: error.message };
  if (!data.school) return { data: [] as EducationRecord[], error: null };
  return { data: [{ id: `registration-${id}`, education_level: "Pendidikan terakhir", institution_name: data.school, major: data.major, school_city: data.school_city, school_province: data.school_province, completion_year: data.batch, status: data.status === "approved" ? "verified" : "pending" }] as EducationRecord[], error: null };
}

export async function saveEducation(input: { id?: string; education_level: string; institution_name: string; major?: string; school_city?: string; school_province?: string; completion_year?: number; status?: EducationRecord["status"] }) {
  const id = await participantId();
  if (!id) return { error: "Sesi peserta tidak ditemukan." };
  const admin = getSupabaseAdminClient();
  const payload = { registration_id: id, education_level: input.education_level.trim(), institution_name: input.institution_name.trim(), major: input.major?.trim() || null, school_city: input.school_city?.trim() || null, school_province: input.school_province?.trim() || null, completion_year: input.completion_year || null, status: input.status ?? "pending" };
  if (input.id?.startsWith("registration-")) return { error: "Data pendidikan pendaftaran tidak dapat diubah dari riwayat pendidikan." };
  const query = input.id ? admin.from("participant_education").update(payload).eq("id", input.id).eq("registration_id", id) : admin.from("participant_education").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  const server = await getSupabaseServerClient();
  const { data: { user } } = await server.auth.getUser();
  const { data: registration } = await admin.from("registrations").select("registration_number, full_name").eq("id", id).single();
  await admin.from("audit_logs").insert({ actor_id: user?.id ?? null, actor_name: registration?.full_name ?? user?.email ?? "Peserta", action: input.id ? "Memperbarui riwayat pendidikan" : "Menambahkan riwayat pendidikan", target: registration?.registration_number ?? id, metadata: { type: "participant_education_update", education: payload } });
  return { error: null };
}

export async function deleteEducation(id: string) {
  const registrationId = await participantId();
  if (!registrationId) return { error: "Sesi peserta tidak ditemukan." };
  if (id.startsWith("registration-")) return { error: "Data pendidikan pendaftaran tidak dapat dihapus dari riwayat pendidikan." };
  const admin = getSupabaseAdminClient();
  const { data: education } = await admin.from("participant_education").select("*").eq("id", id).eq("registration_id", registrationId).single();
  const { error } = await admin.from("participant_education").delete().eq("id", id).eq("registration_id", registrationId);
  if (error) return { error: error.message };
  const server = await getSupabaseServerClient();
  const { data: { user } } = await server.auth.getUser();
  const { data: registration } = await admin.from("registrations").select("registration_number, full_name").eq("id", registrationId).single();
  await admin.from("audit_logs").insert({ actor_id: user?.id ?? null, actor_name: registration?.full_name ?? user?.email ?? "Peserta", action: "Menghapus riwayat pendidikan", target: registration?.registration_number ?? registrationId, metadata: { type: "participant_education_delete", education } });
  return { error: null };
}
