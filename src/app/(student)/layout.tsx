import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { StudentShell } from "@/components/student/student-shell";
import { AuthLoading } from "@/components/shared/auth-loading";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: { default: "Portal Peserta", template: "%s | MTAS" } };

async function StudentContent({ children }: { children: React.ReactNode }) {
  await connection();
  const supabase = await getSupabaseServerClient();
  const [userResult] = await Promise.all([
    supabase.auth.getUser(),
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]);
  const { data: { user } } = userResult;
  if (!user) redirect(`/login?next=${encodeURIComponent("/portal")}`);
  return <StudentShell>{children}</StudentShell>;
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<AuthLoading area="portal" />}><StudentContent>{children}</StudentContent></Suspense>;
}
