"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import { Megaphone, Newspaper, Images, ChevronRight } from "lucide-react";

export interface AdminFakultasSummaryData {
  pengumuman_aktif: number;
  berita_terpublikasi: number;
  hero_slider_aktif: number;
}

interface CardMeta {
  key: keyof AdminFakultasSummaryData;
  title: string;
  subtitle: string;
  unit: string;
  icon: LucideIcon;
  iconColor: string;
  footerBg: string;
  link: string;
}

const CARD_META: CardMeta[] = [
  {
    key: "pengumuman_aktif",
    title: "Pengumuman Aktif",
    subtitle: "Pengumuman tayang di Landing Fakultas",
    unit: "Pengumuman",
    icon: Megaphone,
    iconColor: "text-orange-500",
    footerBg: "bg-orange-500/5 hover:bg-orange-500/10",
    link: "/admin-fakultas/pengumuman/tambah",
  },
  {
    key: "berita_terpublikasi",
    title: "Berita Terpublikasi",
    subtitle: "Artikel berita di Landing Fakultas",
    unit: "Artikel",
    icon: Newspaper,
    iconColor: "text-blue-500",
    footerBg: "bg-blue-500/5 hover:bg-blue-500/10",
    link: "/admin-fakultas/manajemen-berita",
  },
  {
    key: "hero_slider_aktif",
    title: "Hero Slider Aktif",
    subtitle: "Banner utama Landing Fakultas",
    unit: "Banner",
    icon: Images,
    iconColor: "text-purple-500",
    footerBg: "bg-purple-500/5 hover:bg-purple-500/10",
    link: "/admin-fakultas/hero-slider",
  },
];

interface AdminFakultasSummaryCardsProps {
  data?: AdminFakultasSummaryData;
  isLoading?: boolean;
}

export const AdminFakultasSummaryCards = ({
  data,
  isLoading = false,
}: AdminFakultasSummaryCardsProps) => {
  return (
    <>
      {CARD_META.map((card) => {
        const Icon = card.icon;
        const value = data?.[card.key] ?? 0;
        return (
          <Card
            key={card.key}
            className="shadow-none flex flex-col justify-between h-full overflow-hidden border border-gray-200"
          >
            <CardHeader className="flex-col p-4 pb-3 flex-1">
              <CardTitle className="flex items-center justify-between gap-2 font-medium text-gray-800">
                <p className="text-sm">{card.title}</p>
                <Icon className={`size-4 ${card.iconColor}`} />
              </CardTitle>
              <CardDescription>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <p className="text-2xl font-semibold text-foreground mt-1">
                    {value}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      {card.unit}
                    </span>
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1 min-h-[32px] leading-relaxed">
                  {card.subtitle}
                </p>
              </CardDescription>
            </CardHeader>
            <Link href={card.link} className="mt-auto block w-full">
              <div
                className={`${card.footerBg} transition-colors group cursor-pointer w-full py-2.5 px-4 flex justify-between items-center text-primary text-xs font-medium border-t border-gray-100/50`}
              >
                <span>Lihat Selengkapnya</span>
                <ChevronRight
                  strokeWidth={1.5}
                  className="size-4 group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </Link>
          </Card>
        );
      })}
    </>
  );
};
