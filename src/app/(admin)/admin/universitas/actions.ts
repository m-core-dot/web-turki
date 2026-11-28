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

export async function saveUniversity(values: { id?: string; name: string; city: string; status: "active" | "inactive" }) {
  const supabase = getSupabaseAdminClient();
  const details = { name: values.name.trim(), city: values.city.trim(), status: values.status };
  let result;
  if (values.id) {
    result = await supabase.from("universities").update(details).eq("id", values.id).select("id, code, name, city, status").single();
  } else {
    const codeResult = await supabase.rpc("next_university_code");
    if (codeResult.error) return { ok: false as const, message: codeResult.error.message };
    result = await supabase.from("universities").insert({ code: codeResult.data, ...details }).select("id, code, name, city, status").single();
  }
  if (result.error) return { ok: false as const, message: result.error.message };
  return { ok: true as const, data: result.data as University };
}

export async function deleteUniversity(id: string) {
  const { error } = await getSupabaseAdminClient().from("universities").delete().eq("id", id);
  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const };
}
