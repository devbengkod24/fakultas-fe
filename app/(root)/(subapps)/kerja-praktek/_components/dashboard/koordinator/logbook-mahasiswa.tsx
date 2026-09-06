"use client"

import { Book, FileText, Copy, BookOpen, BookMarked, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dashboard } from "@/types/kerja-praktek/dashboard"

interface DashboardKoordinatorLogbookMahasiswaProps {
  data?: Dashboard;
  className?: string;
}

export default function DashboardKoordinatorLogbookMahasiswa({ data, className = "" }: DashboardKoordinatorLogbookMahasiswaProps) {
  
  const logbookData = data?.logbook || {
    bab_1: { mahasiswa_acc: 0, total_mahasiswa: 0, persentase: "0%" },
    bab_2: { mahasiswa_acc: 0, total_mahasiswa: 0, persentase: "0%" },
    bab_3: { mahasiswa_acc: 0, total_mahasiswa: 0, persentase: "0%" },
    bab_4: { mahasiswa_acc: 0, total_mahasiswa: 0, persentase: "0%" },
    bab_5: { mahasiswa_acc: 0, total_mahasiswa: 0, persentase: "0%" }
  };

  const chapters = [
    {
      id: 1,
      title: "BAB 1",
      completed: logbookData.bab_1?.mahasiswa_acc ?? 0,
      total: logbookData.bab_1?.total_mahasiswa ?? 0,
      percentage: logbookData.bab_1?.persentase ?? "0%",
      icon: Book,
      color: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      id: 2,
      title: "BAB 2",
      completed: logbookData.bab_2?.mahasiswa_acc ?? 0,
      total: logbookData.bab_2?.total_mahasiswa ?? 0,
      percentage: logbookData.bab_2?.persentase ?? "0%",
      icon: FileText,
      color: "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      id: 3,
      title: "BAB 3",
      completed: logbookData.bab_3?.mahasiswa_acc ?? 0,
      total: logbookData.bab_3?.total_mahasiswa ?? 0,
      percentage: logbookData.bab_3?.persentase ?? "0%",
      icon: Copy,
      color: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
    {
      id: 4,
      title: "BAB 4",
      completed: logbookData.bab_4?.mahasiswa_acc ?? 0,
      total: logbookData.bab_4?.total_mahasiswa ?? 0,
      percentage: logbookData.bab_4?.persentase ?? "0%",
      icon: BookOpen,
      color: "bg-red-100",
      iconColor: "text-red-500",
    },
    {
      id: 5,
      title: "BAB 5",
      completed: logbookData.bab_5?.mahasiswa_acc ?? 0,
      total: logbookData.bab_5?.total_mahasiswa ?? 0,
      percentage: logbookData.bab_5?.persentase ?? "0%",
      icon: BookMarked,
      color: "bg-cyan-100",
      iconColor: "text-cyan-500",
    },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base">Data Logbook Mahasiswa</CardTitle>
          <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent className="mt-3">
        <div className="flex flex-col gap-4">
          {/* Mobile: Single column, Tablet+: 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {chapters.slice(0, 3).map((chapter) => {
              const percentageString = chapter.percentage.replace('%', '')
              const percentageValue = Math.round(parseFloat(percentageString))
              const IconComponent = chapter.icon

              return (
                <div key={chapter.id} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex justify-between items-start">
                    <div className={`${chapter.color} p-1.5 sm:p-2 rounded-md`}>
                      <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 ${chapter.iconColor}`} />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold">{percentageValue}%</div>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <h3 className="text-sm sm:text-md font-medium">{chapter.title}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {chapter.completed} dari {chapter.total} mahasiswa
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile: Single column, Tablet+: 2 columns centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 sm:mx-auto sm:w-full lg:w-2/3">
            {chapters.slice(3, 5).map((chapter) => {
              const percentageString = chapter.percentage.replace('%', '')
              const percentageValue = Math.round(parseFloat(percentageString))
              const IconComponent = chapter.icon

              return (
                <div key={chapter.id} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex justify-between items-start">
                    <div className={`${chapter.color} p-1.5 sm:p-2 rounded-md`}>
                      <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 ${chapter.iconColor}`} />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold">{percentageValue}%</div>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <h3 className="text-sm sm:text-md font-medium">{chapter.title}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {chapter.completed} dari {chapter.total} mahasiswa
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}