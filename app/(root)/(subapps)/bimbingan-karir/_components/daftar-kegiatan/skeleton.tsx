import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonKegiatan() {
  return (
    <div className="space-y-6 mt-6">
      {/* Bagian Card Kegiatan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="border rounded-lg overflow-hidden shadow-sm">
            {/* Poster Image */}
            <Skeleton className="h-48 w-full" />
            
            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Judul Kegiatan */}
              <Skeleton className="h-6 w-3/4" />
              
              {/* Deskripsi */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              
              {/* Tanggal */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-48" />
              </div>
              
              {/* Waktu */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
              
              {/* Lokasi */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              
              {/* Kategori */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              
              {/* Link Grup WA */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 justify-end">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonKegiatanMahasiswa() {
  return (
    <div className="space-y-6 mt-6">
      {/* Bagian Card Kegiatan */}
      <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="border rounded-lg overflow-hidden shadow-sm flex flex-col">
            {/* Poster Image */}
            <Skeleton className="h-48 w-full rounded-b-none" />
            
            {/* Header */}
            <div className="p-4 space-y-2">
              {/* Judul & Badge */}
              <div className="flex justify-between items-start gap-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-24 rounded-full flex-shrink-0" />
              </div>
              
              {/* Deskripsi */}
              <Skeleton className="h-4 w-full" />
            </div>

            {/* Content */}
            <div className="px-4 pb-4 flex-1 space-y-2">
              {/* Tanggal */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-48" />
              </div>
              
              {/* Waktu */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
              
              {/* Lokasi */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              
              {/* Kategori */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
              
              {/* Link Grup WA (optional, bisa ditampilkan atau tidak) */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>

              {/* PDF Files */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Skeleton className="h-8 w-32 rounded-md" />
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            </div>

            {/* Footer - Action Buttons */}
            <div className="p-4 pt-0 bg-muted/50 mt-auto">
              {/* Mobile Layout */}
              <div className="flex lg:hidden flex-col w-full gap-2">
                {/* Detail Button */}
                <Skeleton className="h-9 w-full rounded-md" />
                
                {/* Icon Buttons Row */}
                <div className="flex gap-2 w-full">
                  <Skeleton className="h-9 flex-1 rounded-md" />
                  <Skeleton className="h-9 flex-1 rounded-md" />
                  <Skeleton className="h-9 flex-1 rounded-md" />
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex flex-row justify-between items-center w-full gap-2">
                <Skeleton className="h-9 w-20 rounded-md" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24 rounded-md" />
                  <Skeleton className="h-9 w-28 rounded-md" />
                  <Skeleton className="h-9 w-20 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonPresensi() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Kegiatan */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" /> {/* Judul Kegiatan */}
        <div className="flex items-center gap-4 flex-wrap">
          <Skeleton className="h-4 w-48" /> {/* Tanggal range */}
          <Skeleton className="h-4 w-32" /> {/* Lokasi */}
        </div>
      </div>

      {/* QR Code & Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* QR Code Card */}
        <div className="border rounded-lg p-6 flex flex-col items-center gap-4">
          <Skeleton className="h-6 w-32" /> {/* Title */}
          <Skeleton className="h-48 w-48 rounded-lg" /> {/* QR Code */}
          <Skeleton className="h-4 w-40" /> {/* Status text */}
        </div>

        {/* Summary Card */}
        <div className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-40" /> {/* Title */}
          <Skeleton className="h-4 w-48" /> {/* Subtitle/info */}
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-24" /> {/* Label */}
              <Skeleton className="h-5 w-16" /> {/* Count */}
            </div>
            <Skeleton className="h-3 w-full rounded-full" /> {/* Progress bar */}
          </div>

          <Skeleton className="h-12 w-full rounded-md" /> {/* Button */}
        </div>
      </div>

      {/* Grid: Table + Izin Card */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table - 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Action Buttons */}
          <div className="flex justify-between items-center gap-3">
            <Skeleton className="h-10 w-64" /> {/* Search input */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-40" /> {/* Terbitkan Sertifikat */}
              <Skeleton className="h-10 w-24" /> {/* Refresh */}
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 p-4 bg-muted">
              <Skeleton className="h-4 w-8" /> {/* No */}
              <Skeleton className="h-4 w-16" /> {/* NIM */}
              <Skeleton className="h-4 w-20" /> {/* Nama */}
              <Skeleton className="h-4 w-16" /> {/* Status */}
              <Skeleton className="h-4 w-12" /> {/* Aksi */}
            </div>

            {/* Table Rows */}
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-5 gap-4 p-4 border-t">
                <Skeleton className="h-4 w-6" /> {/* No */}
                <Skeleton className="h-4 w-28" /> {/* NIM */}
                <Skeleton className="h-4 w-48" /> {/* Nama */}
                <Skeleton className="h-6 w-24 rounded-full" /> {/* Badge Status */}
                <Skeleton className="h-8 w-8 rounded-md" /> {/* Action button */}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-48" /> {/* Page info */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-md" /> {/* Prev */}
              <Skeleton className="h-10 w-10 rounded-md" /> {/* Page 1 */}
              <Skeleton className="h-10 w-10 rounded-md" /> {/* Page 2 */}
              <Skeleton className="h-10 w-10 rounded-md" /> {/* Page 3 */}
              <Skeleton className="h-10 w-10 rounded-md" /> {/* Next */}
            </div>
            <Skeleton className="h-10 w-32" /> {/* Items per page */}
          </div>
        </div>

        {/* Izin Presensi Card - 1 column */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg">
            {/* Card Header */}
            <div className="p-6 space-y-2 border-b">
              <Skeleton className="h-6 w-32" /> {/* Title */}
              <Skeleton className="h-4 w-48" /> {/* Subtitle */}
            </div>

            {/* Card Content - Izin Items */}
            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-5 w-40" /> {/* Nama */}
                    <Skeleton className="h-6 w-20 rounded-full" /> {/* Badge */}
                  </div>

                  {/* Alasan */}
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" /> {/* Label */}
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>

                  {/* PDF Button */}
                  <Skeleton className="h-9 w-full rounded-md" />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1 rounded-md" /> {/* Setuju */}
                    <Skeleton className="h-9 flex-1 rounded-md" /> {/* Tolak */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonTableOnly() {
  return (
    <>
      <div className="border rounded-md">
        <div className="grid grid-cols-5 gap-4 p-4 bg-muted font-semibold">
          {["No", "NIM", "Nama", "Status", "Aksi"].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Isi tabel */}
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-4 p-4 border-t">
            <Skeleton className="h-4 w-full" /> {/* No */}
            <Skeleton className="h-4 w-full" /> {/* NIM */}
            <Skeleton className="h-4 w-full" /> {/* Nama */}
            <Skeleton className="h-6 w-24 rounded-full" /> {/* Status */}
            <Skeleton className="h-8 w-8 rounded-md" /> {/* Aksi */}
          </div>
        ))}
      </div>
    </>
  )
}

export function SkeletonDetailKegiatanMahasiswa() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-3/4 sm:w-2/3" />
        
        {/* Info Meta */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3.5 w-3.5 rounded" />
            <Skeleton className="h-3.5 w-32" />
          </div>
          <Skeleton className="hidden sm:block h-3 w-px" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-3.5 w-3.5 rounded" />
            <Skeleton className="h-3.5 w-32" />
          </div>
          <Skeleton className="hidden sm:block h-3 w-px" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-3.5 w-3.5 rounded" />
            <Skeleton className="h-3.5 w-32" />
          </div>
          <Skeleton className="hidden sm:block h-3 w-px" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-3.5 w-3.5 rounded" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Link Grup WhatsApp */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center gap-1 border rounded-lg overflow-hidden w-full sm:max-w-md">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-9 rounded-none" />
          <Skeleton className="h-9 w-9 rounded-none" />
        </div>
      </div>

      {/* File PDF */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
          <Skeleton className="h-10 w-full sm:w-64 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-56 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-72 rounded-md" />
        </div>
      </div>

      {/* Poster */}
      <div className="space-y-3">
        <Skeleton className="h-[500px] w-full sm:w-[400px] rounded-lg" />
      </div>
    </div>
  );
}