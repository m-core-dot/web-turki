"use client";

import { Suspense, useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Suspense fallback={<div className="fixed inset-y-0 left-0 hidden w-[var(--sidebar-width)] border-r border-border bg-surface lg:block" />}><Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
            /></Suspense>

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-[var(--sidebar-width)]">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 py-6 lg:px-6">
          <div className="mx-auto max-w-[var(--content-max-width)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
