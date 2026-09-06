"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "@/app/(root)/components/hero-section";
import SearchBar from "@/app/(root)/components/publikasi/search-bar-publikasi";
import Leaderboard from "@/app/(root)/components/publikasi/leaderboard";
import ChartPublikasi from "@/app/(root)/components/publikasi/chart-publikasi";
import TabsSection from "@/app/(root)/components/publikasi/tabs";
import StatsCard from "@/app/(root)/components/publikasi/stats-cards";
import ChartBudgetRiset from "@/app/(root)/components/publikasi/chart-budget-riset";

// Dynamically import components that use useSearchParams to prevent SSR issues
const MainContentSection = dynamic(
  () => import("@/app/(root)/components/publikasi/main-content"),
  {
    ssr: false,
    loading: () => <LoadingSkeleton />,
  }
);

const SideBarLeftSection = dynamic(
  () => import("@/app/(root)/components/publikasi/side-bar-left"),
  {
    ssr: false,
    loading: () => <SidebarSkeleton />,
  }
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

const SidebarSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-32" />
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-6 w-24" />
    <div className="space-y-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  </div>
);

const PublikasiPage = () => {
  const [activeTab, setActiveTab] = useState("artikel");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"title" | "author">("title");

  const handleSearch = (query: string, type: "title" | "author") => {
    setSearchQuery(query);
    setSearchType(type);

    // Reset page to 1 when search changes
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (query.trim()) {
        url.searchParams.set("page", "1");
      } else {
        url.searchParams.delete("page");
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Reset search when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setSearchQuery(""); // Clear search when switching tabs

    // Clear all URL parameters when tab changes for fresh start
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.search = ""; // Clear all search parameters
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <main className="flex-grow min-h-screen" id="PublikasiPage">
      {/* Search variant */}
      <HeroSection
        variant="search"
        title="Publikasi"
        subtitle="Fakultas Ilmu Komputer"
        searchComponent={
          <SearchBar
            onSearch={handleSearch}
            activeTab={activeTab}
            searchQuery={searchQuery}
            searchType={searchType}
          />
        }
      />

      {/* Content Section */}
      <section className="py-6 md:py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Stats Cards - Show on top for mobile */}
          <div className="block lg:hidden mb-6">
            <StatsCard activeTab={activeTab} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="sticky top-28 space-y-4 md:space-y-6">
                <SideBarLeftSection activeTab={activeTab} />
                {/* Publication/Research Chart */}
                <ChartPublikasi activeTab={activeTab} />
              </div>
            </div>

            {/* Main Content - Publication List with Tabs */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="space-y-4 md:space-y-6">
                {/* Tab Navigation */}
                <TabsSection
                  activeTab={activeTab}
                  setActiveTab={handleTabChange}
                />

                {/* Search indicator */}
                {searchQuery && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-blue-800">
                        <span className="font-medium">
                          Mencari &ldquo;{searchQuery}&rdquo; dalam{" "}
                          {searchType === "title" ? "judul" : "penulis"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          // Reset page when clearing search
                          if (typeof window !== "undefined") {
                            const url = new URL(window.location.href);
                            url.searchParams.delete("page");
                            window.history.replaceState({}, "", url.toString());
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        Hapus pencarian
                      </button>
                    </div>
                  </div>
                )}

                {/* Main Content Section */}
                <MainContentSection
                  activeTab={activeTab}
                  searchQuery={searchQuery}
                  searchType={searchType}
                  onSearchChange={handleSearch}
                />
              </div>
            </div>

            {/* Right Sidebar - Stats */}
            <div className="lg:col-span-3 order-3">
              <div className="sticky top-28 space-y-4 md:space-y-6">
                {/* Stats Cards - Hidden on mobile, shown on desktop */}
                <div className="hidden lg:block">
                  <StatsCard activeTab={activeTab} />
                </div>
                {/* Conditional Content based on activeTab */}
                {activeTab === "artikel" ? (
                  /* Leaderboard for artikel tab */
                  <Leaderboard activeTab={activeTab} />
                ) : (
                  /* Budget Chart for riset tab */
                  <ChartBudgetRiset />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PublikasiPage;
