import { Skeleton } from "@/components/ui/skeleton";

export const ChartSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-4 w-48 bg-muted rounded" />
    <Skeleton className="h-4 w-48 bg-muted rounded" />
  </div>
);
