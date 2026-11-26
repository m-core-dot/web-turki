import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { AuthLoading } from "@/components/shared/auth-loading";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

async function AdminContent({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const [userResult] = await Promise.all([
    supabase.auth.getUser(),
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]);
  const { data: { user } } = userResult;
  if (!user) redirect(`/login?next=${encodeURIComponent("/admin")}`);
  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<AuthLoading area="admin" />}><AdminContent>{children}</AdminContent></Suspense>;
}
