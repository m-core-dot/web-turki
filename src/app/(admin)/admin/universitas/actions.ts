"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

export type University = {
  id: string;
  code: string;
  name: string;
  city: string;
  status: "active" | "inactive";
  faculties: number;
  majors: number;
  intakes: number;
};

export async function fetchUniversities() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("universities")
    .select("id, code, name, city, status")
    .order("name", { ascending: true });
  if (error) return { ok: false as const, message: error.message, data: [] as University[] };
  const universities = await Promise.all((data ?? []).map(async (university) => {
    const { count: faculties, error: facultyError } = await supabase.from("faculties").select("id", { count: "exact", head: true }).eq("university_id", university.id);
    if (facultyError) throw new Error(facultyError.message);
    const { data: facultyRows, error: majorFacultyError } = await supabase.from("faculties").select("id").eq("university_id", university.id);
    if (majorFacultyError) throw new Error(majorFacultyError.message);
    const facultyIds = (facultyRows ?? []).map((faculty) => faculty.id);
    let majors = 0;
    if (facultyIds.length > 0) {
      const { count, error: majorError } = await supabase.from("majors").select("id", { count: "exact", head: true }).in("faculty_id", facultyIds);
      if (majorError) throw new Error(majorError.message);
      majors = count ?? 0;
    }
    return { ...university, faculties: faculties ?? 0, majors, intakes: 0 } as University;
  }));
  return { ok: true as const, data: universities };
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
