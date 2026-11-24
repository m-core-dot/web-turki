import type {
  RegistrationStatus,
  DocumentStatus,
  ApplicationStatus,
  PaymentStatus,
  IntakeStatus,
} from "@/types";

// ─── Stat Cards ───
export interface DashboardStat {
  label: string;
  value: number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
}

export const mockStats: DashboardStat[] = [
  {
    label: "Total Registrasi",
    value: 248,
    change: "+12 bulan ini",
    changeType: "positive",
    icon: "UserPlus",
  },
  {
    label: "Menunggu Review",
    value: 18,
    change: "5 baru hari ini",
    changeType: "neutral",
    icon: "Clock",
  },
  {
    label: "Dokumen Perlu Diperiksa",
    value: 34,
    change: "-8 dari kemarin",
    changeType: "positive",
    icon: "FileSearch",
  },
  {
    label: "Aplikasi Berjalan",
    value: 86,
    change: "12 universitas",
    changeType: "neutral",
    icon: "GraduationCap",
  },
];

// ─── Recent Registrations ───
export interface RecentRegistration {
  id: string;
  name: string;
  email: string;
  date: string;
  status: RegistrationStatus;
  batch: string;
}

export const mockRecentRegistrations: RecentRegistration[] = [
  {
    id: "REG-2026-001",
    name: "Ahmad Fadhil Pratama",
    email: "ahmad.fadhil@email.com",
    date: "2026-11-24",
    status: "pending_review",
    batch: "2026",
  },
  {
    id: "REG-2026-002",
    name: "Siti Nurhaliza Putri",
    email: "siti.nur@email.com",
    date: "2026-11-23",
    status: "pending_review",
    batch: "2026",
  },
  {
    id: "REG-2026-003",
    name: "Muhammad Rizki Ramadhan",
    email: "m.rizki@email.com",
    date: "2026-11-22",
    status: "approved",
    batch: "2026",
  },
  {
    id: "REG-2026-004",
    name: "Fatimah Azzahra",
    email: "fatimah.az@email.com",
    date: "2026-11-21",
    status: "needs_revision",
    batch: "2026",
  },
  {
    id: "REG-2026-005",
    name: "Yusuf Abdurrahman",
    email: "yusuf.abd@email.com",
    date: "2026-11-20",
    status: "approved",
    batch: "2026",
  },
];

// ─── Recent Activities ───
export interface RecentActivity {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  type: "registration" | "document" | "application" | "payment" | "system";
}

export const mockRecentActivities: RecentActivity[] = [
  {
    id: "act-1",
    actor: "Admin Yuni",
    action: "menyetujui registrasi",
    target: "Muhammad Rizki Ramadhan",
    time: "5 menit lalu",
    type: "registration",
  },
  {
    id: "act-2",
    actor: "Ahmad Fadhil",
    action: "mengunggah dokumen",
    target: "Paspor",
    time: "12 menit lalu",
    type: "document",
  },
  {
    id: "act-3",
    actor: "Admin Budi",
    action: "memperbarui status aplikasi",
    target: "Fatimah Azzahra — Istanbul University",
    time: "1 jam lalu",
    type: "application",
  },
  {
    id: "act-4",
    actor: "Admin Yuni",
    action: "menolak revisi dokumen",
    target: "Siti Nurhaliza — Ijazah",
    time: "2 jam lalu",
    type: "document",
  },
  {
    id: "act-5",
    actor: "Finance Rina",
    action: "memverifikasi pembayaran",
    target: "Yusuf Abdurrahman — Rp 15.000.000",
    time: "3 jam lalu",
    type: "payment",
  },
];

// ─── Document Overview ───
export interface DocumentOverview {
  type: string;
  total: number;
  approved: number;
  pending: number;
  needsRevision: number;
}

export const mockDocumentOverview: DocumentOverview[] = [
  { type: "Foto", total: 180, approved: 142, pending: 24, needsRevision: 14 },
  { type: "Paspor", total: 165, approved: 120, pending: 30, needsRevision: 15 },
  { type: "KTP", total: 190, approved: 160, pending: 20, needsRevision: 10 },
  { type: "Ijazah", total: 155, approved: 110, pending: 28, needsRevision: 17 },
  { type: "Transkrip", total: 148, approved: 100, pending: 32, needsRevision: 16 },
];

