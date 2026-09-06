import { BookOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface MataKuliah {
  kode: string;
  name: string;
  sks: number;
}

interface SemesterData {
  title: string;
  semester: number;
  matkul: MataKuliah[];
  jumlah: number;
}

interface EmptyStateMataKuliahProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
  onUseDummyData?: (data: SemesterData[]) => void;
}

const EmptyStateMataKuliah = ({
  title = "Memuat Data Contoh Mata Kuliah",
  description = "Sedang memuat data contoh mata kuliah untuk memberikan gambaran struktur kurikulum.",
  onRefresh,
  onUseDummyData,
}: EmptyStateMataKuliahProps) => {
  useEffect(() => {
    // Check if this is for peminatan based on title
    const isPeminatanMode = title.includes("Peminatan");
    
    if (isPeminatanMode) {
      // Dummy data for peminatan
      const dummyMataKuliahPeminatan = [
        {
          title: "Mata Kuliah Peminatan RPLD",
          semester: 1,
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
          jumlah: 18,
        },
        {
          title: "Mata Kuliah Peminatan Sistem Cerdas",
          semester: 2,
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
          jumlah: 30,
        },
        {
          title: "Mata Kuliah Peminatan SKKKD",
          semester: 3,
          matkul: [
            { kode: "A11.64609", name: "Komputasi Awan", sks: 3 },
            { kode: "A11.64610", name: "Sistem Tertanam", sks: 3 },
            { kode: "A11.64611", name: "Keamanan Sistem dan Siber", sks: 3 },
            { kode: "A11.64715", name: "Manajemen Jaringan", sks: 3 },
            { kode: "A11.64716", name: "Forensik Digital", sks: 3 },
            { kode: "A11.64717", name: "Lingkungan Cerdas dan Intelijen", sks: 3 },
            { kode: "A11.64718", name: "Internet of Things", sks: 3 },
          ],
          jumlah: 21,
        },
      ];

      if (onUseDummyData) {
        onUseDummyData(dummyMataKuliahPeminatan);
      }
    } else {
      // Existing semester dummy data
      const dummyMataKuliah = [
        {
          title: "Semester 1",
          semester: 1,
          matkul: [
            { kode: "A11.64101", name: "Kalkulus", sks: 3 },
            { kode: "A11.64102", name: "Fisika", sks: 4 },
            { kode: "A11.64103", name: "Dasar Pemrograman", sks: 4 },
            { kode: "A11.64104", name: "Keterampilan Interpersonal", sks: 2 },
            { kode: "AF201704", name: "Dasar - Dasar Komputasi", sks: 2 },
            { kode: "N201701", name: "Bahasa Indonesia", sks: 2 },
            { kode: "N201705", name: "Pendidikan Agama", sks: 2 },
            { kode: "U201704", name: "Pengantar Teknologi Informasi", sks: 2 },
          ],
          jumlah: 21,
        },
        {
          title: "Semester 2",
          semester: 2,
          matkul: [
            { kode: "A11.64201", name: "Matriks dan Ruang Vektor", sks: 3 },
            { kode: "A11.64202", name: "Organisasi dan Arsitektur Komputer", sks: 3 },
            { kode: "A11.64203", name: "Matematika Diskrit", sks: 3 },
            { kode: "A11.64204", name: "Algoritma dan Struktur Data", sks: 4 },
            { kode: "A11.64205", name: "Interaksi Manusia dan Komputer", sks: 3 },
            { kode: "N201707", name: "Pendidikan Pancasila", sks: 2 },
            { kode: "U201701", name: "Dasar Kewirausahaan", sks: 2 },
          ],
          jumlah: 20,
        },
        {
          title: "Semester 3",
          semester: 3,
          matkul: [
            { kode: "A11.64301", name: "Probabilitas dan Statistik", sks: 3 },
            { kode: "A11.64302", name: "Logika Informatika", sks: 3 },
            { kode: "A11.64303", name: "Rekayasa Perangkat Lunak", sks: 3 },
            { kode: "A11.64304", name: "Basis Data", sks: 4 },
            { kode: "A11.64305", name: "Pemrograman Berbasis Web", sks: 2 },
            { kode: "A11.64306", name: "Sistem Operasi", sks: 3 },
            { kode: "N201706", name: "Pendidikan Kewarganegaraan", sks: 2 },
          ],
          jumlah: 20,
        },
        {
          title: "Semester 4",
          semester: 4,
          matkul: [
            { kode: "A11.64401", name: "Otomata dan Teori Bahasa", sks: 3 },
            { kode: "A11.64402", name: "Jaringan Komputer", sks: 3 },
            { kode: "A11.64403", name: "Pemrograman Berorientasi Objek", sks: 4 },
            { kode: "A11.64404", name: "Pemrograman Web Lanjut", sks: 2 },
            { kode: "A11.64405", name: "Pembelajaran Mesin", sks: 3 },
            { kode: "A11.64406", name: "Sistem Basis Data", sks: 2 },
            { kode: "A11.64407", name: "Rangkaian Logika Digital", sks: 3 },
          ],
          jumlah: 20,
        },
        {
          title: "Semester 5",
          semester: 5,
          matkul: [
            { kode: "A11.64501", name: "Sistem Terdistribusi", sks: 3 },
            { kode: "A11.64502", name: "Penambangan Data", sks: 3 },
            { kode: "A11.64503", name: "Sistem Informasi", sks: 3 },
            {
              kode: "A11.64504",
              name: "Manajemen Proyek Teknologi Informasi",
              sks: 3,
            },
            { kode: "A11.64505", name: "Kecerdasan Buatan", sks: 3 },
            { kode: "A11.64506", name: "Kriptografi", sks: 3 },
            { kode: "AF201703", name: "Technopreneurship", sks: 2 },
          ],
          jumlah: 20,
        },
        {
          title: "Semester 6",
          semester: 6,
          matkul: [
            { kode: "A11.64601", name: "Komputasi Numerik", sks: 3 },
            { kode: "A11.64602", name: "Pengembangan Startup Digital", sks: 2 },
            { kode: "N201702", name: "Bahasa Inggris", sks: 2 },
            { kode: "AF201702", name: "Literasi Informasi", sks: 2 },
            { kode: "Peminatan 1", name: "Peminatan 1", sks: 9 },
          ],
          jumlah: 18,
        },
        {
          title: "Semester 7",
          semester: 7,
          matkul: [
            { kode: "A11.64701", name: "Kerja Praktek", sks: 2 },
            { kode: "A11.64702", name: "Metodologi Penelitian", sks: 2 },
            { kode: "A11.64703", name: "Bengkel Koding", sks: 2 },
            { kode: "A11.64704", name: "Tugas Akhir 1", sks: 2 },
            { kode: "Peminatan 2", name: "Peminatan 2", sks: 9 },
          ],
          jumlah: 17,
        },
        {
          title: "Semester 8",
          semester: 8,
          matkul: [
            { kode: "A11.64801", name: "Bimbingan Karir", sks: 2 },
            { kode: "A11.64802", name: "Etika Profesi", sks: 2 },
            { kode: "A11.64803", name: "Tugas Akhir 2", sks: 4 },
          ],
          jumlah: 8,
        },
      ];

      if (onUseDummyData) {
        onUseDummyData(dummyMataKuliah);
      }
    }
  }, [onUseDummyData, title]);

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

export default EmptyStateMataKuliah;
