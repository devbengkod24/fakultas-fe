import { BookOpen, RefreshCw, Star, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface MataKuliah {
  kode: string;
  name: string;
  sks: number;
}

interface PeminatanData {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  matkul: MataKuliah[];
  peminatanName: string;
}

interface EmptyStateMataKuliahPeminatanProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
  onUseDummyData?: (data: PeminatanData[]) => void;
}

const EmptyStateMataKuliahPeminatan = ({
  title = "Memuat Data Contoh Mata Kuliah Peminatan",
  description = "Sedang memuat data contoh mata kuliah peminatan untuk memberikan gambaran program studi.",
  onRefresh,
  onUseDummyData,
}: EmptyStateMataKuliahPeminatanProps) => {
  useEffect(() => {
    // Automatically load dummy data when component mounts
    const dummyMataKuliahPeminatan = [
      {
        id: 1,
        title: "Mata Kuliah Peminatan RPLD",
        icon: Zap,
        color: "from-primary to-primary-500",
        matkul: [
          { kode: "A11.64603", name: "Rekayasa Kebutuhan Perangkat Lunak", sks: 3 },
          {
            kode: "A11.64604",
            name: "Analisis dan Perancangan Berorientasi Objek",
            sks: 3,
          },
          { kode: "A11.64605", name: "Pemrograman Perangkat Bergerak", sks: 3 },
          { kode: "A11.64705", name: "Jaminan Kualitas Perangkat Lunak", sks: 3 },
          { kode: "A11.64706", name: "Pemrograman Sisi Klien", sks: 3 },
          { kode: "A11.64707", name: "Pemrograman Sisi Server", sks: 3 },
        ],
        peminatanName: "RPLD",
      },
      {
        id: 2,
        title: "Mata Kuliah Peminatan Sistem Cerdas",
        icon: Star,
        color: "from-primary to-primary-500",
        matkul: [
          { kode: "A11.64606", name: "Komputer Grafik", sks: 3 },
          { kode: "A11.64607", name: "Pengolahan Citra", sks: 3 },
          { kode: "A11.64608", name: "Sistem Temu Kembali Informasi", sks: 3 },
          {
            kode: "A11.64708",
            name: "Pemrosesan Bahasa Alami Berbasis Teks",
            sks: 3,
          },
          {
            kode: "A11.64709",
            name: "Pemrosesan Bahasa Alami Berbasis Ucapan",
            sks: 3,
          },
          { kode: "A11.64710", name: "Pemrograman Game", sks: 3 },
          { kode: "A11.64711", name: "Pengembangan Game", sks: 3 },
          {
            kode: "A11.64712",
            name: "Penglihatan Komputer dan Analisis Citra",
            sks: 3,
          },
          { kode: "A11.64713", name: "Analisis Data", sks: 3 },
          { kode: "A11.64714", name: "Komputasi Quantum", sks: 3 },
        ],
        peminatanName: "Sistem Cerdas",
      },
      {
        id: 3,
        title: "Mata Kuliah Peminatan SKKKD",
        icon: Shield,
        color: "from-primary to-primary-500",
        matkul: [
          { kode: "A11.64609", name: "Komputasi Awan", sks: 3 },
          { kode: "A11.64610", name: "Sistem Tertanam", sks: 3 },
          { kode: "A11.64611", name: "Keamanan Sistem dan Siber", sks: 3 },
          { kode: "A11.64715", name: "Manajemen Jaringan", sks: 3 },
          { kode: "A11.64716", name: "Forensik Digital", sks: 3 },
          { kode: "A11.64717", name: "Lingkungan Cerdas dan Intelijen", sks: 3 },
          { kode: "A11.64718", name: "Internet of Things", sks: 3 },
        ],
        peminatanName: "SKKKD",
      },
    ];

    if (onUseDummyData) {
      // Remove delay - load immediately
      onUseDummyData(dummyMataKuliahPeminatan);
    }
  }, [onUseDummyData]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-primary-600 animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="outline"
            className="border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Muat Data Asli
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyStateMataKuliahPeminatan;