import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MTAS — Mumtaza Turkey Admission System",
    template: "%s | MTAS",
  },
  description:
    "Platform manajemen pendaftaran mahasiswa Indonesia ke universitas di Turki oleh Mumtaza Center",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
