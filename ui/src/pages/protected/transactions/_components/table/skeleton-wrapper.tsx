import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

interface SkeletonWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
}

export const SkeletonWrapper = ({
  children,
  isLoading,
  fullWidth = true,
}: SkeletonWrapperProps) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={fullWidth ? "w-full" : ""}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="border-b">
            <div className="flex">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-4 flex-1">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>

          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="border-b last:border-b-0">
              <div className="flex">
                {Array.from({ length: 8 }).map((_, colIndex) => (
                  <div key={colIndex} className="p-4 flex-1">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
};
