"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { ListChecks, User, Users, Calendar, FileText, Search, AlertCircle } from 'lucide-react'
import { CustomSolidTabs } from "@/components/custom-solid-tabs"
import SearchControl from "@/components/search-control"
import PaginationControls from "@/components/pagination-control"
import EmptyState from "@/components/empty-state"
import { LogActivityService } from "@/api/kerja-praktek"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useSearchParams, useRouter } from "next/navigation"
import { ActivityLogSkeleton } from "../../_components/log-aktivitas/skeleton"
import { useProfile } from "@/context/profileUseContext"

interface ActivityLog {
  id: number
  log_name: string
  description: string
  created_at: string
  updated_at: string
}

interface ActivityResponse {
  data: ActivityLog[]
  meta: {
    success: boolean
    message: string
    pagination: {
      total: number
      per_page: number
      current_page: number
      last_page: number
    }
  }
}

interface ActivityDay {
  date: string
  logs: ActivityLog[]
}

interface LogBimbinganActivityLogProps {
  userType: "dosen" | "koordinator"
}

interface TabItem {
  status: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

// Helper function untuk grouping data berdasarkan tanggal
const groupByDate = (activities: ActivityLog[]): ActivityDay[] => {
  const grouped = activities.reduce((acc, activity) => {
    // Parse created_at format: "25-06-2025 10:10:17"
    const [datePart] = activity.created_at.split(' ')
    const [day, month, year] = datePart.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    
    const formattedDate = format(date, "EEEE, d MMMM yyyy", { locale: id })
    
    if (!acc[formattedDate]) {
      acc[formattedDate] = []
    }
    acc[formattedDate].push(activity)
    
    return acc
  }, {} as Record<string, ActivityLog[]>)

  return Object.entries(grouped)
    .map(([date, logs]) => ({ date, logs }))
    .sort((a, b) => {
      // Sort by date descending (newest first)
      const dateA = new Date(a.logs[0].created_at.split(' ')[0].split('-').reverse().join('-'))
      const dateB = new Date(b.logs[0].created_at.split(' ')[0].split('-').reverse().join('-'))
      return dateB.getTime() - dateA.getTime()
    })
}

// Helper function untuk mendapatkan time dari created_at
const getTimeFromCreatedAt = (created_at: string): string => {
  const [, timePart] = created_at.split(' ')
  const [hour, minute] = timePart.split(':')
  return `${hour}:${minute}`
}

const LogBimbinganActivityLog = ({ userType }: LogBimbinganActivityLogProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { activeProdiId } = useProfile();
  
  const currentPage = Number(searchParams.get("page")) || 1
  const currentLimit = Number(searchParams.get("limit")) || 10
  const urlSearchTerm = searchParams.get("search") || ""
  
  const [activeTab, setActiveTab] = useState("all")
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  })

  // Tabs berdasarkan user type
  const getTabsForUserType = (): TabItem[] => {
    if (userType === "dosen") {
      return [
        { status: "all", label: "Semua", icon: Users },
        { status: "pengajuan", label: "Pengajuan", icon: User },
        { status: "logbook", label: "Logbook", icon: FileText },
      ]
    }
    
    // Koordinator tabs (existing)
    return [
      { status: "all", label: "Semua", icon: Users },
      { status: "pengajuan", label: "Pengajuan", icon: User },
      { status: "logbook", label: "Logbook", icon: FileText },
      { status: "pengajuan-sidang", label: "Pengajuan Sidang", icon: ListChecks },
      { status: "sidang", label: "Sidang", icon: Calendar },
    ]
  }

  const tabs = getTabsForUserType()

  // Fetch data berdasarkan user type dan tab menggunakan useCallback
  const fetchActivities = useCallback(async (tab: string, search: string = "", page: number = 1, limit: number = 10) => {
    setIsLoading(true)
    
    try {
      let response: ActivityResponse

      if (userType === "dosen") {
        // API calls untuk dosen
        switch (tab) {
          case "pengajuan":
            response = await LogActivityService.getAllPengajuanDosen(search, page.toString(), limit)
            break
          case "logbook":
            response = await LogActivityService.getAllLogbookDosen(search, page.toString(), limit)
            break
          case "all":
          default:
            response = await LogActivityService.getAllLogActivityDosen(search, page.toString(), limit)
            break
        }
      } else {
        // API calls untuk koordinator (existing)
        switch (tab) {
          case "pengajuan":
            response = await LogActivityService.getLogPengajuanKoordinator(search, page.toString(), limit, activeProdiId !== null ? activeProdiId : undefined)
            break
          case "logbook":
            response = await LogActivityService.getLogLogbookKoordinator(search, page.toString(), limit, activeProdiId !== null ? activeProdiId : undefined)
            break
          case "pengajuan-sidang":
            response = await LogActivityService.getLogPengajuanSidangKoordinator(search, page.toString(), limit, activeProdiId !== null ? activeProdiId : undefined)
            break
          case "sidang":
            response = await LogActivityService.getLogSidangKoordinator(search, page.toString(), limit, activeProdiId !== null ? activeProdiId : undefined)
            break
          case "all":
          default:
            response = await LogActivityService.getAllLogActivityKoordinator(search, page.toString(), limit, activeProdiId !== null ? activeProdiId : undefined)
            break
        }
      }

      if (response.meta.success) {
        setActivities(response.data)
        setPagination(response.meta.pagination)
      }
    } catch (error) {
      console.error("Error fetching activities:", error)
      setActivities([])
      setPagination({
        total: 0,
        per_page: limit,
        current_page: page,
        last_page: 1
      })
    } finally {
      setIsLoading(false)
    }
  }, [userType]) // userType sebagai dependency

  useEffect(() => {
    fetchActivities(activeTab, urlSearchTerm, currentPage, currentLimit)
  }, [fetchActivities, activeTab, urlSearchTerm, currentPage, currentLimit, activeProdiId])

  const handleTabChange = (status: string) => {
    setActiveTab(status)
    
    // Reset page ke 1 saat ganti tab
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", "1")
    if (params.get("search")) {
      params.delete("search") // Clear search saat ganti tab
    }
    router.push(`?${params.toString()}`)
  }

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const getActiveTabLabel = () => {
    const activeTabInfo = tabs.find(tab => tab.status === activeTab)
    return activeTabInfo?.label || "aktivitas"
  }

  // Group activities by date
  const groupedActivities = groupByDate(activities)

  // Render content area
  const renderContent = () => {
    if (isLoading) {
      return <ActivityLogSkeleton userType={userType} />
    }

    if (groupedActivities.length === 0) {
      return (
        <div className="flex-1">
          {urlSearchTerm ? (
            <EmptyState
              icon={Search}
              title="Tidak ditemukan hasil pencarian"
              subtitle={`Tidak ada aktivitas yang sesuai dengan pencarian "${urlSearchTerm}" pada kategori ini.`}
              button={
                <button
                  onClick={handleClearSearch}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Hapus Pencarian
                </button>
              }
              className="h-full"
            />
          ) : (
            <EmptyState
              icon={AlertCircle}
              title="Belum ada aktivitas"
              subtitle={`Belum ada ${getActiveTabLabel().toLowerCase()} yang tercatat dalam sistem.`}
              className="h-full"
            />
          )}
        </div>
      )
    }

    return (
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Content Area */}
        <div className="flex-1 divide-y divide-slate-200">
          {groupedActivities.map((activityDay, index) => (
            <div key={index}>
              {/* Date Header */}
              <div className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-500/5 font-medium text-primary border-b border-gray-200">
                {activityDay.date}
              </div>
              {/* Timeline Items */}
              {activityDay.logs.map((log) => (
                <div key={log.id} className="relative pl-6 sm:pl-8 md:pl-10 py-3 group">
                  {/* Bullet + Line */}
                  <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-1 sm:before:left-2 md:before:left-0 before:h-full before:w-[1px] before:bg-slate-300 md:before:ml-[1rem] before:self-start before:-translate-x-1/2 before:translate-y-2 sm:before:translate-y-3 after:absolute after:left-1 sm:after:left-2 md:after:left-0 after:w-1.5 sm:after:w-2 after:h-1.5 sm:after:h-2 after:bg-primary after:border-2 after:box-content after:border-slate-50 after:rounded-full md:after:ml-[1rem] after:-translate-x-1/2 after:translate-y-1 sm:after:translate-y-1.5"></div>
                  {/* Description */}
                  <div className="text-slate-500 text-xs sm:text-sm">
                    <span className="text-black font-medium break-words">{log.description}</span>
                  </div>
                  {/* Time */}
                  <div className="text-slate-500 text-xs">
                    {getTimeFromCreatedAt(log.created_at)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Pagination Controls */}
        {pagination.total > 0 && (
          <div className="mt-auto border-t bg-white">
            <PaginationControls
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              total={pagination.total}
              limitOptions={[5, 10, 20, 50]}
              defaultLimit={10}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col px-3 sm:px-0">
      {/* Toolbar - Always visible */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <SearchControl
          placeholder="Cari aktivitas..."
          className="w-1/4"
        />

        <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 sm:ml-auto">
          <CustomSolidTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </div>

      {/* Content Area - Shows skeleton when loading */}
      {renderContent()}
    </div>
  )
}

export default LogBimbinganActivityLog
