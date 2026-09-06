import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const DetailMahasiswaSkeleton = () => {
    const router = useRouter()

    return (
        <div className="container mx-auto pt-2">
            <Button
                variant="ghost"
                className="mb-4 pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Daftar Mahasiswa
            </Button>

            <div className="grid gap-4">
                {/* Main Profile Card Skeleton */}
                <Card className="shadow-none col">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <Skeleton className="h-24 w-24 rounded-full" />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between">
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="size-4 rounded" />
                                            <Skeleton className="h-4 w-40" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="size-4 rounded" />
                                            <Skeleton className="h-4 w-36" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Kerja Praktek Info Card Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className='col-span-2'>
                                <div className="flex items-start gap-2">
                                    <Skeleton className="h-4 w-4 mt-1 rounded" />
                                    <div className="flex items-center gap-2 flex-1">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-1" />
                                        <Skeleton className="h-4 w-64" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <Skeleton className="h-4 w-4 mt-1 rounded" />
                                        <div className="flex items-center gap-2 flex-1">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-1" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Skeleton className="h-4 w-4 mt-1 rounded" />
                                        <div className="flex items-center gap-2 flex-1">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-1" />
                                            <Skeleton className="h-4 w-40" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <Skeleton className="h-4 w-4 mt-1 rounded" />
                                        <div className="flex items-center gap-2 flex-1">
                                            <Skeleton className="h-4 w-12" />
                                            <Skeleton className="h-4 w-1" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Skeleton className="h-4 w-4 mt-1 rounded" />
                                        <div className="flex items-center gap-2 flex-1">
                                            <Skeleton className="h-4 w-14" />
                                            <Skeleton className="h-4 w-1" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Dosen & Penyelia Cards Skeleton */}
                <div className='grid gap-6 md:grid-cols-2'>
                    {/* Dosen Pembimbing Card */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-52" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col items-center gap-2">
                                    <Skeleton className="h-24 w-24 rounded-full" />
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-40" />
                                            <Skeleton className="h-4 w-28" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="size-4 rounded" />
                                                <Skeleton className="h-4 w-12" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="size-4 rounded" />
                                                <Skeleton className="h-4 w-16" />
                                                <Skeleton className="h-4 w-28" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Penyelia Card */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col items-center gap-2">
                                    <Skeleton className="h-24 w-24 rounded-full" />
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-40" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="size-4 rounded" />
                                                <Skeleton className="h-4 w-14" />
                                                <Skeleton className="h-4 w-36" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="size-4 rounded" />
                                                <Skeleton className="h-4 w-16" />
                                                <Skeleton className="h-4 w-28" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="size-4 rounded" />
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DetailMahasiswaSkeleton