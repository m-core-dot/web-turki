import { Badge } from "@/components/ui/badge";
import {
  registrationStatusConfig,
  documentStatusConfig,
  applicationStatusConfig,
  paymentStatusConfig,
} from "@/lib/mock-data";
import type { RegistrationStatus, DocumentStatus, ApplicationStatus, PaymentStatus } from "@/types";

type Status = RegistrationStatus | DocumentStatus | ApplicationStatus | PaymentStatus;

export function StatusBadge({ status }: { status: Status }) {
  const config =
    status in registrationStatusConfig
      ? registrationStatusConfig[status as RegistrationStatus]
      : status in documentStatusConfig
        ? documentStatusConfig[status as DocumentStatus]
        : status in applicationStatusConfig
          ? applicationStatusConfig[status as ApplicationStatus]
          : paymentStatusConfig[status as PaymentStatus];
  return <Badge variant={config.variant} dot>{config.label}</Badge>;
}
