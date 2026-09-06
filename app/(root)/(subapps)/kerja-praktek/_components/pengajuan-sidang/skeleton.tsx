"use client"

import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export function PengajuanSidangSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Status Banner Skeleton */}
      <motion.div
        className="col-span-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative overflow-hidden rounded-2xl border-2 bg-gray-50">
          <div className="relative p-6">
            <div className="flex justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-20 rounded-lg" />
                <Skeleton className="h-9 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form Content Skeleton */}
      <div className="col-span-12">
        <div className="space-y-8">
          {/* Informasi Kerja Praktek Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-200"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-primary-200">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Judul KP */}
                <div className="bg-white rounded-xl p-5 border border-primary-100">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-11 w-full rounded-lg" />
                  </div>
                </div>

                {/* Company & Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-5 border border-primary-100">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-11 w-full rounded-lg" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-primary-100">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-11 w-full rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="bg-white rounded-xl p-5 border border-primary-100">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-11 w-full rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-11 w-full rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-xl p-5 border border-primary-100">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                </div>

                {/* Acceptance Letter */}
                <div className="bg-white rounded-xl p-5 border border-primary-100">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-11 w-full rounded-lg" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Informasi Penyelia Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl border border-secondary-200"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-secondary-200">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-72" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Name & Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-5 border border-secondary-100">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-11 w-full rounded-lg" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-secondary-100">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-11 w-full rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Company & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-5 border border-secondary-100">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-11 w-full rounded-lg" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-secondary-100">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-11 w-full rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Evaluation Score */}
                <div className="bg-white rounded-xl p-5 border border-secondary-100">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-11 w-full rounded-lg" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dokumen Pendukung Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-green-200">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-60" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Final Report */}
                <div className="bg-white rounded-xl p-6 border border-green-100">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-52" />
                        <Skeleton className="h-3 w-80" />
                      </div>
                      <Skeleton className="h-11 w-full rounded-lg" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>

                {/* Supervisor Document */}
                <div className="bg-white rounded-xl p-6 border border-green-100">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-88" />
                      </div>
                      <Skeleton className="h-11 w-full rounded-lg" />
                      <Skeleton className="h-3 w-72" />
                    </div>
                  </div>
                </div>

                {/* Document Checklist */}
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
                    <div className="space-y-3 w-full">
                      <Skeleton className="h-4 w-32" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-64" />
                        <Skeleton className="h-3 w-72" />
                        <Skeleton className="h-3 w-68" />
                        <Skeleton className="h-3 w-76" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 pt-6 border-t"
          >
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-10 w-20 rounded-lg" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export function PengajuanSidangSimpleSkeleton() {
  return (
    <div className="flex items-center justify-center py-15">
      <div className="text-center">
        <Skeleton className="w-8 h-8 rounded-full mx-auto mb-4" />
        <Skeleton className="h-4 w-48 mx-auto mb-2" />
      </div>
    </div>
  )
}

export function PengajuanSidangErrorSkeleton() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md space-y-4">
        <Skeleton className="w-16 h-16 rounded-full mx-auto" />
        <Skeleton className="h-6 w-40 mx-auto" />
        <Skeleton className="h-4 w-80 mx-auto" />
        <div className="flex gap-3 justify-center mt-6">
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}