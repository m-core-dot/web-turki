export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
        fieldErrors?: Record<string, string[]>;
      };
    };

export type UserRole =
  | "super_admin"
  | "admin_registration"
  | "admin_documents"
  | "admin_university"
  | "finance"
  | "student";

export type RegistrationStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "needs_revision";

export type DocumentStatus =
  | "not_uploaded"
  | "pending_review"
  | "approved"
  | "needs_revision"
  | "rejected";

export type IntakeStatus =
  | "draft"
  | "upcoming"
  | "open"
  | "closed"
  | "cancelled";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "waitlisted"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "waiting_verification"
  | "verified"
  | "rejected"
  | "partial"
  | "cancelled";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
