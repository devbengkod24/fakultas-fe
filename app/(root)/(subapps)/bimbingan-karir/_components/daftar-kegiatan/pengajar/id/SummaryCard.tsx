"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SummaryCardProps {
  total: number
  present: number
  isGenerating: boolean
  isOpen: boolean
  onToggleQr: () => void
}

export default function SummaryCard({ total, present, isGenerating, isOpen, onToggleQr }: SummaryCardProps) {
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2 mb-4">
        <CardTitle>Informasi Kehadiran</CardTitle>
        <CardDescription>Ringkasan kehadiran mahasiswa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Mahasiswa</p>
              <p className="text-3xl font-bold">{total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Sudah Hadir</p>
              <p className="text-3xl font-bold text-green-600">{present}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {present} dari {total} mahasiswa ({percentage}%)
          </p>
        </div>
      </CardContent>
      <CardFooter>
      <Button className="w-full" onClick={onToggleQr} disabled={isGenerating}>
        {isGenerating ? (
          <div className="flex items-center gap-1 ">
            <Loader2 className="animate-spin size-4 text-white" />
             Memproses...
          </div>
        ) : isOpen ? (
          <div>
            Tutup Presensi
          </div>
        ) : (
          <div>
            Buka Presensi
          </div>
        )}
      </Button>
      </CardFooter>
    </Card>
  )
}
