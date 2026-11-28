"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { IntakeStatus } from "@/types";

export type IntakeRow = {
  id: string;
  universityId: string;
  university: string;
  city: string;
  name: string;
  openDate: string;
  closeDate: string;
  majors: number;
  status: IntakeStatus;
  isPrimary: boolean;
};

function statusForDates(openDate: string, closeDate: string): IntakeStatus {
  if (!openDate || !closeDate) return "draft";
  const today = new Date().toISOString().slice(0, 10);
  if (today < openDate) return "upcoming";
  if (today > closeDate) return "closed";
  return "open";
}

export async function fetchIntakes() {
  const supabase = getSupabaseAdminClient();
  const [{ data: universities, error: universityError }, { data: intakes, error: intakeError }] = await Promise.all([
    supabase.from("universities").select("id, name, city").eq("status", "active").order("name"),
    supabase.from("intakes").select("id, code, university_id, name, open_date, close_date").order("open_date", { nullsFirst: false }),
  ]);
  if (universityError) return { ok: false as const, message: universityError.message, data: [] as IntakeRow[] };
    if (intakeError) return { ok: false as const, message: intakeError.message, data: [] as IntakeRow[] };

  const rows = await Promise.all((intakes ?? []).map(async (item): Promise<IntakeRow | null> => {
    const university = (universities ?? []).find((entry) => entry.id === item.university_id);
    if (!university) return null;
    const { data: faculties, error: facultyError } = await supabase.from("faculties").select("id").eq("university_id", item.university_id);
    if (facultyError) throw new Error(facultyError.message);
    const facultyIds = (faculties ?? []).map((faculty) => faculty.id);
    let majors = 0;
    if (facultyIds.length) {
      const result = await supabase.from("majors").select("id", { count: "exact", head: true }).in("faculty_id", facultyIds);
      majors = result.count ?? 0;
    }
    const openDate = item.open_date ? String(item.open_date) : "";
    const closeDate = item.close_date ? String(item.close_date) : "";
    return { id: item.code, universityId: item.university_id, university: university.name, city: university.city, name: item.name, openDate, closeDate, majors, status: statusForDates(openDate, closeDate), isPrimary: false };
  }));

  const rowsByUniversity = new Set((intakes ?? []).map((item) => item.university_id));
  const placeholders = await Promise.all((universities ?? []).filter((university) => !rowsByUniversity.has(university.id)).map(async (university) => {
    const { data: faculties } = await supabase.from("faculties").select("id").eq("university_id", university.id);
    const facultyIds = (faculties ?? []).map((faculty) => faculty.id);
    let majors = 0;
    if (facultyIds.length) {
      const result = await supabase.from("majors").select("id", { count: "exact", head: true }).in("faculty_id", facultyIds);
      majors = result.count ?? 0;
    }
    return {
      id: `UNIV-${university.id}`,
      universityId: university.id,
      university: university.name,
            city: university.city,
      name: "Belum ditentukan",
      openDate: "",
      closeDate: "",
      majors,
      status: "draft" as const,
      isPrimary: true,
    };
  }));
  return { ok: true as const, data: [...rows.filter((row): row is IntakeRow => row !== null), ...placeholders] };
}

export async function saveIntake(values: { id?: string; universityId: string; name: string; openDate: string; closeDate: string }) {
  const supabase = getSupabaseAdminClient();
  let code = values.id;
  if (!code) {
    const codeResult = await supabase.rpc("next_intake_code");
    if (codeResult.error) return { ok: false as const, message: codeResult.error.message };
    code = String(codeResult.data);
  }
  const payload = { university_id: values.universityId, name: values.name.trim(), open_date: values.openDate || null, close_date: values.closeDate || null };
  const result = values.id
    ? await supabase.from("intakes").update(payload).eq("code", values.id)
    : await supabase.from("intakes").insert({ code, ...payload });
  if (result.error) return { ok: false as const, message: result.error.message };
  const refreshed = await fetchIntakes();
  if (!refreshed.ok) return refreshed;
  return { ok: true as const, data: refreshed.data.find((item) => item.id === code)! };
}

export async function deleteIntake(code: string) {
  const { error } = await getSupabaseAdminClient().from("intakes").delete().eq("code", code);
  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const };
}
