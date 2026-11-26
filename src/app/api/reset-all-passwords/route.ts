import { NextResponse } from "next/server";
import { getSupabaseAdminClient, defaultPassword } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  if (secret !== "mtas-reset-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  const results: { email: string; status: string }[] = [];

  // List all auth users
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ perPage: 100 });
  if (listError || !users) {
    return NextResponse.json({ error: "Failed to list users", detail: listError?.message }, { status: 500 });
  }

  for (const user of users) {
    const { error } = await supabase.auth.admin.updateUserById(user.id, { password: defaultPassword });
    results.push({
      email: user.email ?? user.id,
      status: error ? `FAILED: ${error.message}` : "OK",
    });
  }

  // Set must_change_password on all staff
  await supabase.from("staff").update({ must_change_password: true }).neq("id", "");
  // Set must_change_password on all registrations that have auth
  await supabase.from("registrations").update({ must_change_password: true }).not("auth_user_id", "is", null);

  return NextResponse.json({
    total: users.length,
    defaultPassword,
    results,
  });
}
