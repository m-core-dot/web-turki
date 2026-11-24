"use client";

import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[var(--header-height)] items-center border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-muted hover:bg-background-alt hover:text-foreground lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari peserta, registrasi..."
                className="h-9 w-72 rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-muted hover:bg-background-alt hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500" />
          </button>

          {/* User menu */}
          <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-background-alt">
            <Avatar name="Admin MTAS" size="sm" />
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-foreground">Admin MTAS</p>
              <p className="text-xs text-muted">Super Admin</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted md:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
