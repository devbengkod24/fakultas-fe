/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useSWR from "swr";
import { EWSCapaianMahasiswaService } from "@/api/ews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import KpiCard from "@/components/ui/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
  LabelList,
  Cell,
} from "recharts";
import { AlertTriangle, TrendingUp, TrendingDown, Download, BookOpen, Users, GraduationCap, Activity, XCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  RataIpsData,
  ProdiDataGagal,
  IpsPerSemester,
  TabelCapaianProdi
} from "@/types/ews/capaian-mahasiswa/capaian-mahasiswa";
import PaginationControls from "@/components/pagination-control";
import { useCapaianProdi } from "@/context/capaianProdiContext";
import { useProfile } from "@/context/profileUseContext";

// ============ Chart Color Palettes ============
// Bar chart "Top Matakuliah Gagal": gradasi biru dari gelap ke terang,
// tidak lagi bergantung pada kode prodi (biar konsisten seperti referensi).
const BAR_CHART_BLUE_GRADIENT = [
  "#2563EB", // biru gelap
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
  "#BFDBFE", // biru paling terang
];

// Line chart "Rata-rata IPS Per Semester": warna-warni per angkatan
// agar tiap tahun mudah dibedakan.
const LINE_CHART_COLORFUL_PALETTE = [
  "#2563EB", // biru
  "#16A34A", // hijau
  "#F97316", // oranye
  "#7C3AED", // ungu
  "#DB2777", // pink
  "#06B6D4", // cyan
  "#EAB308", // kuning
];

// ============ Chart Components ============

