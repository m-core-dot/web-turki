import { NotFoundState } from "@/components/shared/state-views";

export default function AdminNotFound() {
  return <NotFoundState backHref="/admin" label="Kembali ke dashboard" />;
}
