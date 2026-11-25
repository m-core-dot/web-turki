"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_ADMISSION_NAV_ITEMS, ADMIN_NAV_ITEMS, APP_NAME } from "@/lib/constants";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  FileText,
  GraduationCap,
  Calendar,
  Send,
  Wallet,
  Bell,
  ScrollText,
  Settings,
  Building2,
  BookOpen,
  ChevronDown,
  ClipboardList,
  X,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  UserPlus,
  Users,
  FileText,
  GraduationCap,
  Calendar,
  Send,
  Wallet,
  Bell,
  ScrollText,
  Settings,
  Building2,
  BookOpen,
  ChevronDown,
  ClipboardList,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[var(--sidebar-width)] flex-col border-r border-border bg-surface transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo area */}
        <div className="flex h-[var(--header-height)] items-center justify-between border-b border-border px-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700 text-xs font-bold text-white">
              M
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-foreground">
                {APP_NAME}
              </span>
              <span className="ml-1.5 text-xs text-muted">Admin</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-background-alt hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {ADMIN_NAV_ITEMS.slice(0, 1).map((item) => {
              const Icon = iconMap[item.icon];
              return <li key={item.href}><Link href={item.href} onClick={onClose} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", pathname === "/admin" ? "bg-primary-50 text-primary-700" : "text-muted hover:bg-background-alt hover:text-foreground")}>{Icon && <Icon className="h-[18px] w-[18px] shrink-0" />}{item.label}</Link></li>;
            })}
            <li className="pt-3"><button type="button" className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted" aria-expanded="true"><span className="flex items-center gap-2"><ClipboardList className="h-4 w-4" />Admission</span><ChevronDown className="h-4 w-4" /></button><ul className="mt-1 space-y-1 border-l border-border pl-2">{ADMIN_ADMISSION_NAV_ITEMS.map((item) => { const Icon = iconMap[item.icon]; const isActive = pathname.startsWith(item.href); return <li key={item.href}><Link href={item.href} onClick={onClose} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", isActive ? "bg-primary-50 text-primary-700" : "text-muted hover:bg-background-alt hover:text-foreground")}>{Icon && <Icon className="h-[18px] w-[18px] shrink-0" />}{item.label}</Link></li>; })}</ul></li>
            {ADMIN_NAV_ITEMS.slice(1).map((item) => { const Icon = iconMap[item.icon]; const isActive = pathname.startsWith(item.href); return <li key={item.href}><Link href={item.href} onClick={onClose} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", isActive ? "bg-primary-50 text-primary-700" : "text-muted hover:bg-background-alt hover:text-foreground")}>{Icon && <Icon className="h-[18px] w-[18px] shrink-0" />}{item.label}</Link></li>; })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Mumtaza Center
          </p>
        </div>
      </aside>
    </>
  );
}
