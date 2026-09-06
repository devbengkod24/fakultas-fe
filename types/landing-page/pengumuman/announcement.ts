import type React from "react";
export interface Announcement {
  id: string;
  judul: string;
  isi: string;
  user: string;
  published_at: string | null;
  updated_at: string;
  created_at: string;
  prodi?: string;
  type?: string;
}

export interface AnnouncementResponse {
  data: Announcement[];
  meta: {
    pagination: {
      last_page: number;
      total: number;
    };
  };
}

export interface Tab {
  status: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
