import EmptyState from '@/components/empty-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { KegiatanItem } from '@/types/bimbingan-karir/koordinator/dashboard/mahasiswa/dashboard'
import { MapPin, ClipboardList, CalendarDays, FileText, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface DaftarKegiatanProps {
  data?: {
    daftar_kegiatan?: {
      akan_berlangsung?: KegiatanItem[];
      sedang_berlangsung?: KegiatanItem[];
      selesai?: KegiatanItem[];
    };
  };
}

const getBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "akan berlangsung":
      return "primary";
    case "sedang berlangsung":
      return "secondary";
    case "selesai":
      return "success";
    default:
      return "default";
  }
}

const formatDate = (input: string | Date) => {
  const date = new Date(input)
  return isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date)
}

const formatStatus = (status: string) => {
  switch (status) {
    case "akan_berlangsung":
      return "Akan Berlangsung";
    case "sedang_berlangsung":
      return "Sedang Berlangsung";
    case "selesai":
      return "Selesai";
    default:
      return status;
  }
}

const DaftarKegiatanDashboard: React.FC<DaftarKegiatanProps> = ({ data }) => {
  const allKegiatan = React.useMemo(() => {
    if (!data) return [];
    
    const kegiatan: Array<KegiatanItem & { status: string }> = [];
    
    Object.entries(data).forEach(([statusKey, items]) => {
      if (Array.isArray(items)) {
        items.forEach(item => {
          kegiatan.push({
            ...item,
            // Tambahkan poster dummy untuk testing
            poster: item.poster,
            status: formatStatus(statusKey)
          });
        });
      }
    });
    
    return kegiatan;
  }, [data]);

  const isEmpty = allKegiatan.length === 0;

  return (
    <Card className='pb-4'>
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <FileText className="size-5" />
          Rekap Kegiatan 
        </CardTitle>
        <CardDescription>
          Berikut adalah rekap kegiatan Bimbingan Karir yang ada.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 max-h-[45vh] overflow-y-auto pr-2">
        {isEmpty ? (
          <EmptyState 
            icon={ClipboardList}
            title="Tidak ada kegiatan" 
            subtitle="Belum ada kegiatan yang ditambahkan"
            className="h-80" 
          />
        ) : (
          allKegiatan.map((item, index) => {
            const timeRange = `${formatDate(item.tanggal_mulai)} - ${formatDate(item.tanggal_selesai)}`;
            
            return (
              <div
                key={index}
                className="p-4 bg-sidebar rounded-lg border"
              >
                <div className="grid lg:grid-cols-12 grid-cols-1 gap-2 lg:gap-4">

                  {/* COL 1–6 : Poster + Info (flex) */}
                  <div className="flex items-center gap-3 lg:col-span-6 col-span-1">
                    {/* Poster */}
                    {item.poster && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative w-14 h-14 lg:w-16 lg:h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer group">
                            <Image
                              src={item.poster}
                              alt={`Poster ${item.nama_kegiatan}`}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-[95vw] sm:w-full rounded-lg">
                          <DialogTitle className="mb-4 font-semibold text-lg">Poster  {item.nama_kegiatan}</DialogTitle>
                          <div className="relative w-full max-h-[80vh] overflow-auto">
                            <Image
                              src={item.poster}
                              alt={`Poster ${item.nama_kegiatan}`}
                              width={800}
                              height={1200}
                              className="w-full h-auto object-contain rounded-lg"
                              unoptimized
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 truncate">
                        {item.nama_kegiatan}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{item.lokasi}</span>
                      </p>
                    </div>
                  </div>

                  {/* COL 7-12: Badge + Tanggal (stacked on lg, horizontal on xl) */}
                  <div className="lg:col-span-6 col-span-1 flex flex-col xl:flex-row gap-1.5 xl:gap-4 justify-center xl:items-center">
                    {/* Tanggal */}
                    <div className="flex items-center lg:justify-end xl:justify-start gap-2 text-xs text-muted-foreground xl:flex-1 order-2 xl:order-1">
                      <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{timeRange}</span>
                    </div>
                    
                    {/* Badge Status */}
                    <div className="flex items-center lg:justify-end order-1 xl:order-2">
                      <Badge variant={getBadgeVariant(item.status)} className="whitespace-nowrap text-xs px-2.5 py-0.5">
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  )
}

export default DaftarKegiatanDashboard