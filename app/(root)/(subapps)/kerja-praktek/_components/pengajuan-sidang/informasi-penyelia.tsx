"use client"

import { motion } from "framer-motion"
import { User, Star, Building, Phone, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { PengajuanSidangForm } from "@/types/kerja-praktek/sidang"

interface InformasiPenyeliaProps {
  formData: PengajuanSidangForm
  onInputChange: (field: keyof PengajuanSidangForm, value: string | number) => void
  isDisabled: boolean
  hasExistingData?: boolean
}

export function InformasiPenyelia({ 
  formData, 
  onInputChange, 
  isDisabled,
  hasExistingData = false
}: InformasiPenyeliaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl border border-gray-200"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary-100 rounded-xl">
            <User className="w-5 h-5 text-secondary-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Informasi Penyelia</h3>
            <p className="text-xs text-gray-600 mt-1">
              Detail lengkap mengenai penyelia yang membimbing selama kerja praktek
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Name & Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <Label htmlFor="nama_penyelia" className="text-sm font-semibold mb-3 block text-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  Nama Penyelia <span className="text-red-500">*</span>
                </div>
              </Label>
              <Input
                id="nama_penyelia"
                value={formData.nama_penyelia}
                onChange={(e) => onInputChange("nama_penyelia", e.target.value)}
                disabled={isDisabled}
                placeholder={hasExistingData ? "" : "Nama lengkap penyelia"}
                className={cn(
                  "h-11 text-sm border-2 focus:border-secondary focus:ring-2 focus:ring-secondary-100 transition-all duration-200 bg-white focus:bg-white",
                  isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
                )}
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <Label htmlFor="posisi_penyelia" className="text-sm font-semibold mb-3 block text-gray-800">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-secondary-600" />
                  Posisi Penyelia <span className="text-red-500">*</span>
                </div>
              </Label>
              <Input
                id="posisi_penyelia"
                value={formData.posisi_penyelia}
                onChange={(e) => onInputChange("posisi_penyelia", e.target.value)}
                disabled={isDisabled}
                placeholder={hasExistingData ? "" : "Manager IT, Senior Developer, dll"}
                className={cn(
                  "h-11 text-sm border-2 focus:border-secondary focus:ring-2 focus:ring-secondary-100 transition-all duration-200 bg-white focus:bg-white",
                  isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
                )}
              />
            </div>
          </div>

          {/* Company & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <Label htmlFor="penyelia_nama_perusahaan" className="text-sm font-semibold mb-3 block text-gray-800">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-secondary-600" />
                  Nama Perusahaan <span className="text-red-500">*</span>
                </div>
              </Label>
              <Input
                id="penyelia_nama_perusahaan"
                value={formData.penyelia_nama_perusahaan}
                onChange={(e) => onInputChange("penyelia_nama_perusahaan", e.target.value)}
                disabled={isDisabled}
                placeholder={hasExistingData ? "" : "PT. Nama Perusahaan"}
                className={cn(
                  "h-11 text-sm border-2 focus:border-secondary focus:ring-2 focus:ring-secondary-100 transition-all duration-200 bg-white focus:bg-white",
                  isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
                )}
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <Label htmlFor="nomor_telepon_penyelia" className="text-sm font-semibold mb-3 block text-gray-800">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-secondary-600" />
                  Nomor Telepon <span className="text-red-500">*</span>
                </div>
              </Label>
              <Input
                id="nomor_telepon_penyelia"
                value={formData.nomor_telepon_penyelia}
                onChange={(e) => onInputChange("nomor_telepon_penyelia", e.target.value)}
                disabled={isDisabled}
                placeholder={hasExistingData ? "" : "0812345678"}
                className={cn(
                  "h-11 text-sm border-2 focus:border-secondary focus:ring-2 focus:ring-secondary-100 transition-all duration-200 bg-white focus:bg-white",
                  isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
                )}
              />
            </div>
          </div>

          {/* Evaluation Score */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <Label htmlFor="nilai_penyelia" className="text-sm font-semibold mb-3 block text-gray-800">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-secondary-600" />
                Nilai Evaluasi dari Penyelia <span className="text-red-500">*</span>
              </div>
            </Label>
            <div className="space-y-3">
              <Input
                id="nilai_penyelia"
                type="text"
                value={formData.nilai_penyelia}
                onChange={(e) => onInputChange("nilai_penyelia", e.target.value)}
                disabled={isDisabled}
                placeholder={hasExistingData ? "" : "Masukkan nilai (0-100)"}
                className={cn(
                  "h-11 text-sm border-2 focus:border-secondary focus:ring-2 focus:ring-secondary-100 transition-all duration-200 bg-white focus:bg-white",
                  isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
                )}
              />
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <AlertCircle className="w-3 h-3" />
                <span>Nilai yang diberikan oleh penyelia berdasarkan performa selama magang</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}