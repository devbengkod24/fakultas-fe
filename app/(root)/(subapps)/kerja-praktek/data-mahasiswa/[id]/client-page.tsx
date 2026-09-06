"use client";

import { MahasiswaService } from '@/api/kerja-praktek';
import React from 'react';
import useSWR from 'swr';
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Briefcase, Building2, Calendar, FileText, MailIcon, PhoneIcon, AlertCircle, UserX, RefreshCw } from "lucide-react"
import { DetailMahasiswa } from "@/types/kerja-praktek/mahasiswa"
import DetailMahasiswaSkeleton from "../../_components/data-mahasiswa/id/skeleton"
import DosenPembimbingCard from "../../_components/data-mahasiswa/id/card-dospem"
import PenyeliaCard from "../../_components/data-mahasiswa/id/card-penyelia"
import EmptyState from "@/components/empty-state"
import withAuth from '@/app/(root)/hoc/withAuth';

const fetcher = (id: number) =>
  MahasiswaService.getDetailMahasiswa(id).then((res) => res.data);

const DetailMahasiswaClientPage = () => {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const { data, isLoading, error, mutate } = useSWR<DetailMahasiswa>(
        ["detail-mahasiswa", id],
        () => fetcher(Number(id)),
        { revalidateOnFocus: false }
    );

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "-";
        const date = new Date(dateString)
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    }

    if (isLoading) {
        return <DetailMahasiswaSkeleton />
    }

    if (error) {
        return (
            <div className="container mx-auto pt-2">
                <Button
                    variant="ghost"
                    className="mb-4 pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke DataMahasiswa
                </Button>

                <EmptyState
                    icon={AlertCircle}
                    title="Terjadi Kesalahan"
                    subtitle={`Gagal memuat detail mahasiswa: ${error.message}`}
                    className="h-[400px]"
                    button={
                        <div className="flex gap-2">
                            <Button onClick={() => mutate()} variant="outline" className="gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Coba Lagi
                            </Button>
                            <Button onClick={() => router.back()}>
                                Kembali ke Data
                            </Button>
                        </div>
                    }
                />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mx-auto pt-2">
                <Button
                    variant="ghost"
                    className="mb-4 pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Data Mahasiswa
                </Button>

                <EmptyState
                    icon={UserX}
                    title="Data Mahasiswa Tidak Ditemukan"
                    subtitle="Mahasiswa dengan ID tersebut tidak ditemukan atau mungkin telah dihapus."
                    className="h-[400px]"
                    button={
                        <div className="flex gap-2">
                            <Button onClick={() => mutate()} variant="outline" className="gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Coba Lagi
                            </Button>
                            <Button onClick={() => router.back()}>
                                Kembali ke Data
                            </Button>
                        </div>
                    }
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto pt-2">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Data Mahasiswa
        </Button>

        <div className="grid gap-4">
            <Card className="shadow-none col">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <Avatar className="h-24 w-24 border">
                            <AvatarImage src={""} alt={data.nama} />
                            <AvatarFallback className="text-2xl">
                                {(data.nama ?? "")
                                .split(" ")
                                .map((nama: string) => nama[0])
                                .join("")
                                .substring(0, 2)}
                            </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between">
                                <div>
                                    <h1 className="text-xl font-semibold capitalize">
                                        {data.nama?.toLowerCase() ?? "Nama tidak diketahui"}
                                    </h1>
                                    <p className="text-gray-500 font-normal">
                                        {data.nim ?? "NIM tidak diketahui"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MailIcon className="size-4" />
                                        <span>
                                            Email: <strong>{data.email ?? "-"}</strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <PhoneIcon className="size-4" />
                                        <span className="text-sm">
                                            Telepon: <strong>{data.telepon ?? "-"}</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Informasi Kerja Praktek</CardTitle>
                </CardHeader>
                <CardContent className='mt-3'>
                    {data.project?.kerja_praktek ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className='col-span-2'>
                            <div className="flex items-start gap-2">
                                <FileText className="h-4 w-4 mt-1"/>
                                <div>
                                    <span className="inline-block w-28">Judul</span>
                                    <span>: {data.project.kerja_praktek.judul}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <Briefcase className="h-4 w-4 mt-1"/>
                                    <div>
                                        <span className="inline-block w-28">Posisi</span>
                                        <span>: {data.project.kerja_praktek.posisi}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Building2 className="h-4 w-4 mt-1"/>
                                    <div>
                                        <span className="inline-block w-28">Perusahaan</span>
                                        <span>: {data.project.kerja_praktek.perusahaan}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <span className="inline-block w-28">Mulai</span>
                                        <span>: {formatDate(data.project.kerja_praktek.tgl_awal)}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <span className="inline-block w-28">Selesai</span>
                                        <span>: {formatDate(data.project.kerja_praktek.tgl_akhir)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : (
                        <EmptyState
                            icon={FileText}
                            title="Belum Ada Informasi Kerja Praktek"
                            subtitle="Mahasiswa ini belum memiliki informasi kerja practise yang terdaftar dalam sistem."
                            className="h-[200px]"
                        />
                    )}
                </CardContent>
            </Card>

            <div className='grid gap-6 md:grid-cols-2'>
                <DosenPembimbingCard dosen={data.project?.dosen} projectId={data.project?.id} mahasiswaId={data.id} />
                <PenyeliaCard penyelia={data.project?.penyelia} />
            </div>
        </div>
    </div>
    )
};

export default withAuth(DetailMahasiswaClientPage, "kerja-praktek", ["koordinator", "super_fakultas"]);