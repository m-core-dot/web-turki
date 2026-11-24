import { Settings, Shield, Bell, UserCog } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

const settings = [
  { title: "Profil Organisasi", description: "Nama, logo, dan informasi Mumtaza Center.", icon: UserCog },
  { title: "Role & Permission", description: "Kelola akses dan hak pengguna admin.", icon: Shield },
  { title: "Notifikasi", description: "Atur template dan preferensi notifikasi.", icon: Bell },
  { title: "Konfigurasi Sistem", description: "Pengaturan umum aplikasi MTAS.", icon: Settings },
];

export default function PengaturanPage() {
  return <div className="space-y-6"><PageHeader title="Pengaturan" description="Kelola konfigurasi dan preferensi sistem." /><div className="grid gap-4 sm:grid-cols-2">{settings.map((setting) => { const Icon = setting.icon; return <Card key={setting.title} className="cursor-pointer transition-shadow hover:shadow-dropdown"><div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50"><Icon className="h-5 w-5 text-primary-700" /></div><div><CardTitle>{setting.title}</CardTitle><CardDescription className="mt-1">{setting.description}</CardDescription></div></div></Card>; })}</div></div>;
}
