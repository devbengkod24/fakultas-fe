"use client";

import { LinkGroupService } from "@/api";
import { DashboardService } from "@/api/kerja-praktek";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Users, ExternalLink, Copy, Check } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

/**
 * KerjaPraktekGroupLinks — Grup diskusi KP untuk mahasiswa.
 *
 * 2 section (sumber data berbeda):
 *   1. Grup Global Kerja Praktek  → /link-group/active-koor    (tabel link_groups)
 *   2. Grup Dosen Pembimbing       → /kp/mahasiswa/dosen-link-wa (tabel dosen_periode)
 *
 * Setelah konsolidasi 2026-06-24, link grub dosen pindah dari `link_groups`
 * ke `dosen_periode.link_wa`. Endpoint baru khusus untuk mahasiswa supaya FE
 * tidak perlu hit endpoint dosen (`/kp/dosen/link-wa` yang role-nya dosen).
 */
const KerjaPraktekGroupLinks = () => {
  const type = "KP";

  const [copiedGlobal, setCopiedGlobal] = useState(false);
  const [copiedDosen, setCopiedDosen] = useState(false);

  // Grup global koor (link_groups)
  const { data: globalResponse, isLoading: globalLoading } = useSWR(
    ["link-kp-global", type],
    () => LinkGroupService.getLinkGlobal(type),
    { dedupingInterval: 1000 }
  );

  // Grup dosen pembimbing (dosen_periode.link_wa) — endpoint khusus mhs
  const { data: dosenResponse, isLoading: dosenLoading } = useSWR(
    ["link-kp-dosen-pembimbing"],
    () => DashboardService.getDosenLinkWa(),
    { dedupingInterval: 1000 }
  );

  const globalLink = globalResponse?.data?.link || "";
  const dosenLink = dosenResponse?.data || "";
  const isLoading = globalLoading || dosenLoading;

  const handleCopyToClipboard = async (
    text: string,
    tipe: "global" | "dosen",
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      if (tipe === "global") {
        setCopiedGlobal(true);
        setTimeout(() => setCopiedGlobal(false), 2000);
      } else {
        setCopiedDosen(true);
        setTimeout(() => setCopiedDosen(false), 2000);
      }
      toast.success("Link berhasil disalin!");
    } catch {
      toast.error("Gagal menyalin link");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-5 w-5" />
            Grup Kerja Praktek
          </CardTitle>
          <CardDescription>Akses grup diskusi KP</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-5 w-5" />
          Grup Kerja Praktek
        </CardTitle>
        <CardDescription>Akses grup diskusi KP</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ── Grup Global (koor, dari link_groups) ── */}
        <div>
          <div className="flex items-start gap-3 mb-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
              <MessageSquare className="size-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                Grup Global Kerja Praktek
              </h4>
              <p className="text-xs text-gray-500">
                Diskusi bersama koordinator dan mahasiswa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 rounded-md p-2.5 px-3 border border-gray-200 min-w-0">
              <p className="text-xs text-gray-600 font-medium truncate overflow-hidden">
                {globalLink ? globalLink : "Link belum tersedia"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {globalLink && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => handleCopyToClipboard(globalLink, "global")}
                >
                  {copiedGlobal ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
              {globalLink ? (
                <Link
                  href={globalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="h-9 w-9 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button size="sm" className="h-9 w-9 p-0" disabled>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* ── Grup Dosen Pembimbing (dari dosen_periode.link_wa) ── */}
        <div>
          <div className="flex items-start gap-3 mb-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-violet-100">
              <Users className="size-4 text-violet-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                Grup Dosen Pembimbing
              </h4>
              <p className="text-xs text-gray-500">
                Komunikasi dengan dosen pembimbing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 rounded-md p-2.5 px-3 border border-gray-200 min-w-0">
              <p className="text-xs text-gray-600 font-medium truncate overflow-hidden">
                {dosenLink ? dosenLink : "Link belum tersedia"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {dosenLink && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => handleCopyToClipboard(dosenLink, "dosen")}
                >
                  {copiedDosen ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
              {dosenLink ? (
                <Link
                  href={dosenLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="h-9 w-9 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button size="sm" className="h-9 w-9 p-0" disabled>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KerjaPraktekGroupLinks;