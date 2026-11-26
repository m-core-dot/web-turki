import { LockKeyhole, ShieldCheck } from "lucide-react";

export function AuthLoading({ area }: { area: "admin" | "portal" }) {
  const label = area === "admin" ? "dashboard admin" : "portal peserta";
  return (
    <main className="auth-loading" aria-live="polite" aria-busy="true">
      <div className="auth-loading__glow" />
      <div className="auth-loading__grid" />
      <section className="auth-loading__card">
        <div className="auth-loading__brand">
          <div className="auth-loading__mark"><LockKeyhole size={20} strokeWidth={2.5} /></div>
          <span>MTAS</span>
        </div>
        <div className="auth-loading__spinner" aria-hidden="true"><span /></div>
        <p className="auth-loading__eyebrow">SECURE ACCESS</p>
        <h1>Memverifikasi pengguna<span className="auth-loading__ellipsis">...</span></h1>
        <p>Memeriksa sesi Anda sebelum membuka {label}. Mohon tunggu sebentar.</p>
        <div className="auth-loading__status"><ShieldCheck size={16} /><span>Sesi aman sedang diperiksa</span><i /></div>
        <div className="auth-loading__progress" aria-hidden="true"><span /></div>
      </section>
    </main>
  );
}