const TopMatakuliahGagalChart = ({ data }: { data: ProdiDataGagal }) => {
  const chartData = data.top_matakuliah_gagal.map((mk) => ({
    name: mk.nama_matakuliah.length > 25 ? mk.nama_matakuliah.substring(0, 25) + "..." : mk.nama_matakuliah,
    fullName: mk.nama_matakuliah,
    kode: mk.kode_matakuliah,
    jumlah: mk.jumlah_mahasiswa_gagal,
  }));

  chartData.sort((a, b) => b.jumlah - a.jumlah);
  const top10Data = chartData.slice(0, 10);

  const barColors = top10Data.map(
    (_, idx) => BAR_CHART_BLUE_GRADIENT[idx % BAR_CHART_BLUE_GRADIENT.length]
  );

  const getMinWidth = (items: typeof chartData) => {
    if (items.length > 10) {
      return `${items.length * 60}px`;
    }
    return '100%';
  };

  return (
    <Card className="rounded-xl shadow-none border-gray-100 overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-[#2D3E50]">
          Top 10 Matakuliah Gagal
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="h-80 overflow-x-auto overflow-y-hidden">
          <div style={{ minWidth: getMinWidth(top10Data), height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10Data} margin={{ top: 30, right: 10, left: 10, bottom: 60 }} barSize={40} barCategoryGap="20%">
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12 }} angle={-35} textAnchor="end" interval={0} dy={10} />
                <YAxis hide domain={[0, (max: number) => Math.ceil(max * 1.2)]} />
                <Tooltip cursor={false} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="jumlah" radius={[8, 8, 8, 8]} maxBarSize={40}>
                  <LabelList dataKey="jumlah" position="top" offset={8} style={{ fontSize: 13, fontWeight: 700, fill: "#374151" }} />
                  {top10Data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RataRataIpsChart = ({ data, selectedYearFilter, onYearFilterChange }: {
  data: RataIpsData, selectedYearFilter: string | null, onYearFilterChange: (year: string | null) => void
}) => {
  const tahunMasukList = data.data_per_angkatan.map((a) => a.tahun_masuk);
  const maxSemesters = data.data_per_angkatan.reduce((max, angkt) => Math.max(max, Object.keys(angkt.ips_per_semester).length), 0);
  const semesterLabels = Array.from({ length: maxSemesters }, (_, i) => `Smt ${i + 1}`);

  const chartData = Array.from({ length: maxSemesters }, (_, semIndex) => {
    const entry: any = { semester: semesterLabels[semIndex] };
    data.data_per_angkatan.forEach((angk) => {
      const val = angk.ips_per_semester[`ips_${semIndex + 1}` as keyof IpsPerSemester];
      if (val !== undefined) entry[angk.tahun_masuk] = val;
    });
    return entry;
  });

  const filteredTahunList = selectedYearFilter ? tahunMasukList.filter(t => t.toString() === selectedYearFilter) : tahunMasukList;
  const filteredChartData = chartData.map(entry => {
    const filteredEntry: any = { semester: entry.semester };
    filteredTahunList.forEach(t => { if (entry[t] !== undefined) filteredEntry[t] = entry[t]; });
    return filteredEntry;
  }).filter(entry => Object.keys(entry).length > 1);

  const colors = LINE_CHART_COLORFUL_PALETTE;

  const CustomDot = (props: any) => {
    const { cx, cy, stroke, value } = props;
    if (value === null || value === undefined) return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill={stroke} fillOpacity={0.25} />
        <circle cx={cx} cy={cy} r={3} fill={stroke} stroke="#fff" strokeWidth={1} />
      </g>
    );
  };

  return (
    <Card className="rounded-xl shadow-none border-gray-100 overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-[#2D3E50]">Rata-rata IPS Per Semester</CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">{data.prodi.kode_prodi} - {data.prodi.nama_prodi}</p>
          </div>
          <Select value={selectedYearFilter ?? "all"} onValueChange={(val) => onYearFilterChange(val === "all" ? null : val)}>
            <SelectTrigger className="h-9 w-[140px] bg-white border-input"><SelectValue placeholder="Semua Tahun" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {tahunMasukList.map(t => <SelectItem key={t} value={t.toString()}>Angkatan {t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-4">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#d1d5db" />
              <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={{ stroke: '#9ca3af' }} interval={0} />
              <YAxis domain={[2.0, 4.0]} tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(val) => val.toFixed(1)} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              {filteredTahunList.map((tahun, index) => (
                <Line key={tahun} type="linear" dataKey={tahun} stroke={colors[index % colors.length]} strokeWidth={1.5} dot={<CustomDot />} activeDot={{ r: 6 }} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// ============ Main Component ============

export default function SuperFakultasCapaianDashboard() {
  const { profile } = useProfile();
  const { selectedProdiId } = useCapaianProdi();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    EWSCapaianMahasiswaService.exportSuperFakultasTabelCapaian()
      .then((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ews-tabel-capaian-super-fakultas-${new Date().toISOString().split(`T`)[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error: any) => alert(`Export gagal: ${error.message}`))
      .finally(() => setIsExporting(false));
  };
  const [selectedYearFilter, setSelectedYearFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data: responseGagal } = useSWR(["super-fakultas-top-matakuliah-gagal"], () => EWSCapaianMahasiswaService.getSuperFakultasTopMatakuliahGagal(), { revalidateOnFocus: false });
  const { data: responseIps } = useSWR(["super-fakultas-rata-rata-ips"], () => EWSCapaianMahasiswaService.getSuperFakultasRataRataIps(), { revalidateOnFocus: false });
  const { data: responseTabel } = useSWR(["super-fakultas-tabel-capaian"], () => EWSCapaianMahasiswaService.getSuperFakultasTabelCapaian(), { revalidateOnFocus: false });

  if (!responseGagal || !responseIps || !responseTabel) return <div className="p-10"><Skeleton className="h-96" /></div>;

  const dataIpsPerProdi = (responseIps?.data?.data_per_prodi || []).sort((a: any, b: any) => a.prodi.kode_prodi.localeCompare(b.prodi.kode_prodi));

  const effectiveProdiId = selectedProdiId || profile?.daftar_prodi?.[0]?.id?.toString() || dataIpsPerProdi[0]?.prodi?.id?.toString();

  const selectedIpsData = dataIpsPerProdi.find(p => p.prodi.id.toString() === effectiveProdiId);
  const selectedGagalData = responseGagal?.data?.data_per_prodi?.find(p => p.prodi.id.toString() === effectiveProdiId);

  const totalMahasiswa = selectedIpsData?.data_per_angkatan.reduce((sum, a) => sum + a.jumlah_mahasiswa, 0) || 0;
  const ipsValues = selectedIpsData ? Object.values(selectedIpsData.data_per_angkatan).flatMap(a => Object.values(a.ips_per_semester)).filter(v => v !== undefined) : [];
  const avgAll = ipsValues.length > 0 ? ipsValues.reduce((a, b) => (a || 0) + (b || 0), 0) / ipsValues.length : 0;
  const totalGagal = selectedGagalData?.total_mahasiswa_gagal ?? 0;
  const highest = selectedGagalData?.top_matakuliah_gagal?.[0];

  const allProdiData: TabelCapaianProdi[] = responseTabel?.data?.data_per_prodi || [];
  const totalData = allProdiData.length;
  const lastPage = Math.max(1, Math.ceil(totalData / limit));
  const offset = (currentPage - 1) * limit;
  const paginatedData = allProdiData.slice(offset, offset + limit);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Prodi" value={selectedIpsData?.prodi.kode_prodi || "-"} color="blue" icon={BookOpen} />
        <KpiCard label="Angkatan" value={selectedIpsData?.data_per_angkatan.length || 0} color="purple" icon={GraduationCap} />
        <KpiCard label="Mhs" value={totalMahasiswa} color="amber" icon={Users} />
        <KpiCard label="Avg IPS" value={avgAll.toFixed(2)} color="green" icon={Activity} />
        <KpiCard label="Total Gagal" value={totalGagal} color="red" icon={XCircle} />
        <KpiCard label="MK Gagal" value={highest?.jumlah_mahasiswa_gagal || 0} color="amber" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedIpsData && (
          <RataRataIpsChart
            data={selectedIpsData}
            selectedYearFilter={selectedYearFilter}
            onYearFilterChange={setSelectedYearFilter}
          />
        )}
        {selectedGagalData && (
          <TopMatakuliahGagalChart data={selectedGagalData} />
        )}
      </div>

      <Card className="shadow-none border-none p-0">
        <CardHeader className="pt-6 flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle>Tabel Capaian Mahasiswa</CardTitle>
            <CardDescription className="text-sm">
              Ringkasan capaian mahasiswa per program studi.
            </CardDescription>
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export XLSX
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-10">No</TableHead>
                  <TableHead>Program Studi</TableHead>
                  <TableHead className="text-center">Tren IPS</TableHead>
                  <TableHead className="text-center">Rata-rata SKS Lulus</TableHead>
                  <TableHead className="text-center">Jml MK Gagal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((p: TabelCapaianProdi, i: number) => (
                    <TableRow key={p.prodi.id} className="hover:bg-muted/30 transition-colors group">
                      <TableCell className="font-medium">{offset + i + 1}</TableCell>
                      <TableCell>
                        <Link
                          href={`/ews/capaian-mahasiswa/detail?prodi_id=${p.prodi.id}&prodi_nama=${encodeURIComponent(p.prodi.nama_prodi)}`}
                          className="inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                        >
                          <span className="font-semibold text-[#2D3E50]">{p.prodi.kode_prodi}</span>
                          <span className="text-gray-600">{p.prodi.nama_prodi}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={p.tren_ips === "Naik" ? "success" : p.tren_ips === "Turun" ? "destructiveOutline" : "secondary"}>
                          {p.tren_ips === "Naik" ? <TrendingUp className="w-3 h-3" /> : p.tren_ips === "Turun" ? <TrendingDown className="w-3 h-3" /> : null}
                          {p.tren_ips}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-gray-700">{Math.ceil(p.rata_rata_sks_lulus)}</TableCell>
                      <TableCell className="text-center">
                        <Link href={`/ews/capaian-mahasiswa/list-matakuliah?prodi_id=${p.prodi.id}&prodi_nama=${encodeURIComponent(p.prodi.nama_prodi)}`} className="inline-block">
                          <Badge variant="destructiveOutline" className="cursor-pointer">
                            {p.jumlah_matakuliah_gagal}
                          </Badge>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        <div className="mt-4">
          <PaginationControls
            currentPage={currentPage}
            lastPage={lastPage}
            total={totalData}
            defaultLimit={limit}
            onPageChange={setCurrentPage}
            onLimitChange={(newLimit: number) => {
              setLimit(newLimit);
              setCurrentPage(1);
            }}
          />
        </div>
        </CardContent>
      </Card>
    </div>
  );
}