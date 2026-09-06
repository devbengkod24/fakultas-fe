"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRound, FileText, Beaker } from "lucide-react";
import { SummaryStatisticSuperAdminService } from "@/api/superadmin";
import { SummaryStatistic } from "@/types/admin/publikasi-page/summary-statistic";
import ErrorStateStats from "./error-state-stats";

interface StatsCardProps {
  activeTab: string;
}

const StatsCard = ({ activeTab }: StatsCardProps) => {
  const [summaryData, setSummaryData] = useState<SummaryStatistic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummaryStatistic = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response =
        await SummaryStatisticSuperAdminService.getAllSummaryStatistic();
      if (response.success && response.data) {
        setSummaryData(response.data);
      } else {
        setError(response.message || "Failed to fetch summary data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummaryStatistic();
  }, [fetchSummaryStatistic]);
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <Card className="p-2 bg-primary-50 border border-primary-100 rounded-xl shadow-sm">
              <div className="flex items-center justify-start gap-4">
                <div className="bg-primary-100 p-2 rounded-md">
                  <UserRound className="text-primary-500 w-6 h-6" />
                </div>
                <div>
                  <Skeleton className="h-6 w-8 mb-1" />
                  <div className="text-sm text-gray-500">
                    {activeTab === "artikel" ? "Author" : "Peneliti"}
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-2 bg-secondary-50 border border-secondary-100 rounded-xl shadow-sm">
              <div className="flex items-center justify-start gap-4">
                <div className="bg-secondary-100 p-2 rounded-md">
                  {activeTab === "artikel" ? (
                    <FileText className="text-secondary-500 w-6 h-6" />
                  ) : (
                    <Beaker className="text-green-500 w-6 h-6" />
                  )}
                </div>
                <div>
                  <Skeleton className="h-6 w-12 mb-1" />
                  <div className="text-sm text-gray-500">
                    {activeTab === "artikel" ? "Publikasi" : "Riset"}
                  </div>
                </div>
              </div>
            </Card>
          </>
        ) : error ? (
          <ErrorStateStats error={error} onRetry={fetchSummaryStatistic} />
        ) : activeTab === "artikel" ? (
          <>
            <Card className="p-2 bg-primary-50 border border-primary-100 rounded-xl shadow-sm">
              <div className="flex items-center justify-start gap-4">
                <div className="bg-primary-100 p-2 rounded-md">
                  <UserRound className="text-primary-500 w-6 h-6" />
                </div>
                <div>
                  <div className="text-1md font-bold text-primary-500">
                    {summaryData?.total_article_authors || 0}
                  </div>
                  <div className="text-sm text-gray-500">Author</div>
                </div>
              </div>
            </Card>
            <Card className="p-2 bg-secondary-50 border border-secondary-100 rounded-xl shadow-sm">
              <div className="flex items-center justify-start gap-4">
                <div className="bg-secondary-100 p-2 rounded-md">
                  <FileText className="text-secondary-500 w-6 h-6" />
                </div>
                <div>
                  <div className="text-1md font-bold text-secondary-500">
                    {summaryData?.total_articles || 0}
                  </div>
                  <div className="text-sm text-gray-500">Publikasi</div>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card className="p-2 bg-primary-50 border border-primary-100 rounded-xl shadow-sm">
              <div className="flex items-center justify-start gap-4">
                <div className="bg-primary-100 p-2 rounded-md">
                  <UserRound className="text-primary-500 w-6 h-6" />
                </div>
                <div className="">
                  <div className="text-1md font-bold text-primary-500">
                    {summaryData?.total_research_authors || 0}
                  </div>
                  <div className="text-sm text-gray-500">Peneliti</div>
                </div>
              </div>
            </Card>
            <Card className="p-2 bg-green-50 border border-green-100 rounded-xl shadow-sm">
              <div className="flex items-center justify-start gap-4">
                <div className="bg-green-100 p-2 rounded-md">
                  <Beaker className="text-green-500 w-6 h-6" />
                </div>
                <div className="">
                  <div className="text-1md font-bold text-green-500">
                    {summaryData?.total_researches || 0}
                  </div>
                  <div className="text-sm text-gray-500">Riset</div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default StatsCard;
