"use client"

import { Skeleton } from "@/components/ui/skeleton"

export const PengajuanKPGridSkeleton = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Status Banner Skeleton */}
      <div className="col-span-12">
        <div className="p-6 rounded-xl border-2 border-gray-100 bg-gray-50">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Dosen Pembimbing Selector Skeleton */}
      <div className="col-span-12 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>

      {/* Status Magang and Action Buttons Container */}
      <div className="col-span-12 space-y-6">
        {/* Status Magang Skeleton */}
        <div className="p-6 rounded-xl border-2 border-gray-100 bg-gray-50 space-y-4">
          
          {/* Position input skeleton */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}