// ─── Application Status Summary ───
export interface ApplicationSummary {
  university: string;
  total: number;
  submitted: number;
  underReview: number;
  accepted: number;
  rejected: number;
}

export const mockApplicationSummary: ApplicationSummary[] = [
  {
    university: "Istanbul University",
    total: 24,
    submitted: 8,
    underReview: 10,
    accepted: 4,
    rejected: 2,
  },
  {
    university: "Ankara University",
    total: 18,
    submitted: 5,
    underReview: 8,
    accepted: 3,
    rejected: 2,
  },
  {
    university: "Sakarya University",
    total: 22,
    submitted: 10,
    underReview: 7,
    accepted: 4,
    rejected: 1,
  },
  {
    university: "Bursa Uludağ University",
    total: 12,
    submitted: 4,
    underReview: 5,
    accepted: 2,
    rejected: 1,
  },
  {
    university: "Marmara University",
    total: 10,
    submitted: 3,
    underReview: 4,
    accepted: 2,
    rejected: 1,
  },
];

// ─── Status helpers ───
export const registrationStatusConfig: Record<
  RegistrationStatus,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }
> = {
  pending_review: { label: "Menunggu Review", variant: "warning" },
  approved: { label: "Disetujui", variant: "success" },
  rejected: { label: "Ditolak", variant: "danger" },
  needs_revision: { label: "Perlu Revisi", variant: "info" },
};

export const documentStatusConfig: Record<
  DocumentStatus,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }
> = {
  not_uploaded: { label: "Belum Diunggah", variant: "default" },
  pending_review: { label: "Menunggu Review", variant: "warning" },
  approved: { label: "Disetujui", variant: "success" },
  needs_revision: { label: "Perlu Revisi", variant: "info" },
  rejected: { label: "Ditolak", variant: "danger" },
};

export const applicationStatusConfig: Record<
  ApplicationStatus,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }
> = {
  draft: { label: "Draft", variant: "default" },
  submitted: { label: "Dikirim", variant: "info" },
  under_review: { label: "Sedang Direview", variant: "warning" },
  accepted: { label: "Diterima", variant: "success" },
  rejected: { label: "Ditolak", variant: "danger" },
  waitlisted: { label: "Waitlist", variant: "warning" },
  cancelled: { label: "Dibatalkan", variant: "default" },
};

export const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }
> = {
  unpaid: { label: "Belum Bayar", variant: "default" },
  waiting_verification: { label: "Menunggu Verifikasi", variant: "warning" },
  verified: { label: "Terverifikasi", variant: "success" },
  rejected: { label: "Ditolak", variant: "danger" },
  partial: { label: "Sebagian", variant: "info" },
  cancelled: { label: "Dibatalkan", variant: "default" },
};

// --- Admin preview datasets ---
export interface MockRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  batch: string;
  submittedAt: string;
  status: RegistrationStatus;
}

export const mockRegistrations: MockRegistration[] = [
  { id: "REG-2026-001", name: "Ahmad Fadhil Pratama", email: "ahmad.fadhil@email.com", phone: "0812 3456 7890", batch: "2026", submittedAt: "24 Nov 2026", status: "pending_review" },
  { id: "REG-2026-002", name: "Siti Nurhaliza Putri", email: "siti.nur@email.com", phone: "0813 4567 8901", batch: "2026", submittedAt: "23 Nov 2026", status: "pending_review" },
  { id: "REG-2026-003", name: "Muhammad Rizki Ramadhan", email: "m.rizki@email.com", phone: "0821 2345 6789", batch: "2026", submittedAt: "22 Nov 2026", status: "approved" },
  { id: "REG-2026-004", name: "Fatimah Azzahra", email: "fatimah.az@email.com", phone: "0857 8901 2345", batch: "2026", submittedAt: "21 Nov 2026", status: "needs_revision" },
  { id: "REG-2026-005", name: "Yusuf Abdurrahman", email: "yusuf.abd@email.com", phone: "0811 2233 4455", batch: "2026", submittedAt: "20 Nov 2026", status: "approved" },
];

export interface MockStudent {
  id: string;
  name: string;
  email: string;
  registration: string;
  completeness: number;
  applications: number;
  status: "active" | "incomplete";
}

