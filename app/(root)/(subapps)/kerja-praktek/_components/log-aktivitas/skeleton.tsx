import { Skeleton } from "@/components/ui/skeleton"

interface ActivityLogSkeletonProps {
  userType: "dosen" | "koordinator"
}

export function ActivityLogSkeleton({ userType }: ActivityLogSkeletonProps) {
  return (
    <div className={`${userType === "koordinator" ? "flex-1 overflow-auto" : "mt-4"} flex flex-col`}>
      {/* Content Area Skeleton */}
      <div className="flex-1 divide-y divide-slate-200">
        {/* Generate 3 date groups with activities */}
        {Array.from({ length: 3 }).map((_, dayIndex) => (
          <div key={dayIndex}>
            {/* Date Header Skeleton */}
            <div className="px-4 py-2 bg-blue-500/5 border-b border-gray-200">
              <Skeleton className="h-5 w-48" />
            </div>
            
            {/* Activity Items Skeleton */}
            {Array.from({ length: Math.floor(Math.random() * 4) + 2 }).map((_, activityIndex) => (
              <div key={activityIndex} className="relative pl-8 sm:pl-10 py-3 group">
                {/* Timeline dot */}
                <div className="absolute left-2 sm:left-0 w-2 h-2 bg-gray-200 rounded-full sm:ml-[1rem] -translate-x-1/2 translate-y-1.5 animate-pulse"></div>
                
                {/* Timeline line (except for last item) */}
                {activityIndex < 3 && (
                  <div className="absolute left-2 sm:left-0 h-full w-[1px] bg-gray-200 sm:ml-[1rem] -translate-x-1/2 translate-y-3"></div>
                )}
                
                {/* Activity Description Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-4 w-3/4 max-w-sm" />
                  {/* Time Skeleton */}
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Pagination Skeleton */}
      <div className="mt-auto border-t bg-white p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left side - showing info */}
          <Skeleton className="h-4 w-32" />
          
          {/* Center - page numbers */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" /> {/* prev button */}
            <Skeleton className="h-8 w-8" /> {/* page 1 */}
            <Skeleton className="h-8 w-8" /> {/* page 2 */}
            <Skeleton className="h-8 w-8" /> {/* page 3 */}
            <Skeleton className="h-8 w-8" /> {/* next button */}
          </div>
          
          {/* Right side - items per page */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}