import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText } from "lucide-react";
import EmptyState from "@/components/empty-state";

export interface PengajuanListItem {
  id: number;
  name: string;
  studentId: string;
  gpa?: number | string; // ipk dari akademik_mahasiswa (decimal) datang sebagai string
  avatar?: string | null;
  title: string;
}

interface PengajuanListViewProps {
  items: PengajuanListItem[];
  loading: boolean;
  error: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export function PengajuanListView({
  items,
  loading,
  error,
  emptyTitle = "Belum ada pengajuan",
  emptySubtitle = "Belum ada pengajuan yang tersedia",
}: PengajuanListViewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-4 flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-1 h-4 w-40" />
              <Skeleton className="mb-2 h-3 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="mt-1 h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal memuat data"
        subtitle="Data pengajuan tidak dapat ditampilkan"
        variant="small"
      />
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={FileText}
        title={emptyTitle}
        subtitle={emptySubtitle}
        variant="small"
      />
    );
  }

  return (
    <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-thumb-rounded-full max-h-64 space-y-4 overflow-y-auto">
      {items.map((item) => (
        <div key={item.id} className="mb-4 flex gap-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage className="object-cover" src={item.avatar || ""} />
              <AvatarFallback>
                {item.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="line-clamp-1 text-sm font-medium">{item.name}</h3>
              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>{item.studentId}</span>
                {item.gpa != null && (
                  <>
                    <span className="size-[3px] rounded-full bg-gray-400" />
                    <span>{Number(item.gpa).toFixed(2)}</span>
                  </>
                )}
              </p>
            </div>
            <Separator orientation="vertical" />
            <p className="line-clamp-2 text-sm text-gray-800">{item.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
