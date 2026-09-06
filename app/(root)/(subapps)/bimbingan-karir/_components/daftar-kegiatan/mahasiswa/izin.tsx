"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Upload, X, Clock } from "lucide-react"
import { toast } from "sonner"
import { izinSchema, IzinFormData } from "./schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface IzinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kegiatanId: string
  batasWaktuIzin?: string | null
  onSubmit?: (data: IzinFormData) => Promise<void>
}

export default function IzinDialog({ open, onOpenChange, kegiatanId, batasWaktuIzin, onSubmit }: IzinDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<IzinFormData>({
    resolver: zodResolver(izinSchema),
    defaultValues: {
      kegiatan_id: kegiatanId,
      alasan: "",
      bukti_izin: undefined,
    },
  })

  const formatBatasWaktu = (date: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    try {
      izinSchema.shape.bukti_izin.parse(selectedFile)
      setFile(selectedFile)
      form.setValue("bukti_izin", selectedFile)
      form.clearErrors("bukti_izin")
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || "File tidak valid"
        form.setError("bukti_izin", { 
          type: "manual", 
          message: errorMessage
        })
        toast.error(errorMessage)
      }
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    form.setValue("bukti_izin", undefined)
    form.clearErrors("bukti_izin")
    const fileInput = document.getElementById("bukti-izin") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleSubmit = async (data: IzinFormData) => {
    setIsLoading(true)

    try {
      if (onSubmit) {
        await onSubmit(data)
      }

      form.reset()
      setFile(null)
      onOpenChange(false)
    } catch (error) {
      toast.error("Gagal mengajukan izin. Silakan coba lagi.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      form.reset()
      setFile(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:w-full rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Ajukan Izin
          </DialogTitle>
          <DialogDescription className="text-start">
            Isi formulir di bawah ini untuk mengajukan izin tidak hadir.
          </DialogDescription>
        </DialogHeader>

        {batasWaktuIzin && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <AlertDescription className="flex items-center gap-1">
                Batas waktu pengajuan izin: <strong>{formatBatasWaktu(batasWaktuIzin)}</strong>
              </AlertDescription>
            </div>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Alasan Izin */}
            <FormField
              control={form.control}
              name="alasan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Alasan Izin <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tuliskan alasan Anda tidak dapat hadir..."
                      disabled={isLoading}
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bukti Izin */}
            <FormField
              control={form.control}
              name="bukti_izin"
              render={({ }) => (
                <FormItem>
                  <FormLabel>
                    Bukti Izin
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          id="bukti-izin"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleFileChange}
                          disabled={isLoading}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("bukti-izin")?.click()}
                          disabled={isLoading}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {file ? "Ganti File" : "Upload Bukti Izin"}
                        </Button>
                      </div>

                      {file && (
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveFile}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Format: JPG, JPEG, PNG, PDF. Maksimal 2MB
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Mengirim..." : "Ajukan Izin"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}