import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AdminShell } from "@/components/layout/admin-shell";
import { AuthLoading } from "@/components/shared/auth-loading";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

async function AdminContent({ children }: { children: React.ReactNode }) {
  await connection();
  const supabase = await getSupabaseServerClient();
  const [userResult] = await Promise.all([
    supabase.auth.getUser(),
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]);
  const { data: { user } } = userResult;
  if (!user) redirect(`/login?next=${encodeURIComponent("/admin")}`);

  const { data: staff } = await getSupabaseAdminClient()
    .from("staff")
    .select("id, status")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (!staff || staff.status !== "active") redirect("/portal");

  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<AuthLoading area="admin" />}><AdminContent>{children}</AdminContent></Suspense>;
}
