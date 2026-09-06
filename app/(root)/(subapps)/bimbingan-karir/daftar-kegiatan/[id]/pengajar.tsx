"use client"

import { useState } from "react"
import AttendanceHeaderSection from "@/app/(root)/(subapps)/bimbingan-karir/_components/daftar-kegiatan/pengajar/id/attendance-header-section"
import QrCard from "@/app/(root)/(subapps)/bimbingan-karir/_components/daftar-kegiatan/pengajar/id/QrCard"
import SummaryCard from "@/app/(root)/(subapps)/bimbingan-karir/_components/daftar-kegiatan/pengajar/id/SummaryCard"
import AttendanceTable from "@/app/(root)/(subapps)/bimbingan-karir/_components/daftar-kegiatan/pengajar/id/AttendanceTable"
import AccIzin from "@/app/(root)/(subapps)/bimbingan-karir/_components/daftar-kegiatan/pengajar/id/acc-izin"
import { DaftarKegiatanService, PresensiService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { SkeletonPresensi } from "../../_components/daftar-kegiatan/skeleton"

const fetcherDaftarKegiatanDetail = (id: number) =>
  DaftarKegiatanService.getDaftarKegiatanDetail(id).then((res) => res);

const fetcherGenerateQRCode = async (tempCodeId: number) => {
  const res = await PresensiService.createQrCodeGenerate({ temp_code_id: tempCodeId })
  return res?.qrcode?.code
}

export default function PengajarDetailKegiatan({ id }: { id: string }) {
  const activityId = Number(id)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isQrOpen, setIsQrOpen] = useState(false)
  const [totalMahasiswa, setTotalMahasiswa] = useState(0);
  const [totalHadir, setTotalHadir] = useState(0);

  // Simpan temp_code_id dari response createPresensiQROpen
  const [tempCodeId, setTempCodeId] = useState<number | null>(null)
  const [initialQrCode, setInitialQrCode] = useState<string | undefined>(undefined)

  const { data, isLoading, error } = useSWR(
    activityId ? [`daftar-kegiatan-detail`, activityId] : null,
    () => fetcherDaftarKegiatanDetail(activityId)
  )

  const {
    data: qrCodeValue,
    mutate: mutateQR
  } = useSWR(
    isQrOpen && tempCodeId ? [`qr-generate`, tempCodeId] : null,
    () => fetcherGenerateQRCode(tempCodeId!),
    {
      refreshInterval: isQrOpen ? 30000 : 0,
      fallbackData: initialQrCode,
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false
    }
  )

  const activity = data?.data

  const openQrCode = async () => {
    setIsGenerating(true)
    try {
      const res = await PresensiService.createPresensiQROpen(activityId)
      // Simpan temp_code_id dan code dari response
      setTempCodeId(res.qrcode.temp_code_id)
      setInitialQrCode(res.qrcode.code)
      setIsQrOpen(true)
      mutateQR(res.qrcode.code, false)
    } catch {
      setIsQrOpen(false)
      setTempCodeId(null)
      setInitialQrCode(undefined)
    } finally {
      setIsGenerating(false)
    }
  }

  const closeQrCode = async () => {
    if (!tempCodeId) return

    setIsGenerating(true)
    try {
      await PresensiService.createPresensiQRClose(tempCodeId)
      setIsQrOpen(false)
      setTempCodeId(null)
      setInitialQrCode(undefined)
      mutateQR(undefined, false)
    } catch (err) {
      console.error("Gagal menutup QR:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleQRCode = async () => {
    if (!isQrOpen) {
      await openQrCode()
    } else {
      await closeQrCode()
    }
  }

  if (isLoading) return <SkeletonPresensi />;
  if (error) return <div>Gagal memuat data</div>;

  return (
    <div>
      <AttendanceHeaderSection
        title={activity.nama_kegiatan}
        startDate={new Date(activity.tanggal_mulai + 'T' + activity.waktu_mulai)}
        endDate={new Date(activity.tanggal_selesai + 'T' + activity.waktu_selesai)}
        location={activity.lokasi}
        pengajarName={activity.pengajar?.name}
      />

      <div className="grid md:grid-cols-2 gap-2 mb-4">
        <QrCard
          isOpen={isQrOpen}
          qrCodeValue={qrCodeValue || ""}
        />

        <SummaryCard
          total={totalMahasiswa}
          present={totalHadir}
          isGenerating={isGenerating}
          isOpen={isQrOpen}
          onToggleQr={toggleQRCode}
        />
      </div>

      {/* Grid Layout: Table (left) + Izin Card (right) */}
      <div className="grid lg:grid-cols-3 gap-2">
        {/* Attendance Table - 2 columns */}
        <div className="lg:col-span-2">
          <AttendanceTable
            activityId={activityId}
            category={activity.kategori}
            onSummaryUpdate={(totalM, totalH) => {
              setTotalMahasiswa(totalM);
              setTotalHadir(totalH);
            }}
          />
        </div>

        {/* Izin Presensi Card - 1 column */}
        <div className="lg:col-span-1">
          <AccIzin activityId={activityId} />
        </div>
      </div>
    </div>
  )
}
