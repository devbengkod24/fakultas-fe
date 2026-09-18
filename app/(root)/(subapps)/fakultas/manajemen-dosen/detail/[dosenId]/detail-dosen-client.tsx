"use client";

import { useState } from "react";
import { Dosen } from "@/types/fakultas/penelitian/penelitian";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap, Briefcase, Pencil, Plus, Trash2, CalendarDays } from "lucide-react";
import Link from "next/link";
import { TridharmaSection } from "../../../_components/manajemen-dosen/tri-dharma-section";
import { JadwalMengajarGrid } from "../../../_components/manajemen-dosen/jadwal-mengajar-grid";
import { ProfileCard } from "../../../_components/manajemen-dosen/profile-card";
import { TtdSection } from "../../../_components/manajemen-dosen/ttd-section";
import {
  DialogKeteranganForm,
  KeteranganType,
} from "../../../_components/manajemen-dosen/dialog-keterangan-form";
import {
  DialogJadwalMengajarForm,
  JadwalMengajarFormValue,
} from "../../../_components/manajemen-dosen/dialog-jadwal-mengajar-form";
import { DosenFakultasService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DetailDosenClientProps {
  dosen: Dosen;
  baseUrl?: string;
  readOnly?: boolean;
  editScope?: "full" | "limited";
  isSelfView?: boolean;
  isPublic?: boolean;
  canAssignProdi?: boolean;
}

export default function DetailDosenClient({
  dosen,
  baseUrl = "/fakultas/manajemen-dosen/detail",
  readOnly = false,
  editScope = "full",
  isSelfView = false,
  isPublic = false,
  canAssignProdi = false,
}: DetailDosenClientProps) {
  const [keteranganDialog, setKeteranganDialog] = useState<{
    type: KeteranganType;
    title: string;
    itemId?: number;
    initialValue?: string;
  } | null>(null);
  const [jadwalDialog, setJadwalDialog] = useState<{
    itemId?: number;
    initialValue?: JadwalMengajarFormValue;
  } | null>(null);

  const handleDeleteKeterangan = async (type: KeteranganType, itemId: number) => {
    const res = await DosenFakultasService.deleteKeterangan(dosen.dosen_id, type, itemId);
    handleToastResponse(res);
    if (res?.success) window.location.reload();
  };

  const handleDeleteJadwal = async (itemId: number) => {
    const res = await DosenFakultasService.deleteJadwalMengajar(dosen.dosen_id, itemId);
    handleToastResponse(res);
    if (res?.success) window.location.reload();
  };

  return (
    <div className="space-y-6">

      {/* Profile Card */}
      <ProfileCard
        dosen={dosen}
        onSuccess={() => window.location.reload()}
        readOnly={readOnly}
        editScope={editScope}
        isPublic={isPublic}
        canAssignProdi={canAssignProdi}
      />

      {/* TTD Dosen */}
      {!isPublic && (
        <TtdSection dosenId={dosen.dosen_id} readOnly={readOnly} isSelf={isSelfView} />
      )}

      {/* Statistik Bimbingan */}
      {false && dosen.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Total Mhs Saat Ini", value: dosen.stats?.total_mhs_saat_ini },
            { label: "Jumlah Lulusan", value: dosen.stats?.jumlah_lulusan },
            { label: "Persentase Lulus", value: `${dosen.stats?.lulus_persen}%` },
            { label: "Total Mhs TA", value: dosen.stats?.total_mhs_ta },
            { label: "Kuota TA Baru", value: dosen.stats?.kuota_ta_baru },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xl font-bold">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Kerja Praktek */}
      {false && !!dosen.kerja_praktek?.length && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Bimbingan Kerja Praktek ({dosen.kerja_praktek?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Mahasiswa</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(dosen.kerja_praktek?? []).map((kp, index) => (
                  <TableRow key={kp.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{kp.mahasiswa?.nama ?? "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{kp.judul ?? "-"}</TableCell>
                    <TableCell>{kp.periode?.id ?? "-"}</TableCell>
                    <TableCell>
                      {kp.tanggal_mulai ?? "-"} s/d {kp.tanggal_selesai ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Badge 
                      variant={kp.status === "accepted" ? "default" : "secondary"}
                      style={{ color: "#ffffff" }}
                      >
                        {kp.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Tugas Akhir */}
      {false && !!dosen.projects?.length && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Bimbingan Tugas Akhir ({dosen.projects?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Mahasiswa</TableHead>
                  <TableHead>Jenis Projek</TableHead>
                  <TableHead>Periode Mulai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(dosen.projects ?? []).map((tugas, index) => (
                  <TableRow key={tugas.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{tugas.mahasiswa?.nama ?? "-"}</TableCell>
                    <TableCell>{tugas.jenis_projek?.id ?? "-"}</TableCell>
                    <TableCell>{tugas.periode_mulai?.id ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Riwayat Karir & Pendidikan */}
      {(!!dosen.riwayat_karir?.length || !!dosen.riwayat_pendidikan?.length || !readOnly) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(!!dosen.riwayat_karir?.length || !readOnly) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Riwayat Karir
                  </CardTitle>
                  {!readOnly && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setKeteranganDialog({ type: "riwayat-karir", title: "Tambah Riwayat Karir" })}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {dosen.riwayat_karir?.length ? (
                  <div className="space-y-3">
                    {dosen.riwayat_karir.map((karir) => (
                      <div
                        key={karir.id}
                        className="flex items-start justify-between gap-2 border-b pb-3 last:border-0 last:pb-0"
                      >
                        <p className="text-sm flex-1">{karir.keterangan}</p>
                        {!readOnly && (
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setKeteranganDialog({
                                type: "riwayat-karir",
                                title: "Edit Riwayat Karir",
                                itemId: karir.id,
                                initialValue: karir.keterangan,
                              })}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Riwayat Karir</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin akan menghapus riwayat karir ini?
                                    Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteKeterangan("riwayat-karir", karir.id)}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Belum ada data riwayat karir</p>
                )}
              </CardContent>
            </Card>
          )}

          {(!!dosen.riwayat_pendidikan?.length || !readOnly) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Riwayat Pendidikan
                  </CardTitle>
                  {!readOnly && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setKeteranganDialog({ type: "riwayat-pendidikan", title: "Tambah Riwayat Pendidikan" })}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {dosen.riwayat_pendidikan?.length ? (
                  <div className="space-y-3">
                    {dosen.riwayat_pendidikan.map((pendidikan) => (
                      <div
                        key={pendidikan.id}
                        className="flex items-start justify-between gap-2 border-b pb-3 last:border-0 last:pb-0"
                      >
                        <p className="text-sm flex-1">{pendidikan.keterangan}</p>
                        {!readOnly && (
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setKeteranganDialog({
                                type: "riwayat-pendidikan",
                                title: "Edit Riwayat Pendidikan",
                                itemId: pendidikan.id,
                                initialValue: pendidikan.keterangan,
                              })}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Riwayat Pendidikan</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin akan menghapus riwayat pendidikan ini?
                                    Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteKeterangan("riwayat-pendidikan", pendidikan.id)}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Belum ada data riwayat pendidikan</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Jadwal Mengajar -- catatan resmi diatur prodi/fakultas, dosen sendiri
          (isSelfView) TIDAK boleh nambah/edit/hapus jadwalnya sendiri, cuma
          bisa lihat. Match authorizeJadwalAccess() di BE yang gak include isSelf. */}
      {(!!dosen.jadwal_mengajar?.length || (!readOnly && !isSelfView)) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Jadwal Mengajar
              </CardTitle>
              {!readOnly && !isSelfView && (
                <Button variant="outline" size="sm" onClick={() => setJadwalDialog({})}>
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <JadwalMengajarGrid
              jadwal={dosen.jadwal_mengajar ?? []}
              canManage={!readOnly && !isSelfView}
              onEdit={(jadwal) =>
                setJadwalDialog({
                  itemId: jadwal.id,
                  initialValue: {
                    hari: jadwal.hari,
                    jam: jadwal.jam,
                    kelas: jadwal.kelompok,
                    matkul: jadwal.mata_kuliah,
                    ruang: jadwal.ruang,
                  },
                })
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Tri Dharma */}
      <TridharmaSection
        dosenId={dosen.dosen_id}
        authorId={dosen.author_id}
        authorName={dosen.nama}
        publications={dosen.articles}
        researches={dosen.researches}
        communityServices={dosen.community_services}
        pengabdianSync={dosen.pengabdian}
        kekayaanIntelektual={dosen.kekayaan_intelektual}
        onDataChanged={() => window.location.reload()}
        baseUrl={baseUrl}
        readOnly={readOnly}
        isSelfView={isSelfView}
      />

      {keteranganDialog && (
        <DialogKeteranganForm
          open={!!keteranganDialog}
          dosenId={dosen.dosen_id}
          type={keteranganDialog.type}
          title={keteranganDialog.title}
          itemId={keteranganDialog.itemId}
          initialValue={keteranganDialog.initialValue}
          onClose={() => setKeteranganDialog(null)}
          onSuccess={() => window.location.reload()}
        />
      )}

      {jadwalDialog && (
        <DialogJadwalMengajarForm
          open={!!jadwalDialog}
          dosenId={dosen.dosen_id}
          itemId={jadwalDialog.itemId}
          initialValue={jadwalDialog.initialValue}
          canDelete={!readOnly && !isSelfView}
          onClose={() => setJadwalDialog(null)}
          onSuccess={() => window.location.reload()}
          onDelete={
            jadwalDialog.itemId
              ? () => handleDeleteJadwal(jadwalDialog.itemId as number)
              : undefined
          }
        />
      )}

      {/* Back Button */}
      {!isSelfView && (
      <div>
        <Link href={
          baseUrl.includes("/detail")
            ? baseUrl.split("/detail")[0]
            : baseUrl === "/publikasi/dosen"
            ? "/publikasi"
            : baseUrl
        }>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
      </div>
      )}

    </div>
  );
}