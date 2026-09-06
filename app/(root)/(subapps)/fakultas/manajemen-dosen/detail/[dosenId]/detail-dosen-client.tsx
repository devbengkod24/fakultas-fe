"use client";

import { Dosen } from "@/types/fakultas/penelitian/penelitian";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap, Briefcase, Pencil, CalendarDays } from "lucide-react";
import Link from "next/link";
import { TridharmaSection } from "../../../_components/manajemen-dosen/tri-dharma-section";
import { ProfileCard } from "../../../_components/manajemen-dosen/profile-card";
import { TtdSection } from "../../../_components/manajemen-dosen/ttd-section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

      {/* Riwayat Karir & Pendidikan (dummy) */}
      {(!!dosen.riwayat_karir?.length || !!dosen.riwayat_pendidikan?.length) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {!!dosen.riwayat_karir?.length && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Riwayat Karir
                  </CardTitle>
                  {!readOnly && (
                    <Link href={`${baseUrl}/${dosen.dosen_id}/edit-riwayat-karir`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dosen.riwayat_karir.map((karir) => (
                    <div
                      key={karir.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{karir.posisi}</p>
                        <p className="text-sm text-muted-foreground">{karir.instasi}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{karir.tahun}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!!dosen.riwayat_pendidikan?.length && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Riwayat Pendidikan
                  </CardTitle>
                  {!readOnly && (
                    <Link href={`${baseUrl}/${dosen.dosen_id}/edit-riwayat-pendidikan`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dosen.riwayat_pendidikan.map((pendidikan) => (
                    <div
                      key={pendidikan.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{pendidikan.jenjang}</p>
                        <p className="text-sm text-muted-foreground">
                          {pendidikan.programStudi} - {pendidikan.instasi}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">{pendidikan.tahun}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Jadwal Mengajar (dummy) */}
      {!!dosen.jadwal_mengajar?.length && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Jadwal Mengajar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Kelompok</TableHead>
                  <TableHead className="w-16">SKS</TableHead>
                  <TableHead>Jadwal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dosen.jadwal_mengajar.map((jadwal, index) => (
                  <TableRow key={jadwal.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{jadwal.mata_kuliah}</TableCell>
                    <TableCell>{jadwal.kelompok}</TableCell>
                    <TableCell>{jadwal.sks}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{jadwal.hari}</span>, {jadwal.jam}
                        <br />
                        <span className="text-muted-foreground">{jadwal.ruang}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
        baseUrl={baseUrl}
        readOnly={readOnly}
        isSelfView={isSelfView}
      />

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