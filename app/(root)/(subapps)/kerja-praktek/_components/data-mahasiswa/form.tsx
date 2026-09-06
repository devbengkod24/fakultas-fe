"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Upload, Plus } from "lucide-react"
import type { Mahasiswa } from "@/types/kerja-praktek/mahasiswa"
import { ImportMahasiswaForm } from "./import"
import { MahasiswaService } from "@/api/kerja-praktek"
import { toast } from "sonner"

interface MahasiswaFormProps {
  onClose: () => void
  onSave: (formData: Mahasiswa) => void
  onImport: (file: File) => Promise<void>
  mahasiswa?: Mahasiswa
  editMode: boolean
  isLoading?: boolean
}

type FormMode = 'select' | 'manual' | 'import'

export function DaftarMahasiswaForm({ 
  onClose, 
  onSave, 
  onImport,
  mahasiswa, 
  editMode,
  isLoading = false
}: MahasiswaFormProps) {
  const [formMode, setFormMode] = useState<FormMode>(editMode ? 'manual' : 'select')
  const [formData, setFormData] = useState<Mahasiswa>({
    id: undefined,
    nama: "",
    nim: "",
    email: "",
    ipk: 0,
    transkrip: "",
    telepon: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (mahasiswa && editMode) {
      console.log("Data mahasiswa yang diterima:", mahasiswa);
      console.log("IPK:", mahasiswa.ipk);
      console.log("Telepon:", mahasiswa.telepon);
      console.log("Transkrip:", mahasiswa.transkrip);
      
      setFormData({
        id: mahasiswa.id,
        nama: mahasiswa.nama ?? "",
        nim: mahasiswa.nim ?? "",
        email: mahasiswa.email ?? "",
        ipk: mahasiswa.ipk ?? 0,
        transkrip: mahasiswa.transkrip ?? "",
        telepon: mahasiswa.telepon ?? "",
      })
    }
  }, [mahasiswa, editMode])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nama?.trim()) {
      newErrors.nama = "Nama wajib diisi"
    }

    if (!formData.nim?.trim()) {
      newErrors.nim = "NIM wajib diisi"
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email wajib diisi"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email tidak valid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "ipk" ? parseFloat(value) || 0 : value,
    })
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleDownloadTemplate = async () => {
    // Placeholder - download template not implemented
  }

  const handleImportSuccess = async (file: File) => {
    await onImport(file)
    onClose()
  }

  if (formMode === 'import') {
    return (
      <ImportMahasiswaForm
        onClose={onClose}
        onImport={handleImportSuccess}
        onDownloadTemplate={handleDownloadTemplate}
        isLoading={isLoading}
      />
    )
  }

  if (formMode === 'select' && !editMode) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Data Mahasiswa</DialogTitle>
            <DialogDescription>
              Pilih cara menambahkan data mahasiswa ke sistem.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-6">
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Input Manual</h3>
                    <p className="text-sm text-gray-500">
                      Tambah mahasiswa melalui Form
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setFormMode('manual')}
                  variant="outline"
                  size="sm"
                >
                  Pilih
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">atau</span>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Import Excel/CSV</h3>
                    <p className="text-sm text-gray-500">
                      Upload file untuk menambah banyak mahasiswa sekaligus
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setFormMode('import')}
                  variant="outline"
                  size="sm"
                >
                  Pilih
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit Data Mahasiswa" : "Tambah Mahasiswa Baru"}
          </DialogTitle>
          <DialogDescription>
            {editMode
              ? "Ubah informasi mahasiswa pada form di bawah ini."
              : "Masukkan informasi mahasiswa baru pada form di bawah ini."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Kolom Nama */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nama" className="text-right">
                Nama <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="nama"
                  name="nama"
                  value={formData.nama ?? ""}
                  onChange={handleChange}
                  className={`col-span-3 ${errors.nama ? "border-destructive" : ""}`}
                  required
                  placeholder="Nama Lengkap"
                />
                {errors.nama && <p className="text-destructive text-sm mt-1">{errors.nama}</p>}
              </div>
            </div>
            
            {/* Kolom NIM */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nim" className="text-right">
                NIM <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="nim"
                  name="nim"
                  value={formData.nim ?? ""}
                  onChange={handleChange}
                  className={`col-span-3 ${errors.nim ? "border-destructive" : ""}`}
                  required
                  placeholder="NIM Mahasiswa"
                />
                {errors.nim && <p className="text-destructive text-sm mt-1">{errors.nim}</p>}
              </div>
            </div>
            
            {/* Kolom Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email ?? ""}
                  onChange={handleChange}
                  className={`col-span-3 ${errors.email ? "border-destructive" : ""}`}
                  required
                  placeholder="Email Mahasiswa"
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Kolom Nomor Telepon */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telepon" className="text-right">No. Telepon</Label>
              <div className="col-span-3">
                <Input
                  id="telepon"
                  name="telepon"
                  value={formData.telepon ?? ""}
                  onChange={handleChange}
                  placeholder="No Telepon (contoh: +628123456789)"
                />
              </div>
            </div>

            {/* Kolom IPK */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ipk" className="text-right">IPK</Label>
              <div className="col-span-3">
                <Input
                  id="ipk"
                  name="ipk"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={formData.ipk ?? 0}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Kolom Transkrip Nilai */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transkrip" className="text-right">Transkrip Nilai</Label>
              <div className="col-span-3">
                <Input
                  id="transkrip"
                  name="transkrip"
                  value={formData.transkrip ?? ""}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/file/..."
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {editMode ? "Simpan Perubahan" : "Tambah Mahasiswa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}