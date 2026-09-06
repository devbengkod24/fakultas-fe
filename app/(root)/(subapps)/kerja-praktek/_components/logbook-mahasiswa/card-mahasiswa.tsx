import React from 'react';
import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Book, FileText, BookText, ExternalLink, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Logbook } from '@/types/kerja-praktek/logbook';

interface LogbookCardMahasiswaProps {
    logbooks: Logbook[];
    isLoading?: boolean;
}

const LogbookCardMahasiswa = ({ logbooks, isLoading = false }: LogbookCardMahasiswaProps) => {
    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array(3).fill(0).map((_, index) => (
                    <Card key={`skeleton-${index}`} className="overflow-hidden shadow-none">
                        <CardHeader className="bg-muted/50 pb-4">
                            <div className="flex justify-between">
                                <div>
                                    <Skeleton className="h-5 w-32 mb-2" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-8" />
                                    </div>
                                    <Skeleton className="h-2 w-full" />
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Skeleton className="h-9 w-full" />
                                    <Skeleton className="h-9 w-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!logbooks || logbooks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                    <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Belum ada logbook</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    Logbook tidak tersedia.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {logbooks.map((student) => (
                <Card
                    key={`${student.mahasiswa_id}-${student.kerja_praktek_id}`}
                    className="overflow-hidden shadow-none"
                >
                    <CardHeader className="bg-muted/50 pb-4">
                        <CardTitle className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="truncate capitalize">
                                    {student.name?.toLowerCase()}
                                </h3>
                                <p className="text-gray-500 font-normal text-sm mt-1">
                                    {student.nim}
                                </p>
                            </div>
                            <Badge
                                variant={student.status === "Selesai" ? "success" : "secondary"}
                                className="h-fit flex-shrink-0"
                            >
                                {student.status}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-16 w-16 border">
                                <AvatarImage
                                    src={""}
                                    alt={student.name}
                                />
                                <AvatarFallback className="text-lg">
                                    {(student.name ?? "")
                                        .split(" ")
                                        .map((name) => name[0])
                                        .join("")
                                        .substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Book className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Bab Terakhir: <strong>{student.bab_terakhir}</strong>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Total Bimbingan: <strong>{student.total_bimbingan}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Progress</span>
                                    <span>
                                        {student.progress}%
                                    </span>
                                </div>
                                <Progress
                                    value={parseInt((student.progress ?? '0').toString().replace('%', '')) || 0}
                                    className="h-2"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button asChild className="w-full relative">
                                    <Link href={`logbook-mahasiswa/${student.kerja_praktek_id}`}>
                                        <BookText className="mr-1 size-4" />
                                        Lihat Logbook
                                        {student.hasUnapprovedLogbook && (
                                            <div className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 rounded-full border-2 border-white" />
                                        )}
                                    </Link>
                                </Button>

                                {student.link_folder ? (
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="w-full border-[0.5px] bg-transparent border-primary text-primary hover:text-primary"
                                    >
                                        <a
                                            href={student.link_folder}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="mr-1 size-4" />
                                            Folder KP
                                        </a>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        disabled
                                        className="w-full border-[0.5px]"
                                    >
                                        <ExternalLink className="mr-1 size-4" />
                                        Folder KP
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default LogbookCardMahasiswa;