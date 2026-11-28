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

async function generateFallbackCode(table: "faculties" | "majors", prefix: "FAC" | "MJR") {
  const { data, error } = await getSupabaseAdminClient().from(table).select("code").like("code", `${prefix}-%`).order("code", { ascending: false }).limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  const current = Number(String(data?.code ?? "").replace(`${prefix}-`, "")) || 0;
  return `${prefix}-${String(current + 1).padStart(3, "0")}`;
}

async function nextCode(table: "faculties" | "majors", prefix: "FAC" | "MJR", rpcName: "next_faculty_code" | "next_major_code") {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.rpc(rpcName);
  if (!error && data) return String(data);
  if (error && !error.message.toLowerCase().includes("could not find the function")) throw new Error(error.message);
  return generateFallbackCode(table, prefix);
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
    let code: string;
    try {
      code = await nextCode("faculties", "FAC", "next_faculty_code");
    } catch (codeError) {
      throw new Error(`Gagal membuat kode fakultas: ${codeError instanceof Error ? codeError.message : "kode tidak tersedia"}`);
    }
    const { data: createdFaculty, error: insertFacultyError } = await supabase
      .from("faculties")
      .insert({ university_id: values.universityId, code, name: values.faculty, status: values.status })
      .select("id")
      .single();
    if (insertFacultyError) throw new Error(insertFacultyError.message);
    facultyId = createdFaculty.id;
  }

  let majorCode: string;
  try {
    majorCode = await nextCode("majors", "MJR", "next_major_code");
  } catch (codeError) {
    throw new Error(`Gagal membuat kode jurusan: ${codeError instanceof Error ? codeError.message : "kode tidak tersedia"}`);
  }
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
