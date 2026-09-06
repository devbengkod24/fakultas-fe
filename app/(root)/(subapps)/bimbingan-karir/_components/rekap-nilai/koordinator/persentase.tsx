"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { PersentaseRekapService } from "@/api/bimbingan-karir/index"
import { PercentageValues } from "@/types/bimbingan-karir/koordinator/rekap-nilai/persentase-rekap"
import { PercentageDialogSkeleton } from "../skeleton"
import useSWR from "swr"
import { Percent, Loader2 } from "lucide-react"
import { DialogDescription } from "@radix-ui/react-dialog"
import { handleToastResponse } from "@/lib/toast-response"

const fetcherPersentaseRekap = () =>
  PersentaseRekapService.getAllPersentaseRekap().then((res) => res.data)

export function Percentase() {
  const [open, setOpen] = useState(false)

  const { data, isLoading, mutate } = useSWR(["rekap-nilai"], fetcherPersentaseRekap, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  })

  const [percentages, setPercentages] = useState<PercentageValues | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isLoading && data && percentages === null) {
    setPercentages(data)
  }

  const total = percentages ? Object.values(percentages).reduce((a, b) => a + b, 0) : 0

  function formatLabel(key: string) {
    return key
      .split(/[_\s-]/) // Pisahkan berdasarkan underscore, spasi, atau dash jika ada
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default" className="h-full ">
          <Percent size={16} />
          Atur Persentase
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Informasi Persentase</DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">Persentase nilai rekap dihitung secara otomatis berdasarkan jumlah kategori yang aktif.</DialogDescription>
        </DialogHeader>

        {isLoading || !percentages ? (
          <PercentageDialogSkeleton />
        ) : (
          <div className="grid gap-4 py-2">
            {Object.entries(percentages).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 items-center ">
                <Label htmlFor={key}>{formatLabel(key)}</Label>
                <div className="flex items-center text-sm font-medium border rounded-md px-3 py-2 bg-gray-50">
                  {value}%
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border rounded-md mt-2">
              <span className="text-sm text-muted-foreground">Total Persentase</span>
              <span
                className={`${Math.round(total) === 100 ? "text-green-600" : "text-amber-600"
                  }`}
              >
                {Math.round(total)}%
              </span>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}