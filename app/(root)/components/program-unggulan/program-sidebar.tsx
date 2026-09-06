"use client";

import { Calendar, Users, CheckCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgramSidebarProps {
  activeProgram: {
    id: number;
    title: string;
    application_deadline: string;
    application_link: string;
    statistics?: Array<{
      id: number;
      name: string;
      pivot: {
        program_id: number;
        statistic_id: number;
        value: number;
      };
    }>;
    pengumuman_programs?: Array<{
      id: number;
      title?: string;
      description?: string;
      date?: string;
      type: string;
      program_id?: number;
    }>;
  };
  onRefresh?: () => void;
}

const ProgramSidebar = ({ activeProgram, onRefresh }: ProgramSidebarProps) => {
  // Use announcements from API (pengumuman_programs) if available
  const programAnnouncements = activeProgram.pengumuman_programs || [];

  // Filter and prepare announcements for display
  const filteredAnnouncements = programAnnouncements.filter(
    (announcement) => announcement.title && announcement.description
  );

  // Get dynamic statistics from API
  const getStatistics = () => {
    const stats = activeProgram.statistics || [];

    // Always show first 3 stats, prioritizing common ones
    const priorityOrder = [
      "mahasiswa",
      "student",
      "proyek",
      "project",
      "mitra",
      "partner",
    ];

    // Sort stats by priority, then by name
    const sortedStats = [...stats].sort((a, b) => {
      const aIndex = priorityOrder.findIndex((priority) =>
        a.name.toLowerCase().includes(priority)
      );
      const bIndex = priorityOrder.findIndex((priority) =>
        b.name.toLowerCase().includes(priority)
      );

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

    return sortedStats.slice(0, 3);
  };

  const statistics = getStatistics();

  const renderAnnouncementIcon = (type: string) => {
    switch (type) {
      case "registration":
      case "pendaftaran":
        return <Calendar className="h-3 w-3 md:h-4 md:w-4 text-primary-600" />;
      case "event":
      case "acara":
        return <Users className="h-3 w-3 md:h-4 md:w-4 text-primary-600" />;
      case "update":
      case "hasil":
        return (
          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-primary-600" />
        );
      default:
        return <Bell className="h-3 w-3 md:h-4 md:w-4 text-primary-600" />;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Program Stats */}
      <div className="bg-primary-100/20 rounded-xl border p-4 md:p-6">
        <h3 className="font-bold text-base md:text-lg mb-4">
          Program Highlights
        </h3>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {statistics.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-lg md:text-2xl font-bold text-primary-600">
                {stat.pivot.value}+
              </div>
              <div className="text-xs md:text-sm text-gray-500">
                {stat.name}
              </div>
            </div>
          ))}
          {/* Fill remaining slots if less than 3 statistics */}
          {Array.from({ length: Math.max(0, 3 - statistics.length) }).map(
            (_, index) => (
              <div key={`empty-${index}`} className="text-center">
                <div className="text-lg md:text-2xl font-bold text-primary-600">
                  0+
                </div>
                <div className="text-xs md:text-sm text-gray-500">-</div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Application Info */}
      <div className="bg-gradient-to-r from-primary to-primary-500 rounded-xl shadow-md p-4 md:p-6 text-white">
        <h3 className="font-bold text-base md:text-lg mb-2">Pendaftaran</h3>
        <p className="mb-4 text-sm md:text-base">
          Deadline:{" "}
          <span className="font-semibold">
            {activeProgram.application_deadline}
          </span>
        </p>
        <Button
          className="w-full bg-white text-primary-600 hover:bg-primary-50 text-sm md:text-base md:font-bold"
          onClick={() => window.open(activeProgram.application_link, "_blank")}
        >
          Daftar Sekarang
        </Button>
      </div>

      {/* Program Announcements */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-3 md:p-4 bg-gradient-to-r from-primary to-primary-500 text-white">
          <h3 className="font-bold text-base md:text-lg">Pengumuman Program</h3>
        </div>

        {programAnnouncements.length > 0 && filteredAnnouncements.length > 0 ? (
          <div className="divide-y">
            {filteredAnnouncements.slice(0, 3).map((announcement) => (
              <div
                key={announcement.id}
                className="p-3 md:p-4 hover:bg-primary-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center mr-2 md:mr-3">
                    {renderAnnouncementIcon(announcement.type)}
                  </div>
                  <h4 className="font-semibold text-xs md:text-sm">
                    {announcement.title || "Pengumuman"}
                  </h4>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mb-2">
                  {announcement.description || "Deskripsi tidak tersedia"}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {announcement.date
                      ? new Date(announcement.date).toLocaleDateString("id-ID")
                      : "Tanggal tidak tersedia"}
                  </span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    {announcement.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 md:p-8 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-6 w-6 md:h-8 md:w-8 text-primary-300" />
            </div>
            <h4 className="text-base md:text-lg font-medium text-gray-800 mb-2">
              Belum Ada Pengumuman
            </h4>
            <p className="text-xs md:text-sm text-gray-500 mb-4">
              Saat ini belum ada pengumuman terbaru untuk program-program
              unggulan.
            </p>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                className="text-primary-600 border-primary-200 text-xs md:text-sm"
                onClick={onRefresh}
              >
                Refresh
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramSidebar;
