"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivitySelectorProps {
  firstActivity: number | null
  secondActivity: number | null
  onFirstActivityChange: (value: number) => void
  onSecondActivityChange: (value: number) => void
  periods: {
    id: number
    kode_periode: number
    tahun_ajaran: string
  }[]
  activeTab: string
}

export function ActivitySelector({
  firstActivity,
  secondActivity,
  onFirstActivityChange,
  onSecondActivityChange,
  periods,
  activeTab,
}: ActivitySelectorProps) {
  const handleFirstActivityChange = (value: string) => {
    const numValue = Number(value)
    onFirstActivityChange(numValue)
  }
  
  const handleSecondActivityChange = (value: string) => {
    const numValue = Number(value)
    onSecondActivityChange(numValue)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <Card className="border rounded-lg shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Periode Pertama</CardTitle>
          <p className="text-muted-foreground text-sm">Pilih periode pertama untuk dibandingkan</p>
        </CardHeader>
        <CardContent className="mt-2">
          <Select value={firstActivity ? String(firstActivity) : ""} onValueChange={handleFirstActivityChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((periode) => (
                <SelectItem key={periode.id} value={String(periode.id)}>
                  {activeTab.toUpperCase()} - {periode.tahun_ajaran}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border rounded-lg shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Periode Kedua</CardTitle>
          <p className="text-muted-foreground text-sm">Pilih periode kedua untuk dibandingkan</p>
        </CardHeader>
        <CardContent className="mt-2">
          <Select value={secondActivity ? String(secondActivity) : ""} onValueChange={handleSecondActivityChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((periode) => (
                <SelectItem key={periode.id} value={String(periode.id)}>
                  {activeTab.toUpperCase()} - {periode.tahun_ajaran}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}