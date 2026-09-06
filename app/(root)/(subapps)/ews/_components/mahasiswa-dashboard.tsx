/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useSWR from "swr";
import { EWSMahasiswaService } from "@/api/ews";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  AlertCircle,
  CheckCircle2,
  XSquare,
  Book,
  GraduationCap,
  Library,
  User,
} from "lucide-react";
import { useProfile } from "@/context/profileUseContext";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const InfoCard = ({
  label,
  value,
  isRed = false,
}: {
  label: string;
  value: string | number;
  isRed?: boolean;
}) => {
  const borderColor = isRed ? "border-l-red-500" : "border-l-blue-500";
  const iconColor = isRed ? "text-red-600" : "text-blue-600";
  const iconBg = isRed ? "bg-red-100" : "bg-blue-100";

  return (
    <Card className={`overflow-hidden border-l-4 ${borderColor} shadow-none`}>
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
            <GraduationCap className={`size-4 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-lg font-semibold ${isRed ? "text-red-500" : "text-foreground"}`}>
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-4">
    <h2 className="text-sm font-medium">{title}</h2>
    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
  </div>
);

const ProgressBadge = ({
  label,
  isCompleted,
  icon: Icon,
  activeColor,
}: {
  label: string;
  isCompleted: boolean;
  icon: any;
  activeColor: string;
}) => (
  <div
    className={`p-3 rounded-xl border ${
      isCompleted
        ? "bg-white border-gray-100"
        : "bg-gray-50 border-gray-100 opacity-60"
    } flex items-center justify-between transition-all`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-lg ${
          isCompleted ? activeColor : "bg-gray-200 text-gray-400"
        }`}
      >
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs font-bold text-foreground uppercase tracking-tight">
          {label}
        </p>
        <p
          className={`text-[10px] font-bold ${
            isCompleted ? "text-emerald-600" : "text-muted-foreground"
          }`}
        >
          {isCompleted ? "LULUS / DILAMPUI" : "BELUM SELESAI"}
        </p>
      </div>
    </div>
    {isCompleted ? (
      <CheckCircle2 className="text-emerald-500" size={16} />
    ) : (
      <XSquare className="text-gray-300" size={16} />
    )}
  </div>
);

export default function MahasiswaDashboardClient() {
  const { profile } = useProfile();
  const { data: response, isLoading } = useSWR(
    "mahasiswa-profile-ews",
    () => EWSMahasiswaService.getProfile(),
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8 space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="grid grid-cols-4 gap-3">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          </div>
          <div className="xl:col-span-4">
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const data = response?.data;
  if (!data) return null;

  const { mahasiswa, akademik, ews, ips, matakuliah_nilai_de, progress_mk, dosen_wali } = data;

  const chartData = (ips ?? []).map((item: any) => ({
    name: `smt ${item.semester}`,
    ips: item.ips,
  }));

  const displayStatus = ews?.status ?? "normal";
  const isEligible = ews?.status_kelulusan === "eligible";

  const ewsThemes: Record<
    string,
    { bg: string; text: string; badge: string; icon: any; title: string; desc: string }
  > = {
    tepat_waktu: {
      bg: "bg-blue-500/5",
      text: "text-blue-600",
      badge: "bg-blue-500/10 text-blue-600",
      icon: CheckCircle2,
      title: "Status Aman",
      desc: "Anda berada di jalur yang benar untuk lulus tepat waktu.",
    },
    normal: {
      bg: "bg-emerald-500/5",
      text: "text-emerald-600",
      badge: "bg-emerald-500/10 text-emerald-600",
      icon: CheckCircle2,
      title: "Status Normal",
      desc: "Pertahankan performa akademik Anda untuk hasil maksimal.",
    },
    perhatian: {
      bg: "bg-amber-500/5",
      text: "text-amber-600",
      badge: "bg-amber-500/10 text-amber-600",
      icon: AlertCircle,
      title: "Perlu Perhatian",
      desc: "Ada beberapa aspek akademik yang perlu Anda tinjau kembali.",
    },
    kritis: {
      bg: "bg-red-500/5",
      text: "text-red-600",
      badge: "bg-red-500/10 text-red-600",
      icon: AlertCircle,
      title: "Status Kritis",
      desc: "Segera lakukan konsultasi dengan Dosen Wali Anda.",
    },
  };

  const theme = ewsThemes[displayStatus] || ewsThemes["normal"];
  const StatusIcon = theme.icon;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* ── LEFT SIDE (MAIN) ── */}
        <div className="xl:col-span-8 space-y-4">
          {/* Profile Card */}
          <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-none">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-50 flex-shrink-0">
                  {profile?.foto ? (
                    <Image
                      src={profile.foto}
                      alt="Profile"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                      <User size={32} />
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-xl font-bold tracking-tight">{mahasiswa.nama}</h1>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {mahasiswa.nim}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                    {dosen_wali && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/5 rounded-md border border-blue-100">
                        <User size={12} className="text-blue-600" />
                        <span className="text-[10px] font-bold">
                          Wali: {dosen_wali.nama}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
                      <Book size={12} className="text-muted-foreground" />
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {mahasiswa.tahun_masuk}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoCard label="Semester" value={mahasiswa.semester_aktif} />
            <InfoCard
              label="IPK"
              value={parseFloat(akademik.ipk).toFixed(2)}
              isRed={parseFloat(akademik.ipk) < 2.0}
            />
            <InfoCard label="SKS Lulus" value={akademik.sks_lulus} />
            <InfoCard label="SKS Tempuh" value={akademik.sks_tempuh} />
          </div>

          {/* Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className={`border-l-4 ${displayStatus === "kritis" ? "border-l-red-500" : displayStatus === "perhatian" ? "border-l-amber-500" : displayStatus === "normal" ? "border-l-emerald-500" : "border-l-blue-500"} shadow-none`}>
              <CardContent className={`p-4 ${theme.bg}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 bg-white ${theme.text} rounded-lg shadow-sm`}>
                    <StatusIcon size={20} />
                  </div>
                  <div>
                    <div
                      className={`inline-flex items-center px-2 py-0.5 ${theme.badge} rounded-full text-[10px] font-black uppercase tracking-widest mb-2`}
                    >
                      EWS: {displayStatus.replace("_", " ")}
                    </div>
                    <h3 className={`text-sm font-bold ${theme.text} mb-0.5`}>{theme.title}</h3>
                    <p className="text-xs text-muted-foreground opacity-80 leading-relaxed">
                      {theme.desc}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`border-l-4 ${
                isEligible ? "border-l-emerald-500" : "border-l-red-500"
              } shadow-none`}
            >
              <CardContent
                className={`p-4 ${
                  isEligible ? "bg-emerald-500/5" : "bg-red-500/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 bg-white ${
                      isEligible ? "text-emerald-500" : "text-red-500"
                    } rounded-lg shadow-sm`}
                  >
                    {isEligible ? <CheckCircle2 size={20} /> : <XSquare size={20} />}
                  </div>
                  <div>
                    <div
                      className={`inline-flex items-center px-2 py-0.5 ${
                        isEligible
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-red-500/10 text-red-600"
                      } rounded-full text-[10px] font-black uppercase tracking-widest mb-2`}
                    >
                      {isEligible ? "ELIGIBLE" : "TIDAK ELIGIBLE"}
                    </div>
                    {!isEligible ? (
                      <div className="mt-1 space-y-1">
                        {(ews?.alasan_tidak_eligible ?? []).map((alasan: string, i: number) => (
                          <p
                            key={i}
                            className="text-[10px] font-bold text-red-600 flex items-center gap-1.5"
                          >
                            <span className="w-1 h-1 rounded-full bg-red-400" /> {alasan}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-600 font-medium opacity-80">
                        Selamat! Anda telah memenuhi kriteria dasar kelulusan.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart & Progress Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-none border-none p-0">
              <CardContent className="p-0">
                <div className="p-4">
                  <SectionHeader title="Grafik IP Semester" />
                  <div className="h-56 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorIps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2463EB" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#2463EB" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 10,
                            fontWeight: 700,
                            fill: "#94a3b8",
                          }}
                        />
                        <YAxis
                          domain={[0, 4]}
                          ticks={[0, 1, 2, 3, 4]}
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 10,
                            fontWeight: 700,
                            fill: "#94a3b8",
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="ips"
                          stroke="#2463EB"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorIps)"
                          dot={{ r: 4, fill: "#2463EB", strokeWidth: 2, stroke: "#fff" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-none p-0">
              <CardContent className="p-4">
                <SectionHeader title="Progres Matakuliah" />
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <ProgressBadge
                    label="MK Nasional"
                    isCompleted={progress_mk.mk_nasional === "yes"}
                    icon={Book}
                    activeColor="bg-primary text-white"
                  />
                  <ProgressBadge
                    label="MK Fakultas"
                    isCompleted={progress_mk.mk_fakultas === "yes"}
                    icon={Library}
                    activeColor="bg-emerald-600 text-white"
                  />
                  <ProgressBadge
                    label="MK Prodi / Umum"
                    isCompleted={progress_mk.mk_prodi === "yes"}
                    icon={GraduationCap}
                    activeColor="bg-orange-500 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── RIGHT SIDE (SIDEBAR TABLE) ── */}
        <div className="xl:col-span-4">
          <Card className="border-l-4 border-l-blue-500 shadow-none">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle size={16} /> Mata Kuliah D/E
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-500/5 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      <th className="text-center px-2 py-3 w-10">No</th>
                      <th className="text-left px-3 py-3">Matakuliah</th>
                      <th className="text-center px-2 py-3">SKS</th>
                      <th className="text-center px-3 py-3">Nilai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(matakuliah_nilai_de ?? []).length > 0 ? (
                      (matakuliah_nilai_de ?? []).map((mk: any, i: number) => (
                        <tr
                          key={i}
                          className="hover:bg-blue-500/5 transition-colors"
                        >
                          <td className="text-center px-2 py-3 text-xs">{i + 1}</td>
                          <td className="px-3 py-3">
                            <p className="font-bold line-clamp-2 text-xs">{mk.nama_mk}</p>
                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                              {mk.kode_mk}
                            </p>
                          </td>
                          <td className="px-2 py-3 text-center font-bold text-xs">{mk.sks}</td>
                          <td
                            className={`px-3 py-3 text-center font-black ${
                              mk.nilai === "E" ? "text-red-500" : "text-orange-500"
                            }`}
                          >
                            {mk.nilai}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-16 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mb-3">
                            <CheckCircle2 size={24} />
                          </div>
                          <p className="text-xs font-bold text-muted-foreground">
                            Tidak ada nilai D atau E
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Performa akademik sangat baik!
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {(matakuliah_nilai_de ?? []).length > 0 && (
                <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <span>{(matakuliah_nilai_de ?? []).length} Matakuliah</span>
                  <span className="bg-white px-2 py-0.5 rounded-full border border-gray-200">
                    {(matakuliah_nilai_de ?? []).reduce(
                      (sum: number, mk: any) => sum + parseInt(mk.sks),
                      0
                    )}{" "}
                    SKS TOTAL
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
