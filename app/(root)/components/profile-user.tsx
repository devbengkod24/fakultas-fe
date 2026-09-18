/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DashboardHeader from "@/components/dashboard-header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProfile } from "@/context/profileUseContext";
import { getInitials } from "@/lib/utils";
import {
  Mail,
  User,
  Shield,
  Phone,
  GraduationCap,
  FileText,
  ExternalLink,
  Loader2,
  Plus,
  LibraryBig,
  Edit2,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import ChangePasswordModal from "./password-componen-profie";
import { handleToastResponse } from "@/lib/toast-response";
import { AuthService } from "@/api";
import { toast } from "sonner";
import MinatForm from "../(subapps)/bimbingan-karir/_components/minatform";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DetailDosenFetcher from "@/app/(root)/(subapps)/fakultas/manajemen-dosen/detail/[dosenId]/detail-dosen-fetcher";
import EwsProfileSection from "./ews-profile-section";

interface ProfileUserProps {
  isBk?: boolean;
}

const ProfileUser = ({ isBk = false }: ProfileUserProps) => {
  const { profile, setProfile, isLoading } = useProfile();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentMinat, setCurrentMinat] = useState<string>("");
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [isEditingMinat, setIsEditingMinat] = useState(false);
  const [isSavingAcademic, setIsSavingAcademic] = useState(false);
  const [academicData, setAcademicData] = useState({
    telepon: "",
    ipk: "",
    transkrip: "",
  });

  useEffect(() => {
    if (profile?.mahasiswa?.minat) {
      setCurrentMinat(profile.mahasiswa.minat);
    }
    if (profile?.mahasiswa) {
      setAcademicData({
        telepon: profile.mahasiswa.telepon || "",
        ipk: profile.mahasiswa.ipk?.toString() || "0",
        transkrip: profile.mahasiswa.transkrip || "",
      });
    }
  }, [profile?.mahasiswa?.minat, profile?.mahasiswa]);

  const handleMinatUpdate = async (minatId: number, minatName: string) => {
    try {
      const res = await AuthService.updateMinatMhs({ minat_id: minatId });
      handleToastResponse(res);
      if (res.success) {
        setCurrentMinat(minatName);
        if (profile?.mahasiswa) {
          setProfile({
            ...profile,
            mahasiswa: { ...profile.mahasiswa, minat: minatName },
          });
        }
      }
    } catch {
      toast.error("Gagal mengubah status minat");
    }
  };

  const handleSaveAcademic = async () => {
    const ipkValue = parseFloat(academicData.ipk);
    if (isNaN(ipkValue) || ipkValue < 0 || ipkValue > 4) {
      toast.error("IPK harus berupa angka antara 0 dan 4");
      return;
    }
    setIsSavingAcademic(true);
    try {
      const res = await AuthService.updateMahasiswa({
        telepon: academicData.telepon,
        ipk: academicData.ipk,
        transkrip: academicData.transkrip,
      });
      handleToastResponse(res);
      if (res.success) {
        setIsEditingAcademic(false);
        if (profile?.mahasiswa) {
          setProfile({
            ...profile,
            mahasiswa: {
              ...profile.mahasiswa,
              telepon: academicData.telepon,
              ipk: ipkValue,
              transkrip: academicData.transkrip,
            },
          });
        }
      }
    } catch {
      toast.error("Gagal memperbarui data akademik");
    } finally {
      setIsSavingAcademic(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile?.mahasiswa) {
      setAcademicData({
        telepon: profile.mahasiswa.telepon || "",
        ipk: profile.mahasiswa.ipk?.toString() || "0",
        transkrip: profile.mahasiswa.transkrip || "",
      });
    }
    setIsEditingAcademic(false);
  };

  if (isLoading || !profile) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/" },
            { name: "Profile", url: "/profile" },
          ]}
          titleItems={[{ title: "Profile Anda", subtitle: "Informasi detail akun Anda" }]}
        />
        <div className="mt-6 flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Memuat data profil...</p>
          </div>
        </div>
      </div>
    );
  }

  const { name, email, roles, permissions = [], foto, mahasiswa } = profile;
  const isMahasiswa = roles === "mahasiswa";
  const isDosen = roles === "dosen";

  return (
    <div className="w-full">
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/" },
          { name: "Profile", url: "/profile" },
        ]}
        titleItems={[{ title: "Profile Anda", subtitle: "Informasi detail akun Anda" }]}
      />

      <div className="space-y-6">
        {/* ─── TOMBOL GANTI PASSWORD (role lain, non-dosen) ─── */}
        {!isDosen && (
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setIsPasswordModalOpen(true)}>
              <Plus size={16} />
              <span className="ml-1">Ganti password</span>
            </Button>
          </div>
        )}

        {/* ─── ROLE DOSEN: DetailDosenFetcher (komponen terpadu, sama dengan admin/fakultas) ─── */}
        {isDosen && (
          isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : !(profile as any).dosen?.dosen_id ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground text-sm">Data dosen tidak ditemukan.</p>
            </div>
          ) : (
            <>
              <DetailDosenFetcher
                dosenId={(profile as any).dosen.dosen_id}
                initialDosen={(profile as any).dosen}
                baseUrl={
                  typeof window !== "undefined" && window.location.pathname.includes("tugas-akhir")
                    ? "/tugas-akhir/profile"
                    : "/kerja-praktek/profile"
                }
                readOnly={false}
                editScope="limited"
                isSelfView={true}
              />
            </>
          )
        )}

        {/* ─── BUKAN DOSEN: Grid informasi kontak + akademik + izin ─── */}
        {!isDosen && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Informasi Kontak */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                    <User className="size-4 text-blue-600" />
                  </div>
                  <span className="truncate">Informasi Kontak</span>
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                    <Mail className="size-4 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium break-all">{email}</p>
                  </div>
                </div>

                {isMahasiswa && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                      <Phone className="size-4 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground">No. Telepon</p>
                      {!isEditingAcademic ? (
                        <p className="font-medium break-all">{mahasiswa?.telepon || "-"}</p>
                      ) : (
                        <Input
                          type="text"
                          value={academicData.telepon}
                          onChange={(e) =>
                            setAcademicData({ ...academicData, telepon: e.target.value })
                          }
                          placeholder="No Telepon (contoh: +628123456789)"
                          className="mt-1"
                        />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informasi Akademik (hanya mahasiswa) */}
            {isMahasiswa && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">
                      <GraduationCap className="size-4 text-primary-600" />
                    </div>
                    <span className="truncate">Informasi Akademik</span>
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isEditingAcademic ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-muted-foreground">NIM</p>
                          <p className="font-medium text-lg break-all">{mahasiswa?.nim}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-muted-foreground">IPK</p>
                          <p className="font-medium text-lg">{mahasiswa?.ipk || "0"}</p>
                        </div>
                        {profile.ews?.dosen_wali && (
                          <div className="p-4 bg-gray-50 rounded-xl sm:col-span-2">
                            <p className="text-sm text-muted-foreground">Dosen Wali</p>
                            <p className="font-medium text-lg">
                              {profile.ews.dosen_wali.nama}
                              {profile.ews.dosen_wali.npp && (
                                <span className="text-xs text-muted-foreground ml-2 font-mono">
                                  ({profile.ews.dosen_wali.npp})
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                        {isBk && (
                          <div className="p-4 bg-gray-50 rounded-xl sm:col-span-2">
                            <p className="text-sm text-muted-foreground">Minat Saat Ini</p>
                            <p className="font-medium text-lg">{currentMinat}</p>
                          </div>
                        )}
                      </div>
                      {mahasiswa?.transkrip && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <FileText className="size-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-muted-foreground">Transkrip</p>
                            
                      <a href={
                                mahasiswa?.transkrip &&
                                /^https?:\/\//i.test(mahasiswa.transkrip.trim())
                                  ? mahasiswa.transkrip.trim()
                                  : "#"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent flex items-center gap-1 break-all"
                            >
                              <span className="truncate">Lihat Transkrip</span>
                              <ExternalLink className="size-4 flex-shrink-0" />
                            </a>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-2">NIM</p>
                        <p className="font-medium text-lg break-all">{mahasiswa?.nim}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ipk">IPK</Label>
                        <Input
                          id="ipk"
                          type="number"
                          step="0.01"
                          min="0"
                          max="4"
                          value={academicData.ipk}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 4)) {
                              setAcademicData({ ...academicData, ipk: value });
                            }
                          }}
                          placeholder="Masukkan IPK (0-4)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="transkrip">URL Transkrip Nilai</Label>
                        <Input
                          id="transkrip"
                          type="text"
                          value={academicData.transkrip}
                          onChange={(e) =>
                            setAcademicData({ ...academicData, transkrip: e.target.value })
                          }
                          placeholder="https://drive.google.com/file/..."
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Hak Akses & Izin */}
            {permissions.length > 0 && (
              <Card className={`shadow-sm ${!isMahasiswa ? "lg:col-span-2" : ""}`}>
                <CardHeader className="pb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">
                      <Shield className="size-4 text-primary-600" />
                    </div>
                    <span className="truncate">Hak Akses & Izin</span>
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {permissions.map((permission, index) => (
                      <Badge key={`${permission}-${index}`} variant="secondary" className="break-all">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Minat Bimbingan Karir (hanya mahasiswa + isBk) */}
            {isBk && isMahasiswa && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4 flex flex-row items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">
                      <LibraryBig className="size-4 text-primary-600" />
                    </div>
                    <span className="truncate">Minat Bimbingan Karir</span>
                  </h3>
                  {!isEditingMinat ? (
                    <Button size="sm" variant="outline" onClick={() => setIsEditingMinat(true)}>
                      <Edit2 size={16} />
                      <span className="ml-1">Edit</span>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setIsEditingMinat(false)}>
                      <X size={16} />
                      <span className="ml-1">Batal</span>
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {!isEditingMinat ? (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-muted-foreground">Minat Saat Ini</p>
                      <p className="font-medium text-lg">{currentMinat}</p>
                    </div>
                  ) : (
                    <MinatForm
                      handleMinatUpdate={async (minatId, minatName) => {
                        await handleMinatUpdate(minatId, minatName);
                        setIsEditingMinat(false);
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ─── EWS Section (hanya mahasiswa) ─── */}
        {isMahasiswa && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                <GraduationCap className="size-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Informasi EWS</h2>
                <p className="text-xs text-muted-foreground">
                  Status akademik & kelulusan berdasarkan Early Warning System
                </p>
              </div>
            </div>
            <EwsProfileSection
              data={profile.ews}
              isLoading={!profile.ews}
            />
          </div>
        )}

        {/* ─── ROLE DOSEN: Hak Akses & Izin (di bawah detail dosen) ─── */}
        {isDosen && (
          <Card className="shadow-sm">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">
                  <Shield className="size-4 text-primary-600" />
                </div>
                <span className="truncate">Hak Akses & Izin</span>
              </h3>
              <Button size="sm" onClick={() => setIsPasswordModalOpen(true)}>
                <Plus size={16} />
                <span className="ml-1">Ganti password</span>
              </Button>
            </CardHeader>
            {permissions.length > 0 && (
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {permissions.map((permission, index) => (
                    <Badge key={`${permission}-${index}`} variant="secondary" className="break-all">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

{/* ─── ROLE DOSEN: Tombol Kembali (paling bawah) ─── */}
        {isDosen && (
          <div>
            <Link
              href={
                typeof window !== "undefined" && window.location.pathname.includes("tugas-akhir")
                  ? "/tugas-akhir"
                  : "/kerja-praktek"
              }
            >
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default ProfileUser;