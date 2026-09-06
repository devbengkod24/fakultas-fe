"use client";

import { useEffect, useState } from "react"
import { LogActivityService } from "@/api/kerja-praktek"
import { useProfile } from "@/context/profileUseContext"
import { ActivityLogView } from "@/components/shared-ta-kp/dashboard/activity-log-view"
import type { ActivityLogDay } from "@/components/shared-ta-kp/dashboard/activity-log-view"

interface ActivityLog {
  id: number
  log_name: string
  description: string
  created_at: string
  updated_at: string
}

interface DashboardLogAktivitasProps {
  type: "koordinator" | "dosen"
}

function groupByDate(logs: ActivityLog[]): ActivityLogDay[] {
  const grouped: Record<string, ActivityLogDay["logs"]> = {}
  logs.forEach((log) => {
    const [datePart, timePart] = log.created_at.split(" ")
    const [day, month, year] = datePart.split("-")
    const date = new Date(`${year}-${month}-${day}`)
    const formattedDate = date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    if (!grouped[formattedDate]) grouped[formattedDate] = []
    grouped[formattedDate].push({
      id: log.id,
      time: timePart?.slice(0, 5) ?? "",
      activity: log.description,
      lecture: log.log_name,
    })
  })
  return Object.entries(grouped)
    .map(([date, logs]) => ({ date, logs }))
    .sort((a, b) => {
      const d1 = new Date(a.date.split(", ")[1] ?? a.date)
      const d2 = new Date(b.date.split(", ")[1] ?? b.date)
      return d2.getTime() - d1.getTime()
    })
}

const DashboardLogAktivitas = ({ type = "dosen" }: DashboardLogAktivitasProps) => {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { activeProdiId } = useProfile()

  useEffect(() => {
    setLoading(true)
    setError(false)
    const fetchData = async () => {
      try {
        let res
        if (type === "koordinator") {
          res = await LogActivityService.getAllLogActivityKoordinator("", "1", 10, activeProdiId ?? undefined)
        } else {
          res = await LogActivityService.getAllLogActivityDosen("", "1", 10)
        }
        if (res?.data) setActivities(res.data)
      } catch (e) {
        console.error("Failed to fetch activity logs:", e)
        setError(true)
        setActivities([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [type, activeProdiId])

  const grouped = groupByDate(activities)

  return (
    <ActivityLogView
      activities={grouped}
      loading={loading}
      error={error}
    />
  )
}

export default DashboardLogAktivitas
