"use client"

import { useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { TemplateSertifikat } from "@/types/bimbingan-karir/koordinator/sertifikat/sertifikat"
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
import { sertifikatSchema, SertifikatFormData } from "./schema"
import { z } from "zod"
import { toast } from "sonner"

interface SertifikatDialogProps {
  open: boolean
  mode: "add" | "edit"
  initialData?: TemplateSertifikat
  isLoading?: boolean
  onClose: () => void
  onSubmit: (data: TemplateSertifikat) => void
}

export default function SertifikatDialog({
  open,
  mode,
  initialData,
  isLoading = false,
  onClose,
  onSubmit,
}: SertifikatDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<SertifikatFormData>({
    resolver: zodResolver(sertifikatSchema),
    defaultValues: {
      nama_template: "",
      file_path: "",
    },
  })

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        nama_template: initialData.nama_template,
        file_path: typeof initialData.file_path === "string" ? initialData.file_path : "",
      })
    }

    if (mode === "add" && open) {
      form.reset({
        nama_template: "",
        file_path: "",
      })
    }
  }, [initialData, mode, open, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    try {
      sertifikatSchema.shape.file_path.parse(selectedFile)
      form.setValue("file_path", selectedFile)
      form.clearErrors("file_path")
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || "File tidak valid"
        form.setError("file_path", {
          type: "manual",
          message: errorMessage,
        })
        toast.error(errorMessage)
      }
    }
  }

  const handleRemoveFile = () => {
    form.setValue("file_path", "")
    form.clearErrors("file_path")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = (data: SertifikatFormData) => {
    const submitData: Partial<TemplateSertifikat> & {
      nama_template: string
      file_path: string | File
    } = {
      nama_template: data.nama_template,
      file_path: data.file_path,
    }

    if (mode === "edit" && initialData?.id) {
      submitData.id = initialData.id
    }

    onSubmit(submitData as TemplateSertifikat)
  }

  const handleClose = () => {
    if (!isLoading) {
      form.reset()
      onClose()
    }
  }

  const currentFilePath = form.watch("file_path")
  const preview =
    currentFilePath instanceof File
      ? URL.createObjectURL(currentFilePath)
      : typeof currentFilePath === "string" && currentFilePath !== "" && currentFilePath !== "belum ada"
      ? currentFilePath
      : null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Tambah Template Sertifikat" : "Edit Template Sertifikat"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Nama Template */}
            <FormField
              control={form.control}
              name="nama_template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nama Template <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Sertifikat Seminar Nasional"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Template */}
            <FormField
              control={form.control}
              name="file_path"
              render={() => (
                <FormItem>
                  <FormLabel>
                    File Template <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {/* Upload Button */}
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full justify-center"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                        >
                          <ImageIcon size={16} className="mr-2" />
                          {preview ? "Ganti Template" : "Upload Template"}
                        </Button>
                        {preview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveFile}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>

                      {/* Preview Image */}
                      {preview ? (
                        <div className="relative border rounded-lg overflow-hidden">
                          <div className="relative h-64 bg-gray-100">
                            <Image
                              src={preview}
                              alt="Preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                          <Upload size={32} className="mx-auto mb-2" />
                          <p className="text-sm">Belum ada template yang dipilih</p>
                          <p className="text-xs mt-1">Format: PNG, JPG, JPEG (Maks. 5MB)</p>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Format: JPEG, PNG, JPG (Maks. 5MB)
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : mode === "add" ? "Tambah" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}