"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { MockIntake } from "@/lib/mock-data";

function statusForDates(openDate: string, closeDate: string): MockIntake["status"] {
  const today = new Date().toISOString().slice(0, 10);
  if (today < openDate) return "upcoming";
  if (today > closeDate) return "closed";
  return "open";
}

export async function fetchIntakes() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("intakes").select("id, code, name, open_date, close_date, universities!inner(name)").order("open_date");
  if (error) return { ok: false as const, message: error.message, data: [] as MockIntake[] };
  const rows = await Promise.all((data ?? []).map(async (item) => {
    const university = item.universities as unknown as { name: string };
    const { data: faculties } = await supabase.from("faculties").select("id").eq("university_id", (item as { university_id?: string }).university_id ?? "");
    const facultyIds = (faculties ?? []).map((faculty) => faculty.id);
    let majors = 0;
    if (facultyIds.length) {
      const result = await supabase.from("majors").select("id", { count: "exact", head: true }).in("faculty_id", facultyIds);
      majors = result.count ?? 0;
    }
    const openDate = String(item.open_date);
    const closeDate = String(item.close_date);
    return { id: item.code, university: university.name, name: item.name, openDate, closeDate, majors, status: statusForDates(openDate, closeDate) };
  }));
  return { ok: true as const, data: rows };
}

export async function saveIntake(values: { id?: string; universityId: string; name: string; openDate: string; closeDate: string }) {
  const supabase = getSupabaseAdminClient();
  if (values.id) return { ok: false as const, message: "Edit intake belum tersedia." };
  const { data: code, error: codeError } = await supabase.rpc("next_intake_code");
  if (codeError) return { ok: false as const, message: codeError.message };
  const { error } = await supabase.from("intakes").insert({ code, university_id: values.universityId, name: values.name.trim(), open_date: values.openDate, close_date: values.closeDate });
  if (error) return { ok: false as const, message: error.message };
  const result = await fetchIntakes();
  if (!result.ok) return result;
  return { ok: true as const, data: result.data.find((item) => item.id === code)! };
}
