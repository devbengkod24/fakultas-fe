"use client";

import useSWR from "swr";
import DashboardHeader from "@/components/dashboard-header";
import { useProfile } from "@/context/profileUseContext";
import { AdminFakultasSummaryCards } from "./_components/dashboard/summary-cards";
import {
  PendingValidationSection,
  type PendingAnnouncementItem,
} from "./_components/dashboard/pending-validation";
import { VisitorStatsChart } from "./_components/dashboard/visitor-stats-chart";
import {
  RecentNewsList,
  type RecentNewsItem,
} from "./_components/dashboard/recent-news";
import { AdminFakultasDashboardService } from "@/api/admin-fakultas";

const MODUL_LABEL: Record<string, PendingAnnouncementItem["modul"]> = {
  ta: "TA",
  kp: "KP",
  bk: "BK",
};

const DashboardAdminFakultasClient = () => {
  const { profile } = useProfile();

  const { data: response, isLoading } = useSWR(
    ["admin-fakultas-dashboard-summary"],
    () => AdminFakultasDashboardService.getSummary(),
    { revalidateOnFocus: false },
  );

  const summary = response?.data;

  const pendingItems: PendingAnnouncementItem[] = (
    summary?.pending_validation?.items || []
  ).map((item: any) => ({
    id: item.id,
    judul: item.judul,
    user: item.user,
    prodi: item.prodi?.nama,
    modul: MODUL_LABEL[item.type] ?? "TA",
    created_at: item.created_at,
  }));

  const recentNews: RecentNewsItem[] = (summary?.recent_news || []).map(
    (item: any) => ({
      id: item.id,
      judul: item.judul,
      tipe: item.type,
      published_at: item.published_at,
    }),
  );

  return (
    <>
      <DashboardHeader
        breadcrumbItems={[{ name: "Dashboard", url: "/admin-fakultas" }]}
        titleItems={[
          {
            title: `Selamat Datang, ${profile?.name ?? "Admin Fakultas"}`,
            subtitle: "Pusat Kendali Konten & Validasi Informasi CMS Landing Fakultas.",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 pb-6">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AdminFakultasSummaryCards
              data={
                summary
                  ? {
                      pengumuman_aktif: summary.pengumuman_aktif,
                      berita_terpublikasi: summary.berita_terpublikasi,
                      hero_slider_aktif: summary.hero_slider_aktif,
                    }
                  : undefined
              }
              isLoading={isLoading}
            />
          </div>

          <div className="flex-1">
            <VisitorStatsChart />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <PendingValidationSection
            data={pendingItems}
            isLoading={isLoading}
            totalPending={summary?.pending_validation?.total ?? 0}
          />
          <RecentNewsList data={recentNews} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};

export default DashboardAdminFakultasClient;
