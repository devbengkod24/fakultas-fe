"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, Check, X, Loader2, GraduationCap } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MinatMhsService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { handleToastResponse } from "@/lib/toast-response"
import { Minat } from "@/types/bimbingan-karir/koordinator/daftar-mahasiswa/daftar-mahasiswa"

const fetcherMinat = () => {
  return MinatMhsService.getMinat().then((res) => res)
}

const MinatMahasiswa = () => {
  const [open, setOpen] = useState(false)
  const [newMinat, setNewMinat] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, error, isLoading, mutate } = useSWR(
    ["minat-mahasiswa-dialog"],
    () => fetcherMinat(),
    { revalidateOnFocus: false, dedupingInterval: 500 }
  )

  const minatList: Minat[] = data?.data || []

  const handleAddMinat = async () => {
    if (!newMinat.trim()) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("nama_minat", newMinat.trim())

      const response = await MinatMhsService.createMinatMahasiswa(formData)
      handleToastResponse(response)
      mutate()
      
      if (response.success === true) {
        setNewMinat("")
      }
    } catch (error) {
      handleToastResponse({
        success: false,
        message: error instanceof Error ? error.message : "Gagal menambahkan minat"
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMinat = async (id: number) => {
    setIsSubmitting(true)
    try {
      const response = await MinatMhsService.deleteMinatMahasiswa(id)
      handleToastResponse(response)
      mutate()
    } catch (error) {
        handleToastResponse({
            success: false,
            message: error instanceof Error ? error.message : "Gagal menghapus minat"
        });
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStartEdit = (minat: Minat) => {
    setEditingId(minat.id)
    setEditingName(minat.nama_minat)
  }

  const handleSaveEdit = async () => {
    if (editingId === null || !editingName.trim()) return

    setIsSubmitting(true)
    try {
      const response = await MinatMhsService.updateMinatMahasiswa(
        { nama_minat: editingName.trim() }, 
        editingId
      )
      handleToastResponse(response)
      mutate()
      if (response.success) {
        setEditingId(null)
        setEditingName("")
      }
    } catch (error) {
      handleToastResponse({
        success: false,
        message: error instanceof Error ? error.message : "Gagal mengupdate minat"
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !isSubmitting) {
      e.preventDefault()
      action()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button variant="default"><GraduationCap /> Minat</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-2">
            <div>
              <DialogTitle className="text-lg">Minat Mahasiswa</DialogTitle>
              <DialogDescription className="text-sm">
                Tambahkan minat mahasiswa pada Bimbingan Karir!
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2">
          {/* Input untuk menambah minat baru */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Masukkan minat baru..."
              value={newMinat}
              onChange={(e) => setNewMinat(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddMinat)}
              disabled={isSubmitting}
              className="flex-1"
            />
            <Button
              onClick={handleAddMinat}
              disabled={!newMinat.trim() || isSubmitting}
              className="shrink-0"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Daftar Minat */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Daftar Minat ({minatList.length})
            </p>

            <ScrollArea className="h-[240px] w-full">
              <div className="pr-4 space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="py-8 text-sm text-center text-red-500">
                    Gagal memuat data minat
                  </div>
                ) : minatList.length === 0 ? (
                  <div className="py-8 text-sm text-center text-muted-foreground">
                    Belum ada minat yang ditambahkan
                  </div>
                ) : (
                  minatList.map((minat) => (
                    <div key={minat.id} className="group">
                      {editingId === minat.id ? (
                        <div className="flex items-center gap-2 px-3 py-2 border rounded-md border-primary">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            disabled={isSubmitting}
                            className="flex-1 p-0 border-0 h-7 focus-visible:ring-0 focus-visible:ring-offset-0"
                            autoFocus
                          />
                          <div className="flex gap-1 shrink-0">
                            <Button
                              size="icon"
                              className="h-7 w-7"
                              onClick={handleSaveEdit}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              className="h-7 w-7"
                              variant="destructive"
                              onClick={handleCancelEdit}
                              disabled={isSubmitting}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-2 border rounded-md border-primary bg-primary/5">
                          <div className="flex-1 text-sm font-medium text-primary">
                            {minat.nama_minat}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-primary hover:bg-primary-50 hover:text-primary-800"
                              onClick={() => handleStartEdit(minat)}
                              disabled={isSubmitting}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-600 h-7 w-7 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteMinat(minat.id)}
                              disabled={isSubmitting}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MinatMahasiswa