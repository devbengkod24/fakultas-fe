"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  FileText,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface KpData {
  pengajuan?: number;
  sidang_belum_dijadwalkan?: number;
  logbook_perlu_disetujui?: number;
}

interface KpSummaryProps {
  data?: KpData;
  loading?: boolean;
}

export const KpSummary = ({ data, loading }: KpSummaryProps) => {
  const cards = [
    {
      title: "Pengajuan KP",
      subtitle: "Data pengajuan yang masih menunggu proses",
      value: data?.pengajuan ?? 0,
      icon: ClipboardList,
      iconColor: "text-blue-500",
      footerBg: "bg-blue-500/5 hover:bg-blue-500/10",
      link: "/kerja-praktek",
    },
    {
      title: "Sidang Belum Dijadwalkan",
      subtitle: "Pengajuan sidang yang belum punya tanggal dan jam",
      value: data?.sidang_belum_dijadwalkan ?? 0,
      icon: FileText,
      iconColor: "text-purple-500",
      footerBg: "bg-purple-500/5 hover:bg-purple-500/10",
      link: "/kerja-praktek",
    },
    {
      title: "Logbook Perlu Disetujui",
      subtitle: "Logbook yang masih membutuhkan persetujuan",
      value: data?.logbook_perlu_disetujui ?? 0,
      icon: BadgeCheck,
      iconColor: "text-emerald-500",
      footerBg: "bg-emerald-500/5 hover:bg-emerald-500/10",
      link: "/kerja-praktek",
    },
  ];

  return (
    <>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="shadow-none w-full flex-1">
            <CardHeader className="flex-col p-4 pb-2">
              <CardTitle className="flex items-center justify-between gap-2 font-medium text-gray-800">
                <p className="text-sm">{card.title}</p>
                <Icon className={`size-4 ${card.iconColor}`} />
              </CardTitle>
              <CardDescription>
                <div className="text-2xl font-semibold text-foreground mt-1">
                  {loading ? (
                    <Skeleton className="h-8 w-16 inline-block" />
                  ) : (
                    <>
                      {card.value}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        Mahasiswa
                      </span>
                    </>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1 min-h-[32px] leading-relaxed">
                  {card.subtitle}
                </div>
              </CardDescription>
            </CardHeader>
            <Link href={card.link}>
              <div
                className={`${card.footerBg} rounded-b-xl transition-colors group cursor-pointer`}
              >
                <div className="px-4 p-2 flex justify-between items-center text-primary text-xs">
                  <span>Lihat Selengkapnya</span>
                  <ChevronRight
                    strokeWidth={1.5}
                    className="size-4 translate-animation"
                  />
                </div>
              </div>
            </Link>
          </Card>
        );
      })}
    </>
  );
};
