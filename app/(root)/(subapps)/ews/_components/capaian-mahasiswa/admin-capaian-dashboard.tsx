/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import useSWR from "swr";
import { EWSCapaianMahasiswaService } from "@/api/ews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import KpiCard from "@/components/ui/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaginationControls from "@/components/pagination-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Download,
  BookOpen,
  Users,
  GraduationCap,
  Activity,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/context/profileUseContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MatakuliahGagal,
  DataPerAngkatan,
  TabelCapaianDetail,
  IpsPerSemester,
} from "@/types/ews/capaian-mahasiswa/capaian-mahasiswa";

// ============ Chart Color Palettes ============
// Disamakan dengan dashboard Super Fakultas: bar chart pakai gradasi biru,
// line chart pakai warna-warni per angkatan agar mudah dibedakan.
const BAR_CHART_BLUE_GRADIENT = [
  "#2563EB", // biru gelap
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
  "#BFDBFE", // biru paling terang
];

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

const TopMatakuliahGagalChart = ({
  data,
}: {
  data: MatakuliahGagal[];
  prodiKode?: string;
}) => {
  const chartData = data.map((mk) => ({
    name:
      mk.nama_matakuliah.length > 25
        ? mk.nama_matakuliah.substring(0, 25) + "..."
        : mk.nama_matakuliah,
    fullName: mk.nama_matakuliah,
    kode: mk.kode_matakuliah,
    jumlah: mk.jumlah_mahasiswa_gagal,
  }));

  // Sort & ambil top 10
  chartData.sort((a, b) => b.jumlah - a.jumlah);
  const top10Data = chartData.slice(0, 10);

  const barColors = top10Data.map(
    (_, idx) => BAR_CHART_BLUE_GRADIENT[idx % BAR_CHART_BLUE_GRADIENT.length]
  );

  const getMinWidth = (items: typeof chartData) =>
    items.length > 10 ? `${items.length * 60}px` : "100%";

  return (
    <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-[#2D3E50]">
          Top 10 Matakuliah Gagal
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pt-4">
        <div className="h-80 overflow-x-auto overflow-y-hidden">
          <div style={{ minWidth: getMinWidth(top10Data), height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top10Data}
                margin={{ top: 30, right: 10, left: 10, bottom: 60 }}
                barSize={40}
                barCategoryGap="20%"
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  dy={10}
                />
                <YAxis hide domain={[0, (max: number) => Math.ceil(max * 1.2)]} />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="jumlah" radius={[8, 8, 8, 8]} maxBarSize={40}>
                  <LabelList
                    dataKey="jumlah"
                    position="top"
                    offset={8}
                    style={{ fontSize: 13, fontWeight: 700, fill: "#374151" }}
                  />
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

const RataRataIpsChart = ({
  data,
  prodiKode,
  prodiNama,
  selectedYearFilter,
  onYearFilterChange,
}: {
  data: DataPerAngkatan[];
  prodiKode?: string;
  prodiNama?: string;
  selectedYearFilter: string | null;
  onYearFilterChange: (year: string | null) => void;
}) => {
  const tahunMasukList = data.map((a) => a.tahun_masuk);
  const maxSemesters = data.reduce(
    (max, angkt) =>
      Math.max(max, Object.keys(angkt.ips_per_semester).length),
    0
  );
  const semesterLabels = Array.from(
    { length: maxSemesters },
    (_, i) => `Smt ${i + 1}`
  );

  const chartData = Array.from({ length: maxSemesters }, (_, semIndex) => {
    const semesterKey = `ips_${semIndex + 1}` as keyof IpsPerSemester;
    const entry: Record<string, unknown> = { semester: semesterLabels[semIndex] };

    data.forEach((angk) => {
      const ipsValue = angk.ips_per_semester[semesterKey];
      if (ipsValue !== undefined) {
        entry[angk.tahun_masuk] = ipsValue;
      }
    });

    return entry;
  });

  const filteredTahunList = selectedYearFilter
    ? tahunMasukList.filter((t) => t.toString() === selectedYearFilter)
    : tahunMasukList;

  const filteredChartData = chartData
    .map((entry) => {
      const filteredEntry: Record<string, unknown> = {
        semester: entry.semester,
      };
      filteredTahunList.forEach((t) => {
        if (entry[t] !== undefined) filteredEntry[t] = entry[t];
      });
      return filteredEntry;
    })
    .filter((entry) => Object.keys(entry).length > 1);

  const colors = LINE_CHART_COLORFUL_PALETTE;

  const CustomDot = (props: any) => {
    const { cx, cy, stroke, value } = props;
    if (value === null || value === undefined) return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill={stroke} fillOpacity={0.25} />
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill={stroke}
          stroke="#fff"
          strokeWidth={1}
        />
      </g>
    );
  };

  return (
    <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold text-[#2D3E50]">
              Rata-rata IPS Per Semester
            </CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">
              {prodiKode && prodiNama
                ? `${prodiKode} - ${prodiNama}`
                : "Program Studi Anda"}
            </p>
          </div>
          <Select
            value={selectedYearFilter ?? "all"}
            onValueChange={(val) =>
              onYearFilterChange(val === "all" ? null : val)
            }
          >
            <SelectTrigger className="w-[130px] h-8 text-xs bg-white border-gray-200 whitespace-nowrap">
              <SelectValue placeholder="Semua Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {tahunMasukList.map((t) => (
                <SelectItem key={t} value={t.toString()}>
                  Angkatan {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-4">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredChartData}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={true}
                stroke="#d1d5db"
              />
              <XAxis
                dataKey="semester"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                tickLine={false}
                axisLine={{ stroke: "#9ca3af" }}
                interval={0}
              />
              <YAxis
                domain={[2.0, 4.0]}
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => val.toFixed(1)}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              />
              {filteredTahunList.map((tahun, index) => (
                <Line
                  key={tahun}
                  type="linear"
                  dataKey={tahun}
                  stroke={colors[index % colors.length]}
                  strokeWidth={1.5}
                  dot={<CustomDot />}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// ============ Main Component ============

export default function AdminCapaianDashboard() {
  const { profile } = useProfile();
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedYearFilter, setSelectedYearFilter] = useState<string | null>(null);

  const handleExport = () => {
    setIsExporting(true);
    EWSCapaianMahasiswaService.exportAdminTabelCapaian()
      .then((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ews-tabel-capaian-admin-${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error: Error) => alert("Export gagal: " + error.message))
      .finally(() => setIsExporting(false));
  };

  const { data: responseGagal, error: errorGagal, isLoading: isLoadingGagal } = useSWR(
    ["admin-top-matakuliah-gagal"],
    () => EWSCapaianMahasiswaService.getAdminTopMatakuliahGagal(),
    { revalidateOnFocus: false }
  );

  const { data: responseIps, error: errorIps, isLoading: isLoadingIps } = useSWR(
    ["admin-rata-rata-ips"],
    () => EWSCapaianMahasiswaService.getAdminRataRataIps(),
    { revalidateOnFocus: false }
  );

  const { data: responseTabelDetail, error: errorTabelDetail, isLoading: isLoadingTabelDetail } = useSWR(
    ["admin-tabel-capaian-detail"],
    () => EWSCapaianMahasiswaService.getAdminTabelCapaianDetail(),
    { revalidateOnFocus: false }
  );

  if (isLoadingGagal || isLoadingIps || isLoadingTabelDetail) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (errorGagal || errorIps || errorTabelDetail) {
    return (
      <div className="text-center py-12 text-red-500 bg-red-50 rounded-2xl border border-red-100">
        Gagal memuat data. Silakan coba lagi.
      </div>
    );
  }

  const dataProdiGagal = responseGagal?.data?.data_per_prodi?.[0];
  const dataGagal: MatakuliahGagal[] = dataProdiGagal?.top_matakuliah_gagal || [];
  const totalGagalAll = dataProdiGagal?.total_mahasiswa_gagal || 0;
  const dataIps: DataPerAngkatan[] = responseIps?.data?.data_per_prodi?.[0]?.data_per_angkatan || [];
  const dataTabelDetail: TabelCapaianDetail[] = responseTabelDetail?.data?.data || [];
  const prodiKode = profile?.prodi?.kode_prodi;
  const prodiNama = profile?.prodi?.nama;

  // Hitung ringkasan (sama formula dengan super fakultas)
  const totalMahasiswa = dataIps.reduce(
    (sum, angkt) => sum + angkt.jumlah_mahasiswa,
    0
  );
  const avgAll =
    dataIps.length > 0
      ? dataIps.reduce((sum, angkt) => {
          const ipsValues = Object.values(angkt.ips_per_semester).filter(
            (v) => v !== undefined
          );
          const angktAvg =
            ipsValues.length > 0
              ? ipsValues.reduce((a, b) => a + b, 0) / ipsValues.length
              : 0;
          return sum + angktAvg;
        }, 0) / dataIps.length
      : 0;
  const highest = dataGagal[0];

  // Pagination untuk tabel
  const totalItems = dataTabelDetail.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = dataTabelDetail.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Prodi" value={prodiKode || "-"} color="blue" icon={BookOpen} />
        <KpiCard label="Angkatan" value={dataIps.length} color="purple" icon={GraduationCap} />
        <KpiCard label="Mhs" value={totalMahasiswa} color="amber" icon={Users} />
        <KpiCard label="Avg IPS" value={avgAll.toFixed(2)} color="green" icon={Activity} />
        <KpiCard label="Total Gagal" value={totalGagalAll} color="red" icon={XCircle} />
        <KpiCard label="MK Gagal" value={highest?.jumlah_mahasiswa_gagal || 0} color="amber" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RataRataIpsChart
          data={dataIps}
          prodiKode={prodiKode}
          prodiNama={prodiNama}
          selectedYearFilter={selectedYearFilter}
          onYearFilterChange={setSelectedYearFilter}
        />
        <TopMatakuliahGagalChart data={dataGagal} prodiKode={prodiKode} />
      </div>

      <Card className="shadow-none border-none p-0">
        <CardHeader className="pt-6 flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle>Detail Capaian Per Angkatan</CardTitle>
            <CardDescription className="text-sm">
              Ringkasan capaian per tahun angkatan program studi Anda.
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
                  <TableHead>Tahun Angkatan</TableHead>
                  <TableHead className="text-center">Tren IPS</TableHead>
                  <TableHead className="text-center">Rata-rata SKS Lulus</TableHead>
                  <TableHead className="text-center">Jml MK Gagal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item: TabelCapaianDetail, index: number) => (
                    <TableRow
                      key={index}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <TableCell className="font-medium">
                        {(safePage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="font-bold text-[#2D3E50]">
                        {item.tahun_angkatan}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            item.tren_ips === "Naik"
                              ? "success"
                              : item.tren_ips === "Turun"
                              ? "destructiveOutline"
                              : "secondary"
                          }
                        >
                          {item.tren_ips === "Naik" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : item.tren_ips === "Turun" ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : null}
                          {item.tren_ips}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-gray-700">
                        {Math.ceil(item.rata_rata_sks_lulus || 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Link
                          href={`/ews/capaian-mahasiswa/list-matakuliah?tahun_masuk=${item.tahun_angkatan}`}
                          className="inline-block"
                        >
                          <Badge
                            variant="destructiveOutline"
                            className="cursor-pointer"
                          >
                            {item.jumlah_matakuliah_gagal}
                          </Badge>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-400"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {dataTabelDetail.length === 0 ? (
            <div className="text-center py-12 text-gray-500 italic">
              Tidak ada data tersedia.
            </div>
          ) : (
            <div className="mt-4">
              <PaginationControls
                currentPage={safePage}
                lastPage={totalPages}
                total={totalItems}
                defaultLimit={itemsPerPage}
                onPageChange={setCurrentPage}
                onLimitChange={(n) => {
                  setItemsPerPage(n);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}