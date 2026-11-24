import type { Metadata } from "next";
import { PublicShell } from "@/components/public/public-shell";

export const metadata: Metadata = { title: "Mumtaza Turkey Admission System" };

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
