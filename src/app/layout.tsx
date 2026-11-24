import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
