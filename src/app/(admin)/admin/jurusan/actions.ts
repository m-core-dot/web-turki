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

export async function createFacultyMajor(values: { name: string; universityId: string; faculty: string; degree: string; status: "active" | "inactive" }) {
  const supabase = getSupabaseAdminClient();
  const { data: faculty, error: facultyError } = await supabase
    .from("faculties")
    .select("id")
    .eq("university_id", values.universityId)
    .eq("name", values.faculty)
    .maybeSingle();
  if (facultyError) throw new Error(facultyError.message);

  let facultyId = faculty?.id;
  if (!facultyId) {
    const { data: code, error: codeError } = await supabase.rpc("next_faculty_code");
    if (codeError) throw new Error(`Gagal membuat kode fakultas: ${codeError.message}`);
    const { data: createdFaculty, error: insertFacultyError } = await supabase
      .from("faculties")
      .insert({ university_id: values.universityId, code, name: values.faculty, status: values.status })
      .select("id")
      .single();
    if (insertFacultyError) throw new Error(insertFacultyError.message);
    facultyId = createdFaculty.id;
  }

  const { data: majorCode, error: majorCodeError } = await supabase.rpc("next_major_code");
  if (majorCodeError) throw new Error(`Gagal membuat kode jurusan: ${majorCodeError.message}`);
  const { error: majorError } = await supabase.from("majors").insert({
    faculty_id: facultyId,
    code: majorCode,
    name: values.name,
    degree: values.degree,
    status: values.status,
  });
  if (majorError) throw new Error(majorError.message);
  return { ok: true as const };
}

export async function importFacultyMajors(rows: Array<{ name: string; universityId: string; faculty: string; degree: string; status: "active" | "inactive" }>) {
  for (const row of rows) {
    await createFacultyMajor(row);
  }
  return { ok: true as const, count: rows.length };
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
