import { StatsSection } from "./_components/stats-section";
import { RecentRegistrations } from "./_components/recent-registrations";
import { RecentActivities } from "./_components/recent-activities";
import { ApplicationOverview } from "./_components/application-overview";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Selamat Datang, Admin ðŸ‘‹
        </h1>
        <p className="mt-1 text-sm text-muted">
          Berikut ringkasan aktivitas MTAS hari ini â€” 24 November 2026
        </p>
      </div>

      {/* Stats */}
      <StatsSection />

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent registrations â€” wider */}
        <div className="lg:col-span-3">
          <RecentRegistrations />
        </div>

        {/* Recent activities â€” narrower */}
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>
      </div>

      {/* Application overview */}
      <ApplicationOverview />
    </div>
  );
}

