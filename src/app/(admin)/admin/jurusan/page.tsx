"use client";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";

export default function JurusanPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fakultas dan Jurusan"
        description="Kelola program studi berdasarkan fakultas dan universitas."
      />
      <DataTable
        data={[]}
        keyExtractor={() => "empty"}
        searchPlaceholder="Cari nama jurusan..."
        searchable={false}
        filters={[]}
        columns={[]}
      />
    </div>
  );
}
