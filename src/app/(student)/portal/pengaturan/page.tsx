"use client";

import { Bell, Lock, UserCog } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

const sections = [{ title: "Profil akun", description: "Kelola nama dan email akunmu.", icon: UserCog }, { title: "Keamanan", description: "Ubah password dan kelola sesi masuk.", icon: Lock }, { title: "Notifikasi", description: "Atur preferensi pemberitahuan proses aplikasi.", icon: Bell }];
export default function PengaturanStudentPage() { return <div className="space-y-6"><PageHeader title="Pengaturan" description="Kelola akun dan preferensi portal peserta." /><div className="grid gap-4 sm:grid-cols-3">{sections.map(({ title, description, icon: Icon }) => <Card key={title} className="hover:border-primary-200"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50"><Icon className="h-5 w-5 text-primary-700" /></div><CardTitle className="mt-4">{title}</CardTitle><CardDescription className="mt-1">{description}</CardDescription></Card>)}</div><Card><h2 className="font-semibold">Informasi akun</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><Input label="Nama" defaultValue="Ahmad Fadhil Pratama" /><Input label="Email" defaultValue="ahmad.fadhil@email.com" disabled /></div><div className="mt-6 flex justify-end border-t border-border pt-5"><Button onClick={() => toast({ title: "Perubahan tersimpan", variant: "success" })}>Simpan Perubahan</Button></div></Card></div>; }
