import { Card } from "@/components/ui/card";

export default function Loading() {
  return <div className="space-y-6"><div className="h-8 w-56 animate-pulse rounded-lg bg-background-alt" /><div className="h-5 w-96 max-w-full animate-pulse rounded-lg bg-background-alt" /><div className="grid gap-5 md:grid-cols-2"><Card><div className="h-40 animate-pulse rounded-lg bg-background-alt" /></Card><Card><div className="h-40 animate-pulse rounded-lg bg-background-alt" /></Card></div></div>;
}
