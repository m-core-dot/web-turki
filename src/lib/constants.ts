export const APP_NAME = "MTAS";
export const APP_FULL_NAME = "Mumtaza Turkey Admission System";
export const APP_DESCRIPTION =
  "Platform manajemen pendaftaran mahasiswa Indonesia ke universitas di Turki";

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" as const },
  { label: "Intake", href: "/admin/intake", icon: "Calendar" as const },
  { label: "Aplikasi", href: "/admin/aplikasi", icon: "Send" as const },
  { label: "Alumni", href: "/admin/alumni", icon: "Users" as const },
  { label: "Keuangan", href: "/admin/keuangan", icon: "Wallet" as const },
  { label: "Notifikasi", href: "/admin/notifikasi", icon: "Bell" as const },
  { label: "Audit Log", href: "/admin/audit-log", icon: "ScrollText" as const },
] as const;

export const ADMIN_ADMISSION_NAV_ITEMS = [
  { label: "Registrasi", href: "/admin/registrasi", icon: "UserPlus" as const },
  { label: "Peserta", href: "/admin/peserta", icon: "Users" as const },
  { label: "Dokumen", href: "/admin/dokumen", icon: "FileText" as const },
] as const;

export const ADMIN_UNIVERSITY_NAV_ITEMS = [
  {
    label: "Universitas",
    href: "/admin/universitas",
    icon: "GraduationCap" as const,
  },
  { label: "Fakultas dan Jurusan", href: "/admin/jurusan", icon: "BookOpen" as const },
] as const;

export const ADMIN_SYSTEM_NAV_ITEMS = [
  {
    label: "Manajemen Pengguna",
    href: "/admin/pengguna",
    icon: "UserCog" as const,
  },
  {
    label: "Role & Permission",
    href: "/admin/pengaturan/role-permission",
    icon: "Shield" as const,
  },
  { label: "Notifikasi", href: "/admin/notifikasi", icon: "Bell" as const },
  { label: "Audit Log", href: "/admin/audit-log", icon: "ScrollText" as const },
] as const;

export const STUDENT_NAV_ITEMS = [
  { label: "Dashboard", href: "/portal", icon: "LayoutDashboard" as const },
  { label: "Biodata", href: "/portal/biodata", icon: "User" as const },
  {
    label: "Pendidikan",
    href: "/portal/pendidikan",
    icon: "BookOpen" as const,
  },
  { label: "Dokumen", href: "/portal/dokumen", icon: "FileText" as const },
  {
    label: "Universitas",
    href: "/portal/universitas",
    icon: "GraduationCap" as const,
  },
  { label: "Aplikasi", href: "/portal/aplikasi", icon: "Send" as const },
  { label: "Pembayaran", href: "/portal/pembayaran", icon: "Wallet" as const },
  {
    label: "Pengaturan",
    href: "/portal/pengaturan",
    icon: "Settings" as const,
  },
] as const;
