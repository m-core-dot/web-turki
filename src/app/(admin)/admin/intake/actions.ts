"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { MockIntake } from "@/lib/mock-data";

function statusForDates(openDate: string, closeDate: string): MockIntake["status"] {
  if (!openDate || !closeDate) return "draft";
  const today = new Date().toISOString().slice(0, 10);
  if (today < openDate) return "upcoming";
  if (today > closeDate) return "closed";
  return "open";
}

export async function fetchIntakes() {
  const supabase = getSupabaseAdminClient();
  const [{ data: universities, error: universityError }, { data: intakes, error: intakeError }] = await Promise.all([
    supabase.from("universities").select("id, name").eq("status", "active").order("name"),
    supabase.from("intakes").select("id, code, university_id, name, open_date, close_date").order("open_date", { nullsFirst: false }),
  ]);
  if (universityError) return { ok: false as const, message: universityError.message, data: [] as MockIntake[] };
  if (intakeError) return { ok: false as const, message: intakeError.message, data: [] as MockIntake[] };

  const rows = await Promise.all((intakes ?? []).map(async (item) => {
    const university = (universities ?? []).find((entry) => entry.id === item.university_id);
    if (!university) return null;
    const { data: faculties } = await supabase.from("faculties").select("id").eq("university_id", item.university_id);
    const facultyIds = (faculties ?? []).map((faculty) => faculty.id);
    let majors = 0;
    if (facultyIds.length) {
      const result = await supabase.from("majors").select("id", { count: "exact", head: true }).in("faculty_id", facultyIds);
      majors = result.count ?? 0;
    }
    const openDate = item.open_date ? String(item.open_date) : "";
    const closeDate = item.close_date ? String(item.close_date) : "";
    return { id: item.code, university: university.name, name: item.name, openDate, closeDate, majors, status: statusForDates(openDate, closeDate) };
  }));

  const rowsByUniversity = new Set((intakes ?? []).map((item) => item.university_id));
  const placeholders = (universities ?? []).filter((university) => !rowsByUniversity.has(university.id)).map((university) => ({
    id: `UNIV-${university.id}`,
    university: university.name,
    name: "Belum ditentukan",
    openDate: "",
    closeDate: "",
    majors: 0,
    status: "draft" as const,
  }));
  return { ok: true as const, data: [...rows.filter((row): row is MockIntake => row !== null), ...placeholders] };
}

export async function saveIntake(values: { id?: string; universityId: string; name: string; openDate: string; closeDate: string }) {
  const supabase = getSupabaseAdminClient();
  if (values.id) return { ok: false as const, message: "Edit intake belum tersedia." };
  const { data: code, error: codeError } = await supabase.rpc("next_intake_code");
  if (codeError) return { ok: false as const, message: codeError.message };
  const { error } = await supabase.from("intakes").insert({ code, university_id: values.universityId, name: values.name.trim(), open_date: values.openDate || null, close_date: values.closeDate || null });
  if (error) return { ok: false as const, message: error.message };
  const result = await fetchIntakes();
  if (!result.ok) return result;
  return { ok: true as const, data: result.data.find((item) => item.id === code)! };
}
