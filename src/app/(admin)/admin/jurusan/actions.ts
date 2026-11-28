"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

export type FacultyMajor = {
  id: string;
  code: string;
  name: string;
  faculty: string;
  university: string;
  degree: string;
  status: "active" | "inactive";
  type: "faculty" | "major";
};

export async function fetchUniversitiesForMajorForm() {
  const { data, error } = await getSupabaseAdminClient().from("universities").select("id, name, city").eq("status", "active").order("name");
  if (error) return { ok: false as const, message: error.message, data: [] as Array<{ id: string; name: string; city: string }> };
  return { ok: true as const, data: data ?? [] };
}

export async function fetchFacultyMajors() {
  const { data, error } = await getSupabaseAdminClient()
    .from("majors")
    .select("id, code, name, degree, status, faculties!inner(name, universities!inner(name))")
    .order("name");
  if (error) return { ok: false as const, message: error.message, data: [] as FacultyMajor[] };
  return {
    ok: true as const,
    data: (data ?? []).map((item) => {
      const faculty = item.faculties as unknown as { name: string; universities: { name: string } };
      return { id: item.id, code: item.code, name: item.name, degree: item.degree, status: item.status, faculty: faculty.name, university: faculty.universities.name, type: "major" as const };
    }),
  };
}
