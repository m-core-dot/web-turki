"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false);
  return <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5 py-16"><div className="w-full rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8"><Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" />Kembali ke beranda</Link><div className="mt-8"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-700 text-sm font-bold text-white">M</div><h1 className="mt-6 text-2xl font-bold text-foreground">Selamat datang kembali</h1><p className="mt-2 text-sm text-muted">Masuk untuk memantau proses pendaftaranmu.</p></div>{submitted && <div className="mt-5 rounded-lg bg-info-50 p-3 text-sm text-info-700">Login belum terhubung ke autentikasi. Ini masih tampilan preview.</div>}<form className="mt-7 space-y-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}><Input label="Email" type="email" placeholder="nama@email.com" required /><Input label="Password" type="password" placeholder="Masukkan password" required /><div className="flex justify-end"><button type="button" className="text-sm font-medium text-primary-700 hover:underline">Lupa password?</button></div><Button type="submit" className="w-full"><LogIn className="h-4 w-4" />Masuk</Button></form><p className="mt-6 text-center text-sm text-muted">Belum punya akun? <Link href="/registrasi" className="font-medium text-primary-700 hover:underline">Mulai registrasi</Link></p></div></div>;
}
