"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Dosen } from "@/types/kerja-praktek/dosen"

interface Props {
  onClose: () => void
  onSave: (dosen: Dosen) => void
  dosen?: Dosen
  editMode: boolean
}

export const DaftarDosenForm = ({ onClose, onSave, dosen, editMode }: Props) => {
  const [formData, setFormData] = useState<Partial<Dosen>>({
    nama: "",
    email: "",
    npp: "",
    gelar_depan: "",
    gelar_belakang: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editMode && dosen) {
      setFormData({
        id: dosen.id,
        nama: dosen.nama ?? "",
        email: dosen.email ?? "",
        npp: dosen.npp ?? "",
        gelar_depan: dosen.gelar_depan ?? "",
        gelar_belakang: dosen.gelar_belakang ?? "",
      })
    }
  }, [editMode, dosen])

  const handleChange = (field: keyof Dosen, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nama?.trim()) newErrors.nama = "Nama wajib diisi"
    if (!formData.email?.trim()) {
      newErrors.email = "Email wajib diisi"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const data: Dosen = {
      id: editMode && dosen ? dosen.id : undefined,
      nama: formData.nama ?? "",
      email: formData.email ?? "",
      npp: formData.npp ?? "",
      gelar_depan: formData.gelar_depan ?? "",
      gelar_belakang: formData.gelar_belakang ?? "",
    }

    onSave(data)
  }

  const fields: { label: string; field: keyof Dosen; type?: string }[] = [
    { label: "Gelar Depan", field: "gelar_depan" },
    { label: "Nama", field: "nama" },
    { label: "Gelar Belakang", field: "gelar_belakang" },
    { label: "NPP", field: "npp" },
    { label: "Email", field: "email" },
  ]

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Dosen" : "Tambah Dosen Baru"}</DialogTitle>
          <DialogDescription>
            {editMode ? "Perbarui informasi dosen" : "Masukkan informasi dosen"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map(({ label, field, type }) => (
            <div className="grid grid-cols-4 items-center gap-4" key={field}>
              <Label htmlFor={field} className="text-right">
                {label}
              </Label>
              <div className="col-span-3">
                <Input
                  id={field}
                  type={type ?? "text"}
                  value={formData[field]?.toString() ?? ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className={errors[field] ? "border-destructive" : ""}
                />
                {errors[field] && (
                  <p className="text-destructive text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>{editMode ? "Simpan" : "Tambah Dosen"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}