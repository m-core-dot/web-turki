import type { Metadata } from "next";
import { StudentShell } from "@/components/student/student-shell";

export const metadata: Metadata = { title: { default: "Portal Peserta", template: "%s | MTAS" } };

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell>{children}</StudentShell>;
}
