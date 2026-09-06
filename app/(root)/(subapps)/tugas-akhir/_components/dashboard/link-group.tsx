"use client";

import { LinkGroupService } from "@/api";
import { DashboardService } from "@/api/tugas-akhir";
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

const GlobalGroupLink = () => {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;
  const type = "TA";
  const canSeeDosenLink = role === "dosen" || role === "mahasiswa";

  const [isEditGlobalOpen, setIsEditGlobalOpen] = useState(false);
  const [isEditDosenOpen, setIsEditDosenOpen] = useState(false);
  const [globalLink, setGlobalLink] = useState("");
  const [dosenLink, setDosenLink] = useState("");
  const [isUpdatingGlobal, setIsUpdatingGlobal] = useState(false);
  const [isUpdatingDosen, setIsUpdatingDosen] = useState(false);
  const [copiedGlobal, setCopiedGlobal] = useState(false);
  const [copiedDosen, setCopiedDosen] = useState(false);

  // Only fetch global link for koordinator and mahasiswa
  const { data: response, isLoading } = useSWR(
    role !== "dosen" ? ["link-global", type] : null,
    () => LinkGroupService.getLinkGlobal(type),
    {
      dedupingInterval: 1000,
    }
  );

  // Only fetch dosen link for dosen and mahasiswa.
  // Sumber data: dosen_periode.link_wa (konsolidasi 2026-06-24) — dosen
  // pakai endpoint self-service, mahasiswa resolve via dospem di project TA.
  const { data: dosenResponse, isLoading: dosenLoading } = useSWR(
    canSeeDosenLink ? ["link-dosen-wa-ta", type, role] : null,
    () =>
      role === "dosen"
        ? DashboardService.getLinkWaDosen()
        : DashboardService.getDosenLinkWa(),
    {
      dedupingInterval: 1000,
    }
  );

  const linkGroup = response?.data?.link || "";
  const linkDosen = dosenResponse?.data || "";

  // Pre-populate input fields when opening modals
  const handleOpenGlobalEdit = () => {
    setGlobalLink(linkGroup);
    setIsEditGlobalOpen(true);
  };

  const handleOpenDosenEdit = () => {
    setDosenLink(linkDosen);
    setIsEditDosenOpen(true);
  };

  // Reset input when closing modals
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
    type: "global" | "dosen"
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "global") {
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
        mutate(["link-dosen-wa-ta", type, role]);
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
    <Card className="p-3 shadow-none">
      <CardTitle className="mb-3 flex items-center justify-between gap-2 text-sm font-medium">
        <span>Link Group Tugas Akhir</span>
        <Link2 className="size-4" />
      </CardTitle>
      <div className="flex flex-col gap-3">
        {/* Link Group Global - Only show for koordinator and mahasiswa */}
        {role !== "dosen" && (
          <div>
            {isLoading ? (
              <div className="py-2">
                <Skeleton className="mb-2 h-20 w-full" />
              </div>
            ) : (
              <div>
                <div className="mb-2 flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                    <MessageSquare className="size-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 text-sm font-semibold text-gray-900">
                      Grup Global Tugas Akhir
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
                  <div className="min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-50 p-2.5 px-3">
                    <p className="overflow-hidden truncate text-xs font-medium text-gray-600">
                      {linkGroup ? linkGroup : "Link belum ditambahkan"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {linkGroup && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() =>
                          handleCopyToClipboard(linkGroup, "global")
                        }
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

        {/* Separator - Only show when both sections are visible */}
        {role === "mahasiswa" && <Separator />}

        {/* Link Group Dosen - Only show for dosen and mahasiswa */}
        {canSeeDosenLink && (
          <div>
            {dosenLoading ? (
              <div className="py-2">
                <Skeleton className="mb-2 h-20 w-full" />
              </div>
            ) : (
              <div>
                <div className="mb-2 flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                    <Users className="size-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 text-sm font-semibold text-gray-900">
                      Grup Dosen Pembimbing
                    </h4>
                    <p className="text-xs text-gray-500">
                      Diskusi dengan dosen pembimbing
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
                  <div className="min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-50 p-2.5 px-3">
                    <p className="overflow-hidden truncate text-xs font-medium text-gray-600">
                      {linkDosen ? linkDosen : "Link belum ditambahkan"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {linkDosen && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() =>
                          handleCopyToClipboard(linkDosen, "dosen")
                        }
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