export const mockStudents: MockStudent[] = [
  { id: "STD-001", name: "Ahmad Fadhil Pratama", email: "ahmad.fadhil@email.com", registration: "2026", completeness: 92, applications: 2, status: "active" },
  { id: "STD-002", name: "Siti Nurhaliza Putri", email: "siti.nur@email.com", registration: "2026", completeness: 68, applications: 1, status: "incomplete" },
  { id: "STD-003", name: "Muhammad Rizki Ramadhan", email: "m.rizki@email.com", registration: "2026", completeness: 100, applications: 3, status: "active" },
  { id: "STD-004", name: "Fatimah Azzahra", email: "fatimah.az@email.com", registration: "2026", completeness: 76, applications: 2, status: "active" },
  { id: "STD-005", name: "Yusuf Abdurrahman", email: "yusuf.abd@email.com", registration: "2025", completeness: 88, applications: 2, status: "active" },
];

export interface MockDocument {
  id: string;
  student: string;
  type: string;
  uploadedAt: string;
  version: string;
  status: DocumentStatus;
}

export const mockDocuments: MockDocument[] = [
  { id: "DOC-001", student: "Ahmad Fadhil Pratama", type: "Paspor", uploadedAt: "24 Nov 2026", version: "v2", status: "pending_review" },
  { id: "DOC-002", student: "Siti Nurhaliza Putri", type: "Ijazah", uploadedAt: "23 Nov 2026", version: "v1", status: "needs_revision" },
  { id: "DOC-003", student: "Muhammad Rizki Ramadhan", type: "Transkrip", uploadedAt: "22 Nov 2026", version: "v1", status: "approved" },
  { id: "DOC-004", student: "Fatimah Azzahra", type: "KTP", uploadedAt: "21 Nov 2026", version: "v2", status: "pending_review" },
  { id: "DOC-005", student: "Yusuf Abdurrahman", type: "Foto", uploadedAt: "20 Nov 2026", version: "v1", status: "approved" },
];

export interface MockFaculty { id: string; name: string; university: string; majors: number; status: "active" | "inactive"; }
export const mockFaculties: MockFaculty[] = [
  { id: "FAC-001", name: "Faculty of Engineering", university: "Istanbul University", majors: 8, status: "active" },
  { id: "FAC-002", name: "Faculty of Economics", university: "Ankara University", majors: 6, status: "active" },
  { id: "FAC-003", name: "Faculty of Communication", university: "Sakarya University", majors: 4, status: "active" },
  { id: "FAC-004", name: "Faculty of Architecture", university: "Bursa Uludağ University", majors: 3, status: "inactive" },
  { id: "FAC-005", name: "Faculty of Medicine", university: "Marmara University", majors: 2, status: "active" },
];

export interface MockMajor { id: string; name: string; faculty: string; university: string; degree: "Bachelor" | "Master"; status: "active" | "inactive"; }
export const mockMajors: MockMajor[] = [
  { id: "MJR-001", name: "Computer Engineering", faculty: "Faculty of Engineering", university: "Istanbul University", degree: "Bachelor", status: "active" },
  { id: "MJR-002", name: "Industrial Engineering", faculty: "Faculty of Engineering", university: "Istanbul University", degree: "Bachelor", status: "active" },
  { id: "MJR-003", name: "Business Administration", faculty: "Faculty of Economics", university: "Ankara University", degree: "Bachelor", status: "active" },
  { id: "MJR-004", name: "International Relations", faculty: "Faculty of Economics", university: "Ankara University", degree: "Bachelor", status: "active" },
  { id: "MJR-005", name: "Architecture", faculty: "Faculty of Architecture", university: "Bursa Uludağ University", degree: "Bachelor", status: "inactive" },
  { id: "MJR-006", name: "Data Science", faculty: "Faculty of Engineering", university: "Istanbul University", degree: "Master", status: "active" },
];

export interface MockUniversity { id: string; name: string; city: string; faculties: number; intakes: number; status: "active" | "inactive"; }
export const mockUniversities: MockUniversity[] = [
  { id: "UNI-001", name: "Istanbul University", city: "Istanbul", faculties: 8, intakes: 2, status: "active" },
  { id: "UNI-002", name: "Ankara University", city: "Ankara", faculties: 7, intakes: 2, status: "active" },
  { id: "UNI-003", name: "Sakarya University", city: "Sakarya", faculties: 6, intakes: 1, status: "active" },
  { id: "UNI-004", name: "Bursa Uludag University", city: "Bursa", faculties: 5, intakes: 1, status: "active" },
  { id: "UNI-005", name: "Marmara University", city: "Istanbul", faculties: 9, intakes: 2, status: "inactive" },
];

