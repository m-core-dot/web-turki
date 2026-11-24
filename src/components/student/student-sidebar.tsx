"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, User, BookOpen, FileText, GraduationCap, Send,
  Wallet, Settings, X, LogOut, type LucideIcon,
} from "lucide-react";

const items = [
  ["Dashboard", "/portal", LayoutDashboard],
  ["Biodata", "/portal/biodata", User],
  ["Pendidikan", "/portal/pendidikan", BookOpen],
  ["Dokumen", "/portal/dokumen", FileText],
  ["Universitas", "/portal/universitas", GraduationCap],
  ["Aplikasi", "/portal/aplikasi", Send],
  ["Pembayaran", "/portal/pembayaran", Wallet],
  ["Pengaturan", "/portal/pengaturan", Settings],
] as const satisfies ReadonlyArray<readonly [string, string, LucideIcon]>;

export function StudentSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return <><div className={cn("fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden", !isOpen && "hidden")} onClick={onClose} /><aside className={cn("fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform lg:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full")}><div className="flex h-16 items-center justify-between border-b border-border px-5"><Link href="/portal" className="flex items-center gap-2.5" onClick={onClose}><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700 text-xs font-bold text-white">M</span><div><span className="text-sm font-bold text-foreground">MTAS</span><span className="ml-1 text-xs text-muted">Portal</span></div></Link><button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-background-alt lg:hidden"><X className="h-5 w-5" /></button></div><nav className="flex-1 space-y-1 px-3 py-4">{items.map(([label, href, Icon]) => { const active = href === "/portal" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} onClick={onClose} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-primary-50 text-primary-700" : "text-muted hover:bg-background-alt hover:text-foreground")}><Icon className="h-[18px] w-[18px]" />{label}</Link>; })}</nav><div className="border-t border-border p-4"><Link href="/" className="flex items-center gap-2 px-2 text-sm text-muted hover:text-foreground"><LogOut className="h-4 w-4" />Keluar portal</Link></div></aside></>;
}
