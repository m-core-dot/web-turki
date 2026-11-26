"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
  metadata: { type?: string; changes?: Array<{ field: string; label: string; before: string; after: string }> };
};

export async function fetchAuditLogs() {
  const { data, error } = await getSupabaseAdminClient()
    .from("audit_logs")
    .select("id, actor_name, action, target, created_at, metadata")
    .order("created_at", { ascending: false });

  if (error) return { ok: false as const, message: "Audit log gagal dimuat.", data: [] as AuditLog[] };

  return {
    ok: true as const,
    data: (data ?? []).map((item) => ({
      id: item.id,
      actor: item.actor_name,
      action: item.action,
      target: item.target,
      createdAt: item.created_at,
      metadata: item.metadata ?? {},
    })),
  };
}
