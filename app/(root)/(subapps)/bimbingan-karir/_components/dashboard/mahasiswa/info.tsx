import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ClipboardCheck, CheckCircle, Timer } from "lucide-react"
import { StudentInfoProps } from "@/types/bimbingan-karir/mahasiswa/dashboard"

const StudentInfo = ({ data }: StudentInfoProps) => {
  const studentData = {
    periode: data?.informasi_mahasiswa?.periode?.tahun_ajaran || "-",
    nilaiAkhir: data?.informasi_mahasiswa?.nilai_akhir || "-",
    progressKegiatan: data?.informasi_mahasiswa?.progress_kegiatan 
      ? `${data.informasi_mahasiswa.progress_kegiatan.kegiatan_diikuti} dari ${data.informasi_mahasiswa.progress_kegiatan.total_kegiatan}`
      : "-",
    kegiatanTerdekat: data?.kegiatan_terdekat?.hari_mundur 
      ? `${data.kegiatan_terdekat.hari_mundur} Hari`
      : "Tidak ada kegiatan terdekat",
    namaKegiatanTerdekat: data?.kegiatan_terdekat?.nama_kegiatan,
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Progress Kegiatan */}      
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Progress Kegiatan
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-primary-400" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-foreground break-words">{studentData.progressKegiatan}</p>
          <p className="text-xs text-muted-foreground mt-2">Kegiatan Bimbingan Karir yang telah anda ikuti</p>
        </CardContent>
      </Card>

      {/* Kegiatan Terdekat */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Kegiatan Terdekat
          </CardTitle>
          <Timer className="h-4 w-4 text-primary-400" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-foreground break-words">{studentData.kegiatanTerdekat}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {data?.kegiatan_terdekat 
              ? `Sebelum kegiatan ${studentData.namaKegiatanTerdekat} dimulai`
              : "Kegiatan yang terdekat belum tersedia saat ini"
            }
          </p>
        </CardContent>
      </Card>

      {/* Periode Saat Ini */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Periode Saat Ini
          </CardTitle>
          <Calendar className="h-4 w-4 text-primary-400" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-foreground break-words">{studentData.periode}</p>
          <p className="text-xs text-muted-foreground mt-2">Semester aktif Anda saat ini</p>
        </CardContent>
      </Card>

      {/* Nilai Akhir */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Nilai Akhir
          </CardTitle>
          <ClipboardCheck className="h-4 w-4 text-primary-400" />
        </CardHeader>
        <CardContent>
          {/* <p className="font-semibold text-foreground break-words">{studentData.nilaiAkhir}</p> */}
          <p className="font-semibold text-foreground break-words">-</p>
          <p className="text-xs text-muted-foreground mt-2">Nilai akhir setelah semua kegiatan dikonversi</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentInfo
