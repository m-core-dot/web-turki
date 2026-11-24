"use client";

import { Suspense, useState } from "react";
import { Bell, Menu, ChevronDown } from "lucide-react";
import { StudentSidebar } from "./student-sidebar";
import { Avatar } from "@/components/ui/avatar";

export function StudentShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen bg-background"><Suspense fallback={<div className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-surface lg:block" />}><StudentSidebar isOpen={open} onClose={() => setOpen(false)} /></Suspense><div className="lg:pl-64"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-sm lg:px-8"><button onClick={() => setOpen(true)} className="rounded-lg p-2 text-muted hover:bg-background-alt lg:hidden"><Menu className="h-5 w-5" /></button><div className="hidden text-sm text-muted lg:block">Portal Peserta <span className="mx-2 text-border">/</span> Tahun Ajaran 2026</div><div className="ml-auto flex items-center gap-2"><button className="relative rounded-lg p-2 text-muted hover:bg-background-alt"><Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500" /></button><button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-background-alt"><Avatar name="Ahmad Fadhil Pratama" size="sm" /><span className="hidden text-left md:block"><span className="block text-sm font-medium text-foreground">Ahmad Fadhil</span><span className="block text-xs text-muted">Peserta 2026</span></span><ChevronDown className="hidden h-4 w-4 text-muted md:block" /></button></div></header><main className="px-4 py-6 lg:px-8"><div className="mx-auto max-w-6xl">{children}</div></main></div></div>;
}
