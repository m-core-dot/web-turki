"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

export type University = {
  id: string;
  code: string;
  name: string;
  city: string;
  status: "active" | "inactive";
};

export async function fetchUniversities() {
  const { data, error } = await getSupabaseAdminClient()
    .from("universities")
    .select("id, code, name, city, status")
    .order("name", { ascending: true });
  if (error) return { ok: false as const, message: error.message, data: [] as University[] };
  return { ok: true as const, data: (data ?? []) as University[] };
}

export async function saveUniversity(values: { id?: string; code?: string; name: string; city: string; status: "active" | "inactive" }) {
  const supabase = getSupabaseAdminClient();
  const payload = { code: values.code?.trim() || `UNI-${Date.now()}`, name: values.name.trim(), city: values.city.trim(), status: values.status };
  const result = values.id
    ? await supabase.from("universities").update(payload).eq("id", values.id).select("id, code, name, city, status").single()
    : await supabase.from("universities").insert(payload).select("id, code, name, city, status").single();
  if (result.error) return { ok: false as const, message: result.error.message };
  return { ok: true as const, data: result.data as University };
}

export async function deleteUniversity(id: string) {
  const { error } = await getSupabaseAdminClient().from("universities").delete().eq("id", id);
  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const };
}