export interface MockIntake { id: string; university: string; name: string; openDate: string; closeDate: string; majors: number; status: IntakeStatus; }
export const mockIntakes: MockIntake[] = [
  { id: "INT-001", university: "Istanbul University", name: "Fall 2027", openDate: "01 Dec 2026", closeDate: "31 Mar 2027", majors: 18, status: "upcoming" },
  { id: "INT-002", university: "Ankara University", name: "Spring 2027", openDate: "01 Nov 2026", closeDate: "15 Jan 2027", majors: 14, status: "open" },
  { id: "INT-003", university: "Sakarya University", name: "Fall 2026", openDate: "01 Jun 2026", closeDate: "30 Sep 2026", majors: 12, status: "closed" },
  { id: "INT-004", university: "Bursa Uludag University", name: "Fall 2027", openDate: "15 Dec 2026", closeDate: "15 Apr 2027", majors: 10, status: "upcoming" },
];

export interface MockApplication { id: string; student: string; university: string; major: string; submittedAt: string; status: ApplicationStatus; }
export const mockApplications: MockApplication[] = [
  { id: "APP-001", student: "Ahmad Fadhil Pratama", university: "Istanbul University", major: "Computer Engineering", submittedAt: "24 Nov 2026", status: "under_review" },
  { id: "APP-002", student: "Siti Nurhaliza Putri", university: "Ankara University", major: "International Relations", submittedAt: "23 Nov 2026", status: "submitted" },
  { id: "APP-003", student: "Muhammad Rizki Ramadhan", university: "Sakarya University", major: "Business Administration", submittedAt: "22 Nov 2026", status: "accepted" },
  { id: "APP-004", student: "Fatimah Azzahra", university: "Marmara University", major: "Architecture", submittedAt: "21 Nov 2026", status: "rejected" },
  { id: "APP-005", student: "Yusuf Abdurrahman", university: "Ankara University", major: "Medicine", submittedAt: "20 Nov 2026", status: "under_review" },
];

export interface MockPayment { id: string; student: string; category: string; amount: string; dueDate: string; status: PaymentStatus; }
export const mockPayments: MockPayment[] = [
  { id: "PAY-001", student: "Ahmad Fadhil Pratama", category: "Biaya Pendampingan", amount: "Rp 15.000.000", dueDate: "30 Nov 2026", status: "waiting_verification" },
  { id: "PAY-002", student: "Siti Nurhaliza Putri", category: "Biaya Administrasi", amount: "Rp 2.500.000", dueDate: "15 Dec 2026", status: "unpaid" },
  { id: "PAY-003", student: "Muhammad Rizki Ramadhan", category: "Biaya Pendampingan", amount: "Rp 15.000.000", dueDate: "20 Nov 2026", status: "verified" },
  { id: "PAY-004", student: "Fatimah Azzahra", category: "Biaya Pendampingan", amount: "Rp 15.000.000", dueDate: "25 Nov 2026", status: "partial" },
];

export const mockNotifications = [
  { id: "NTF-001", recipient: "Ahmad Fadhil Pratama", template: "Dokumen diterima", channel: "WhatsApp", sentAt: "24 Nov 2026, 14:30", status: "sent" },
  { id: "NTF-002", recipient: "Siti Nurhaliza Putri", template: "Revisi dokumen", channel: "WhatsApp", sentAt: "23 Nov 2026, 10:15", status: "sent" },
  { id: "NTF-003", recipient: "Fatimah Azzahra", template: "Status aplikasi", channel: "WhatsApp", sentAt: "22 Nov 2026, 16:40", status: "failed" },
];

export const mockAuditLogs = [
  { id: "AUD-001", actor: "Admin Yuni", action: "Menyetujui registrasi", target: "REG-2026-003", time: "24 Nov 2026, 14:25" },
  { id: "AUD-002", actor: "Admin Budi", action: "Memperbarui status aplikasi", target: "APP-003", time: "24 Nov 2026, 13:10" },
  { id: "AUD-003", actor: "Finance Rina", action: "Memverifikasi pembayaran", target: "PAY-003", time: "24 Nov 2026, 11:45" },
  { id: "AUD-004", actor: "Admin Dokumen", action: "Menyetujui dokumen", target: "DOC-003", time: "23 Nov 2026, 16:20" },
];
