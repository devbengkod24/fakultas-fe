"use client";

import { KuotaDosenService } from "@/api/tugas-akhir";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, UserRoundPen, Users, XCircle } from "lucide-react";

import useSWR from "swr";
import { useProfile } from "@/context/profileUseContext";

interface CountDataProps {
  sisa?: number;
}

const fetcher = () => KuotaDosenService.getOverview().then((res) => res);

const CountData = ({ sisa }: CountDataProps) => {
  const { activeProdiId } = useProfile();
  const {
    data: overviewData,
    error,
    isLoading,
  } = useSWR(["kuota-dosen-overview", activeProdiId], fetcher, {
    dedupingInterval: 1000,
  });

  const overview = overviewData?.data || {};

  const cardData = [
    {
      title: "Jumlah Mhs. Belum Memiliki Dosen",
      icon: XCircle,
      count: overview.mahasiswa_belum_dosbim || 0,
      color: "orange",
      bg: "bg-red-500/10",
      iconBg: "bg-red-500/10 text-red-500",
      titleColor: "text-red-500",
    },
    {
      title: "Jumlah Mhs. Sudah Memiliki Dosen",
      icon: CheckCircle,
      count: overview.mahasiswa_punya_dosbim || 0,
      color: "green",
      bg: "bg-green-500/10",
      iconBg: "bg-green-500/10 text-green-500",
      titleColor: "text-green-500",
    },
    {
      title: "Sisa Kuota Dosen",
      icon: Users,
      count: sisa || 0,
      color: "yellow",
      bg: "bg-yellow-500/10",
      iconBg: "bg-yellow-500/10 text-yellow-500",
      titleColor: "text-yellow-500",
    },
    {
      title: "Jumlah Alokasi Mhs.Periode Ini",
      icon: UserRoundPen,
      count: overview.jumlah_alokasi_mahasiswa || 0,
      color: "blue",
      bg: "bg-blue-500/10",
      iconBg: "bg-blue-500/10 text-blue-500",
      titleColor: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 items-center gap-3 lg:grid-cols-4">
      {cardData.map((card, index) => {
        return (
          <div key={index} className={`${card.bg} rounded-xl p-2.5`}>
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${card.iconBg}`}>
                <card.icon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className={`${card.titleColor}`}>
                  {isLoading ? (
                    <span className="animate-pulse">--</span>
                  ) : error ? (
                    "Error"
                  ) : (
                    card.count
                  )}
                </CardTitle>
                <CardDescription className="text-xs">
                  {card.title}
                </CardDescription>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CountData;
