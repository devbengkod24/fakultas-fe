import EmptyState from "@/components/empty-state"
import { Card, CardTitle } from "@/components/ui/card"
import { Info, Megaphone } from "lucide-react"
import Link from "next/link"

interface Announcement {
  id: number
  judul: string
  published_at: string
}

interface BkPengumumanProps {
  data?: Announcement[] | null
}

// Data default sebagai fallback
const defaultAnnouncements: Announcement[] = []

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

const BkPengumuman = ({ data }: BkPengumumanProps) => {
  const announcements: Announcement[] = data || defaultAnnouncements

  return (
    <Card className="shadow-none p-4">
      <CardTitle className="text-sm font-medium mb-2 flex items-center gap-2 justify-between">
        <span>Pengumuman</span>
        <Info className="size-4" />
      </CardTitle>
      <div className="divide-y divide-gray-200 max-h-80 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
        {announcements.length > 0 ? (
          announcements.map((announcement: Announcement) => (
            <div key={announcement.id} className="py-2">
              <p className="text-sm font-medium line-clamp-1">
                {announcement.judul}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(announcement.published_at)}
              </p>
              <Link
                href={`/bimbingan-karir/pengumuman/${announcement.id}`}
                className="text-primary text-xs"
              >
                Lihat Detail
              </Link>
            </div>
          ))
        ) : (
          <EmptyState 
            icon={Megaphone}
            title="Tidak ada pengumuman" 
            subtitle="Belum ada pengumuman yang ditambahkan"
            className="h-80" 
          />
        )}
      </div>
    </Card>
  )
}

export default BkPengumuman
