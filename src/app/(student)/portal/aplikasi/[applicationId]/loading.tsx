import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function Loading() {
  return <div className="space-y-6"><Skeleton className="h-4 w-32" /><Skeleton className="h-8 w-56" /><div className="grid gap-6 lg:grid-cols-2"><SkeletonCard /><SkeletonCard /></div></div>;
}
