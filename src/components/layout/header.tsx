"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronDown, LogOut, UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getCurrentStaffProfile, updateCurrentStaffProfile } from "./header-actions";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("—");
  const [profileEmail, setProfileEmail] = useState("—");
  const [profileRole, setProfileRole] = useState("—");
  const [profileGender, setProfileGender] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileJobRole, setProfileJobRole] = useState("");
  const [profileStatus, setProfileStatus] = useState("active");
  const [profileSaving, setProfileSaving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void getCurrentStaffProfile().then((profile) => {
      if (!profile) return;
      setProfileName(profile.name);
      setProfileEmail(profile.email);
      setProfileRole(profile.department);
      setProfileGender(profile.gender);
      setProfilePhone(profile.phone);
      setProfileAddress(profile.address);
      setProfileJobRole(profile.role);
      setProfileStatus(profile.status);
    });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const logout = useCallback(async () => {
    setMenuOpen(false);
    await getSupabaseBrowserClient().auth.signOut();
    toast({ title: "Berhasil keluar", description: "Anda telah keluar dari akun.", variant: "success" });
    router.replace("/login");
    router.refresh();
  }, [router]);

  return (
    <>
    <header className="sticky top-0 z-30 flex h-[var(--header-height)] items-center border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            type="button"
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
          <button type="button" aria-label="Buka notifikasi" className="relative rounded-lg p-2 text-muted hover:bg-background-alt hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500" />
          </button>

          {/* User menu */}
          <div ref={menuRef} className="relative">
            <button type="button" aria-label={`Buka menu akun ${profileName}`} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-background-alt">
              <Avatar name={profileName} size="sm" />
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-foreground">{profileName}</p>
                <p className="text-xs text-muted">{profileRole}</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted md:block" />
            </button>
            {menuOpen && <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-surface p-2 shadow-dropdown">
              <div className="border-b border-border px-3 py-2"><p className="text-sm font-medium text-foreground">{profileName}</p><p className="text-xs text-muted">{profileEmail}</p></div>
              <button type="button" onClick={() => { setProfileOpen(true); setMenuOpen(false); }} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-background-alt"><UserRound className="h-4 w-4" />Edit profile</button>
              <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger-600 hover:bg-danger-50"><LogOut className="h-4 w-4" />Keluar</button>
            </div>}
          </div>
        </div>
      </div>
    </header>
    <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} title="Edit profile" description="Perbarui data pribadi Anda. Departemen, role, dan status dikelola melalui halaman Staff." footer={<><Button variant="outline" onClick={() => setProfileOpen(false)}>Batal</Button><Button isLoading={profileSaving} onClick={async () => {
      setProfileSaving(true);
      const result = await updateCurrentStaffProfile({ name: profileName, email: profileEmail, gender: profileGender, phone: profilePhone, address: profileAddress, department: profileRole, role: profileJobRole, status: profileStatus });
      setProfileSaving(false);
      if (!result.ok) { toast({ title: "Profil gagal diperbarui", description: result.message, variant: "warning" }); return; }
      setProfileOpen(false);
      toast({ title: "Profil diperbarui", description: "Data pribadi berhasil disimpan.", variant: "success" });
    }}>Simpan</Button></>}>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nama lengkap" value={profileName} onChange={(event) => setProfileName(event.target.value)} />
          <Input label="Jenis kelamin" value={profileGender} onChange={(event) => setProfileGender(event.target.value)} />
          <Input label="Email login" type="email" value={profileEmail} readOnly />
          <Input label="Nomor telepon" value={profilePhone} onChange={(event) => setProfilePhone(event.target.value)} />
          <div className="sm:col-span-2">
            <Input label="Alamat" value={profileAddress} onChange={(event) => setProfileAddress(event.target.value)} />
          </div>
        </div>
        <div className="border-t border-border pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Informasi pekerjaan</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Departemen" value={profileRole} readOnly />
            <Input label="Role" value={profileJobRole} readOnly />
            <Input label="Status" value={profileStatus === "active" ? "Aktif" : "Nonaktif"} readOnly />
          </div>
        </div>
      </div>
    </Dialog>
    </>
  );
}
