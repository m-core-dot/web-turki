"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const links = [
  { label: "Tentang", href: "/tentang" },
  { label: "Universitas", href: "/universitas" },
  { label: "Alur Pendaftaran", href: "/alur-pendaftaran" },
  { label: "FAQ", href: "/faq" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-700 text-sm font-bold text-white shadow-xs">M</span>
          <span className="text-base font-bold tracking-tight text-foreground">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-muted transition-colors hover:text-primary-700">{link.label}</Link>)}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground">Masuk</Link>
          <Link href="/registrasi" className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary-700 px-3 text-sm font-medium text-white shadow-xs transition-colors hover:bg-primary-800">Mulai Daftar <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <button className="rounded-lg p-2 text-muted hover:bg-background-alt md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Buka menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && <div className="border-t border-border bg-surface px-5 py-4 md:hidden"><nav className="flex flex-col gap-1">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-background-alt hover:text-foreground">{link.label}</Link>)}<div className="mt-3 flex gap-2 border-t border-border pt-3"><Link href="/login" className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-foreground">Masuk</Link><Link href="/registrasi" className="flex flex-1 items-center justify-center rounded-lg bg-primary-700 px-3 py-2 text-sm font-medium text-white">Mulai Daftar</Link></div></nav></div>}
    </header>
  );
}
