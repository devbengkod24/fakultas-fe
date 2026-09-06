"use client";

import { LinkGroupService } from "@/api";
import { DashboardService } from "@/api/kerja-praktek";
import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  Link2,
  ExternalLink,
  Users,
  Edit,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/profileUseContext";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Role = "mahasiswa" | "dosen" | "koordinator" | "super_fakultas";

/**
 * Link Group Kerja Praktek — gabungan 2 section.
 *
 * 1. Grup Global    → /link-group/active-koor + /link-group-koor (tabel link_groups)
 * 2. Grup Dosen     → /kp/dosen/link-wa (dosen sendiri) atau
 *                     /kp/mahasiswa/dosen-link-wa (mahasiswa lihat pembimbing)
 *
 * Catatan: setelah konsolidasi 2026-06-24, grub dosen TIDAK lagi di
 * link_groups melainkan di dosen_periode.link_wa. Endpoint dosen dan endpoint
 * mahasiswa dibedakan karena beda role middleware.
 */
const GlobalGroupLink = () => {
  const { profile } = useProfile();
  const role = (profile?.roles ?? "mahasiswa") as Role;
  const type = "KP";

  const canSeeGlobalLink =
    role === "koordinator" ||
    role === "mahasiswa" ||
    role === "super_fakultas";
  // Section "Grup Dosen Pembimbing" relevan untuk dosen (lihat/edit sendiri)
  // dan mahasiswa (lihat pembimbing). Koor tidak punya konsep pembimbing.
  const canSeeDosenLink = role === "dosen" || role === "mahasiswa";

  const [isEditGlobalOpen, setIsEditGlobalOpen] = useState(false);
  const [isEditDosenOpen, setIsEditDosenOpen] = useState(false);
  const [globalLink, setGlobalLink] = useState("");
  const [dosenLink, setDosenLink] = useState("");
  const [isUpdatingGlobal, setIsUpdatingGlobal] = useState(false);
  const [isUpdatingDosen, setIsUpdatingDosen] = useState(false);
  const [copiedGlobal, setCopiedGlobal] = useState(false);
  const [copiedDosen, setCopiedDosen] = useState(false);

  // ── Global grub koor ──
  const { data: response, isLoading } = useSWR(
    canSeeGlobalLink ? ["link-global", type] : null,
    () => LinkGroupService.getLinkGlobal(type),
    { dedupingInterval: 1000 }
  );

  // ── Dosen grub pembimbing ──
  // Endpoint berbeda per-role:
  //   - dosen: GET /kp/dosen/link-wa (data sendiri, bisa edit)
  //   - mahasiswa: GET /kp/mahasiswa/dosen-link-wa (data pembimbing, read-only)
  const { data: dosenResponse, isLoading: dosenLoading } = useSWR(
    canSeeDosenLink
      ? role === "dosen"
        ? "dosen-link-wa-self"
        : "dosen-link-wa-pembimbing"
      : null,
    () =>
      role === "dosen"
        ? DashboardService.getLinkWaDosen()
        : DashboardService.getDosenLinkWa(),
    { dedupingInterval: 1000 }
  );

  const linkGroup = response?.data?.link || "";
  // dosenResponse shape berbeda: koor/dosen endpoint balikin string langsung,
  // bukan {data: {link}}. Handle keduanya.
  const linkDosen =
    typeof dosenResponse?.data === "string"
      ? dosenResponse.data
      : dosenResponse?.data?.link || "";

  const handleOpenGlobalEdit = () => {
    setGlobalLink(linkGroup);
    setIsEditGlobalOpen(true);
  };

  const handleOpenDosenEdit = () => {
    setDosenLink(linkDosen);
    setIsEditDosenOpen(true);
  };

  useEffect(() => {
    if (!isEditGlobalOpen) {
      setGlobalLink("");
    }
  }, [isEditGlobalOpen]);

  useEffect(() => {
    if (!isEditDosenOpen) {
      setDosenLink("");
    }
  }, [isEditDosenOpen]);

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

  const handleUpdateGlobalLink = async () => {
    setIsUpdatingGlobal(true);
    try {
      const response = await LinkGroupService.createLinkGlobal({
        type: type,
        link: globalLink,
      });

      if (response.success) {
        toast.success("Link grup global berhasil diperbarui");
        setIsEditGlobalOpen(false);
        setGlobalLink("");
        mutate(["link-global", type]);
      } else {
        toast.error("Gagal memperbarui link grup global");
      }
    } catch {
      toast.error("Terjadi kesalahan saat memperbarui link");
    } finally {
      setIsUpdatingGlobal(false);
    }
  };

  const handleUpdateDosenLink = async () => {
    setIsUpdatingDosen(true);
    try {
      const response = await DashboardService.updateLinkWaDosen({
        link_wa: dosenLink,
      });

      if (response.success) {
        toast.success("Link grup dosen berhasil diperbarui");
        setIsEditDosenOpen(false);
        setDosenLink("");
        mutate("dosen-link-wa-self");
      } else {
        toast.error("Gagal memperbarui link grup dosen");
      }
    } catch {
      toast.error("Terjadi kesalahan saat memperbarui link");
    } finally {
      setIsUpdatingDosen(false);
    }
  };

  return (
    <Card className="shadow-none p-4">
      <CardTitle className="text-sm font-medium mb-4 flex items-center gap-2 justify-between">
        <span>Link Group Kerja Praktek</span>
        <Link2 className="size-4" />
      </CardTitle>
      <div className="flex flex-col gap-4">
        {/* Link Group Global - untuk koor & mahasiswa */}
        {canSeeGlobalLink && (
          <div>
            {isLoading ? (
              <div className="py-2">
                <Skeleton className="h-20 w-full mb-2" />
              </div>
            ) : (
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
                      Diskusi dengan koordinator
                    </p>
                  </div>
                  {(role === "koordinator" || role === "super_fakultas") && (
                    <Dialog
                      open={isEditGlobalOpen}
                      onOpenChange={setIsEditGlobalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={handleOpenGlobalEdit}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Link Grup Global</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="global-link">Link Grup</Label>
                            <Input
                              id="global-link"
                              placeholder="Masukkan link grup global"
                              value={globalLink}
                              onChange={(e) => setGlobalLink(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsEditGlobalOpen(false)}
                            >
                              Batal
                            </Button>
                            <Button
                              onClick={handleUpdateGlobalLink}
                              disabled={isUpdatingGlobal}
                            >
                              {isUpdatingGlobal ? "Menyimpan..." : "Simpan"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 rounded-md p-2.5 px-3 border border-gray-200 min-w-0">
                    <p className="text-xs text-gray-600 font-medium truncate overflow-hidden">
                      {linkGroup ? linkGroup : "Link belum ditambahkan"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {linkGroup && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => handleCopyToClipboard(linkGroup, "global")}
                      >
                        {copiedGlobal ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    {linkGroup ? (
                      <Link
                        href={linkGroup}
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
            )}
          </div>
        )}

        {/* Separator hanya tampil kalau kedua section muncul */}
        {canSeeGlobalLink && canSeeDosenLink && <Separator />}

        {/* Link Group Dosen - untuk dosen (edit sendiri) & mahasiswa (read-only) */}
        {canSeeDosenLink && (
          <div>
            {dosenLoading ? (
              <div className="py-2">
                <Skeleton className="h-20 w-full mb-2" />
              </div>
            ) : (
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                    <Users className="size-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      Grup Dosen Pembimbing
                    </h4>
                    <p className="text-xs text-gray-500">
                      Komunikasi dengan dosen pembimbing
                    </p>
                  </div>
                  {role === "dosen" && (
                    <Dialog
                      open={isEditDosenOpen}
                      onOpenChange={setIsEditDosenOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={handleOpenDosenEdit}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Link Grup Dosen</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="dosen-link">Link Grup</Label>
                            <Input
                              id="dosen-link"
                              placeholder="Masukkan link grup dosen"
                              value={dosenLink}
                              onChange={(e) => setDosenLink(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsEditDosenOpen(false)}
                            >
                              Batal
                            </Button>
                            <Button
                              onClick={handleUpdateDosenLink}
                              disabled={isUpdatingDosen}
                            >
                              {isUpdatingDosen ? "Menyimpan..." : "Simpan"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 rounded-md p-2.5 px-3 border border-gray-200 min-w-0">
                    <p className="text-xs text-gray-600 font-medium truncate overflow-hidden">
                      {linkDosen ? linkDosen : "Link belum ditambahkan"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {linkDosen && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => handleCopyToClipboard(linkDosen, "dosen")}
                      >
                        {copiedDosen ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    {linkDosen ? (
                      <Link
                        href={linkDosen}
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
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default GlobalGroupLink;