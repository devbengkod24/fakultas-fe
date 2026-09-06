"use client"

import { motion } from "framer-motion"
import { FileText, User, CheckCircle, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { PengajuanSidangForm } from "@/types/kerja-praktek/sidang"

interface DokumenPendukungProps {
  formData: PengajuanSidangForm
  onInputChange: (field: keyof PengajuanSidangForm, value: string | number) => void
  isDisabled: boolean
  hasExistingData?: boolean
}

export function DokumenPendukung({ 
  formData, 
  onInputChange, 
  isDisabled,
  hasExistingData = false
}: DokumenPendukungProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl border border-gray-200"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Dokumen Pendukung</h3>
            <p className="text-xs text-gray-600 mt-1">
              Upload dokumen yang diperlukan untuk pengajuan sidang
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl flex-shrink-0">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <Label htmlFor="link_laporan_akhir" className="text-sm font-semibold text-gray-800 block">
                    Laporan Akhir Kerja Praktek <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Upload laporan akhir yang telah disusun sesuai dengan format yang ditentukan
                  </p>
                </div>
                <Input
                  id="link_laporan_akhir"
                  type="url"
                  value={formData.link_laporan_akhir}
                  onChange={(e) => onInputChange("link_laporan_akhir", e.target.value)}
                  disabled={isDisabled}
                  placeholder={hasExistingData ? "" : "https://drive.google.com/file/d/..."
                  }
                  className={cn(
                    "h-11 text-sm border-2 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 bg-white focus:bg-white",
                    isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
                  )}
                />
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3" />
                  <span>Format: PDF</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-xl flex-shrink-0">
                <User className="w-6 h-6 text-secondary-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <Label htmlFor="link_dokumen_penyelia" className="text-sm font-semibold text-gray-800 block">
                    Dokumen Evaluasi Penyelia <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Dokumen evaluasi atau sertifikat yang diberikan oleh penyelia di tempat magang
                  </p>
                </div>
                <Input
                  id="link_dokumen_penyelia"
                  type="url"
                  value={formData.link_dokumen_penyelia}
                  onChange={(e) => onInputChange("link_dokumen_penyelia", e.target.value)}
                  disabled={isDisabled}
                  placeholder={hasExistingData ? "" : "https://drive.google.com/file/d/..."
                  }
                  className={cn(
                    "h-11 text-sm border-2 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 bg-white focus:bg-white",
                    isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
                  )}
                />
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3" />
                  <span>Dokumen harus ditandatangani perusahaan</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Checklist Dokumen</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                    Pastikan semua dokumen dalam format PDF
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                    Link dokumen dapat diakses oleh dosen pembimbing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                    Laporan akhir sesuai dengan template yang diberikan
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}