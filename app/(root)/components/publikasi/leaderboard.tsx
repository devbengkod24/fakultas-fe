"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorStateLeaderboard from "./error-state-leaderboard";
import EmptyStateLeaderboard from "./empty-state-leaderboard";
import {
  LadderboardTopAuthorsSuperAdminService,
  LadderboardResearchSuperAdminService,
} from "@/api/superadmin";
import { LeaderboardAuthor } from "@/types/admin/publikasi-page/leaderboard";

interface StatsCardProps {
  activeTab: string;
}

export default function Leaderboard({ activeTab }: StatsCardProps) {
  const router = useRouter();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardAuthor[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle navigation to author profile
  const handleAuthorClick = (authorId: number) => {
    router.push(`/publikasi/dosen/${authorId}`);
  };

  const fetchLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      let response;

      if (activeTab === "artikel") {
        response =
          await LadderboardTopAuthorsSuperAdminService.getAllLadderboardArticle();
      } else {
        response =
          await LadderboardResearchSuperAdminService.getAllLadderboardResearch();
      }

      if (response.success && response.data) {
        setLeaderboardData(response.data);
      } else {
        setError(response.message || "Failed to fetch leaderboard data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getPositionColor = (position: number) => {
    switch (position) {
      case 0:
        return "bg-amber-100";
      case 1:
        return "bg-gray-100";
      case 2:
        return "bg-amber-50";
      default:
        return "bg-white";
    }
  };

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="bg-gradient-to-r from-primary to-primary-500 py-3">
        <CardTitle className="text-center text-white flex items-center justify-center gap-2 text-sm">
          <Trophy className="h-4 w-4" />
          Top Contributors
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center p-3 border-b border-gray-100"
              >
                <Skeleton className="h-7 w-7 rounded-full mr-3" />
                <Skeleton className="h-8 w-8 rounded-full mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <ErrorStateLeaderboard />
          ) : leaderboardData.length === 0 ? (
            // Empty state
            <EmptyStateLeaderboard />
          ) : (
            <>
              {/* Top 3 contributors */}
              {leaderboardData.slice(0, 3).map((user, index) => (
                <div
                  key={user.author_id}
                  className={`${getPositionColor(
                    index
                  )} transition-colors cursor-pointer hover:bg-opacity-80`}
                  onClick={() => handleAuthorClick(user.dosen_id ?? user.author_id)}
                >
                  <div className="flex items-center p-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary-600 mr-3 border border-primary-100 text-sm font-medium">
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-xs font-medium text-gray-800 line-clamp-1 hover:text-primary-600">
                        {user.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {activeTab === "artikel"
                          ? user.article_count
                          : user.research_count}{" "}
                        {activeTab === "artikel"
                          ? "Artikel Publikasi"
                          : "Riset"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Remaining users */}
              {leaderboardData.slice(3).map((user, index) => (
                <div
                  key={user.author_id}
                  className="flex items-center p-3 border-t border-gray-100 transition-colors cursor-pointer hover:bg-gray-50"
                  onClick={() => handleAuthorClick(user.dosen_id ?? user.author_id)}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 mr-3 text-sm font-medium">
                    {index + 4}
                  </div>
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-gray-800 line-clamp-1 hover:text-primary-600">
                      {user.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {activeTab === "artikel"
                        ? user.article_count
                        : user.research_count}{" "}
                      {activeTab === "artikel" ? "Artikel Publikasi" : "Riset"}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
