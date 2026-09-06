import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, AlertCircle } from "lucide-react"

interface DashboardData {
  sidang?: {
    tanggal: string
    jam: string
  }
}

interface StatusDanJadwalProps {
  data?: DashboardData
}

const DashboardMahasiswaStatusDanJadwal = ({ data }: StatusDanJadwalProps) => {
  const sidangData = data?.sidang
  const hasSidangSchedule = sidangData?.tanggal !== "N/A" && sidangData?.jam !== "N/A"

  const formatTanggal = (tanggal: string) => {
    if (!tanggal || tanggal === "N/A") return "Belum dijadwalkan"
    
    try {
      const date = new Date(tanggal)
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
      return date.toLocaleDateString('id-ID', options)
    } catch {
      return tanggal
    }
  }

  const formatWaktu = (jam: string) => {
    if (!jam || jam === "N/A") return "Belum dijadwalkan"
    return jam
  }

  return (
    <Card className="shadow-none border-0">
      <CardHeader className="pb-4 pl-1 pt-0">
        <div className='flex items-center gap-3'>
          <Calendar className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-sm font-normal">Jadwal Sidang</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pl-1">
        {hasSidangSchedule ? (
          <div className="bg-white/10 rounded-xl border p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Tanggal
                </p>
                <p className="text-xl font-bold">{formatTanggal(sidangData?.tanggal || "")}</p>
              </div>
              <div>
                <p className="text-sm mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  Waktu
                </p>
                <p className="text-xl font-bold">{formatWaktu(sidangData?.jam || "")}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-secondary-50 rounded-xl border border-secondary-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-secondary-600" />
              <p className="text-sm font-medium text-secondary-800">Jadwal Belum Ditentukan</p>
            </div>
            <p className="text-xs text-secondary-700">
              Jadwal sidang akan diumumkan setelah pengajuan sidang Anda disetujui.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardMahasiswaStatusDanJadwal