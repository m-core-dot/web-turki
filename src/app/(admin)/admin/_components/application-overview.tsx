import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockApplicationSummary } from "@/lib/mock-data";

export function ApplicationOverview() {
  return (
    <Card padding="none">
      <CardHeader className="border-b border-border px-5 py-4">
        <div>
          <CardTitle>Status Aplikasi Universitas</CardTitle>
          <CardDescription className="mt-0.5">
            Ringkasan aplikasi peserta ke universitas mitra
          </CardDescription>
        </div>
      </CardHeader>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background-alt/50">
              <th className="px-5 py-3 font-medium text-muted">Universitas</th>
              <th className="px-5 py-3 text-center font-medium text-muted">
                Total
              </th>
              <th className="px-5 py-3 text-center font-medium text-muted">
                Dikirim
              </th>
              <th className="px-5 py-3 text-center font-medium text-muted">
                Review
              </th>
              <th className="px-5 py-3 text-center font-medium text-muted">
                Diterima
              </th>
              <th className="px-5 py-3 text-center font-medium text-muted">
                Ditolak
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockApplicationSummary.map((app) => (
              <tr
                key={app.university}
                className="transition-colors hover:bg-background-alt/30"
              >
                <td className="px-5 py-3.5 font-medium text-foreground">
                  {app.university}
                </td>
                <td className="px-5 py-3.5 text-center tabular-nums text-foreground">
                  {app.total}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <Badge variant="info">{app.submitted}</Badge>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <Badge variant="warning">{app.underReview}</Badge>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <Badge variant="success">{app.accepted}</Badge>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <Badge variant="danger">{app.rejected}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
