"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableFilter } from "@/components/shared/data-table";

interface AdminTablePageProps<T> {
  title: string;
  description: string;
  action?: ReactNode;
  data: T[];
  filters?: DataTableFilter<T>[];
  columns: Array<{
    key: string;
    label: string;
    className?: string;
    render: (item: T) => ReactNode;
  }>;
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  children?: ReactNode;
}

export function AdminTablePage<T>({
  title,
  description,
  action,
  data,
  filters,
  columns,
  keyExtractor,
  searchPlaceholder,
  children,
}: AdminTablePageProps<T>) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} action={action} />
      {children}
      <Card padding="none">
        <DataTable
          data={data}
          filters={filters}
          columns={columns}
          keyExtractor={keyExtractor}
          searchPlaceholder={searchPlaceholder}
        />
      </Card>
    </div>
  );
}

