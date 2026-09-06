# 💻 Next.js TypeScript Coding Standards

## 🎯 Overview

Dokumen ini berisi panduan coding standards untuk proyek STI Frontend yang dibangun dengan Next.js 15, TypeScript, dan Tailwind CSS.

---

## 📝 File Naming Conventions

### General Rules

| File Type              | Convention                   | Example                   |
| ---------------------- | ---------------------------- | ------------------------- |
| **React Components**   | kebab-case                   | `dashboard-header.tsx`    |
| **Pages (App Router)** | kebab-case                   | page.tsx, client-page.tsx |
| **API Modules**        | kebab-case                   | monitoring-sidang.ts      |
| **Types/Interfaces**   | kebab-case                   | dosen.ts                  |
| **Utilities**          | kebab-case                   | `toast-response.ts`       |
| **Hooks**              | pascal-case and `use` prefix | `use-api.ts`              |
| **Constants**          | kebab-case                   | index.ts                  |
| **Private Folders**    | underscore prefix            | `_components/`            |

---

## 🎨 Code Pattern

### 1. Routing

Pada STI Apps, sistem routing menggunakan Next.js App Router, yang memungkinkan setiap halaman direpresentasikan sebagai sebuah folder dan file `page.tsx`. Penambahan menu baru dilakukan dengan menambahkan rute (route) baru pada struktur folder `app/(root)/(subapps)`

Berikut adalah ketentuan Routing:

#### 1.1 Folder Baru

Ketika kita ingin menambahkan menu baru pada suatu aplikasi, kita dapat menambahkan folder baru di dalam `app/(root)/(subapps)/nama_aplikasi` dan tambahkan file `page.tsx` di dalam folder baru tersebut. Disini contohnya ketika ingin menambahkan suatu fitur pada aplikasi bimbingan-karir

```
app/
 └── (root)/
      └── (subapps)/
           └── bimbingan-karir/
                └── example-feature/
                     └── page.tsx
```

#### 1.2 Routing Conventions

Pada STI Apps, terdapat beberapa konvensi routing yang digunakan untuk menjaga konsistensi struktur folder dan pemisahan antara halaman publik dan komponen privat. Konvensi ini dibangun di atas fitur routing bawaan Next.js dengan beberapa penyesuaian internal.

#### A. Penggunaan () pada folder

Folder ini berfungsi sebagai routing group yang tidak muncul di URL. Konsep ini sama seperti penggunaan tanda kurung () pada folder `(root)` dan `(subapps)`.
Sebagai contoh, ketika kita membuat sebuah [folder baru](#11-folder-baru) di dalam struktur:

> app/(root)/(subapps)/bimbingan-karir/example-feature

maka URL yang dihasilkan tidak akan menampilkan `(root)` maupun `(subapps)`, sehingga path akhir yang diakses pengguna tetap menjadi:

> **Link:** [sti.dinus.id/bimbingan-karir/example-feature](https://sti.dinus.id/bimbingan-karir/example-feature)

Dengan demikian, penggunaan folder bertanda kurung membantu menjaga struktur proyek tetap terorganisasi tanpa memengaruhi URL publik aplikasi.

#### B. Penggunaan \_ pada folder

Folder dengan awalan underscore (\_) digunakan untuk menandai bahwa folder tersebut berisi komponen privat, yaitu komponen yang tidak digunakan sebagai route dan tidak boleh diakses langsung melalui URL.

Selain itu, penggunaan underscore juga berfungsi untuk menandai bahwa komponen atau file di dalam folder tersebut hanya dimiliki dan digunakan pada scope aplikasi atau fitur tersebut saja. Dengan demikian, komponen di dalamnya tidak dimaksudkan untuk digunakan lintas aplikasi atau di luar konteks folder tempatnya berada.

Folder ini biasanya berisi:

- Komponen khusus yang hanya dipakai oleh halaman tertentu

- Helper component

- Layout atau bagian UI yang bersifat internal

- File pendukung yang tidak merepresentasikan halaman

Contoh struktur:

> app/(root)/(subapps)/bimbingan-karir/\_components/FilterTabs.tsx

Pada contoh di atas, folder `_components` tidak membentuk URL baru dan file di dalamnya hanya bertindak sebagai komponen pendukung, sehingga URL tetap menjadi:

> **Link:** [sti.dinus.id/bimbingan-karir](https://sti.dinus.id/bimbingan-karir)

Dengan demikian, penggunaan underscore membantu membedakan antara komponen internal dan halaman yang menjadi bagian dari routing publik.

---

### 2. Page

Berdasarkan struktur file routing yang sudah dibuat, STI Apps menggunakan pola routing dengan pemisahan file berdasarkan role pengguna. Contoh kasus pada sub aplikasi Tugas Akhir memiliki role koordinator, dosen, mahasiswa. Maka contoh file yang dibuat adalah sebagai berikut:

```
├── logbook/                      # Sub-route untuk fitur logbook
│   ├── page.tsx                  # Entry point logbook, merender header dan client-page
│   ├── client-page.tsx           # Conditional rendering untuk logbook berdasarkan role
│   ├── dosen.tsx                 # Komponen logbook untuk dosen
│   ├── koordinator.tsx           # Komponen logbook untuk koordinator
│   ├── mahasiswa.tsx             # Komponen logbook untuk mahasiswa
```

Pattern ini memungkinkan modularitas code, dimana setiap role memiliki komponen khusus untuk me-render konten yang relevan. Berikut adalah penjelasan detailnya:

#### A. File Utama: page.tsx

Ini adalah file entry point default yang akan di-render oleh Next.js untuk route /tugas-akhir. File ini bertugas sebagai wrapper utama untuk halaman, yang merender komponen client-side (DashboardTaClient) dan menambahkan metadata untuk SEO dan konfigurasi halaman.

#### Isi Utama:

- Mengimpor dan merender komponen client-side
- Menambahkan Metadata dari Next.js, seperti title: "Dashboard - Tugas Akhir", yang digunakan untuk mengatur judul halaman di browser, meta tags, dan informasi lainnya yang membantu dalam indexing pengaturan aplikasi.
- File ini memisahkan logika server-side (metadata) dari client-side (rendering dinamis), sesuai dengan arsitektur Next.js App Router. Metadata ini memastikan halaman memiliki informasi deskriptif, seperti judul yang muncul di tab browser atau saat dibagikan.

#### B. File Client-Side: client-page.tsx

Ini adalah komponen client-side yang menangani conditional rendering berdasarkan role pengguna. File ini menggunakan hook useProfile dari context untuk mendapatkan data pengguna yang sedang login, termasuk role-nya.

#### Logika Utama:

- Menggunakan [useProfile()](#6-state-management) untuk mengakses profile (data user), lalu mengambil role dari profile?.roles (tipe Role).
- Conditional rendering: Berdasarkan nilai role, komponen ini merender salah satu dari tiga komponen dashboard spesifik role:
- Jika role === "dosen": Render `<DosenLogbook />`.
- Jika role === "koordinator": Render `<KoordinatorLogbook />`.
- Jika role === "mahasiswa": Render `<MahasiswaLogbook />`.

#### C. File Spesifik Role:

- **dosen.tsx**: Merender daftar logbook mahasiswa yang dibimbing dosen (menggunakan StudentLogbookList).
- **koordinator.tsx**: Merender rekap logbook semua dosen, dengan tabel data seperti total bab, sidang, dll. Menggunakan SWR untuk fetching data.
- **mahasiswa.tsx**: Merender logbook pribadi mahasiswa, dengan form untuk membuat entri baru, daftar entri, dan validasi (e.g., memerlukan folder TA).

#### D. Ketentuan Akses Berdasarkan Role

STI Apps menggunakan Higher-Order Component (HOC) `withAuth` untuk mengontrol akses halaman berdasarkan role pengguna. Halaman tertentu hanya bisa diakses oleh beberapa role tertentu, dan jika role pengguna tidak cocok, sistem akan otomatis redirect ke halaman `/unauthorized`. Ini memastikan keamanan data dan relevansi konten sesuai tanggung jawab masing-masing role.

#### Contoh Usecase: Log Aktivitas

- **Halaman**: `/tugas-akhir/log-aktivitas`
- **Role yang Diperbolehkan**: Koordinator dan Dosen
- **Implementasi**: Menggunakan `withAuth(LogActivityClient, "tugas-akhir", ["koordinator", "dosen"])` pada `log-client-page.tsx`
  disini apabila role yang diperbolehkan hanya satu maka bisa dilakukan penulisan tanpa array juga.
- **Skenario**: Jika mahasiswa mencoba mengakses halaman ini, sistem akan mendeteksi bahwa role "mahasiswa" tidak termasuk dalam array role yang diperbolehkan. Akibatnya, pengguna akan di-redirect ke `/unauthorized` dan tidak bisa melihat konten log aktivitas. Hal ini mencegah akses tidak sah, seperti mahasiswa melihat data monitoring dosen atau rekap aktivitas koordinator, sambil memastikan koordinator dan dosen bisa mengakses informasi yang relevan untuk tugas mereka (e.g., monitoring kegiatan mahasiswa).

---

### 3. Sidebar Pattern

Disaat kita telah menambahkan suatu menu baru pada suatu role, kita dapat menambahkan menu tersebut ke dalam sidebar.

Setiap aplikasi yang berada di dalam struktur:

> app/(root)/(subapps)/nama_aplikasi

memiliki file layout.tsx yang berfungsi sebagai wrapper, termasuk konfigurasi sidebar.

#### 3.1 Cara Menambahkan Menu Baru ke Sidebar

##### A. Buka file layout.tsx pada aplikasi terkait

Contoh path:

> app/(root)/(subapps)/bimbingan-karir/layout.tsx

Di dalam file tersebut terdapat konfigurasi sidebar, misalnya:

```
const BkSidebarData = {
  koordinator: [
    { name: "Dashboard", url: "/bimbingan-karir", icon: Home },
    {
      name: "Periode Ajaran",
      url: "/bimbingan-karir/periode-ajaran",
      icon: Clock,
    },
    {
      ...
    },
    {
      name: "Laporan",
      url: "#",
      icon: ClipboardCheck,
      subItems: [
        { name: "Rekap Nilai", url: "/bimbingan-karir/rekap-nilai" },
        { name: "Riwayat", url: "/bimbingan-karir/riwayat" },
        { name: "Analisis Kegiatan", url: "/bimbingan-karir/analisis-kegiatan" },
        { name: "Feedback Rating", url: "/bimbingan-karir/feedback-rating" },
      ],
    },
  ],
  mahasiswa: [
    { name: "Dashboard", url: "/bimbingan-karir", icon: Home },
    {
      ...
    },
  ],
};
```

##### B. Tambahkan menu baru sesuai dengan rolenya

- Jika menu tanpa submenu, cukup tambahkan satu item biasa:

```
const BkSidebarData = {
  koordinator: [
    {
      name: "Example Feature",
      url: "/bimbingan-karir/example-feature",
      icon: Star,
    }
  ],
};
```

- Jika menambahkan menu dengan submenu, gunakan properti `subItems`

```
const BkSidebarData = {
  koordinator: [
    {
      name: "Manajemen",
      url: "#",
      icon: Folder,
      subItems: [
        { name: "Example Feature", url: "/bimbingan-karir/example-feature" },
        { name: "Example Detail", url: "/bimbingan-karir/example-detail" },
      ],
    }
  ],
};
```

**Note**

- subItems hanya digunakan jika menu memiliki submenu.
- Jika tidak memiliki submenu, jangan gunakan subItems.
- url: "#" digunakan pada menu induk yang berisi submenu.

---

### 4. Component

Bagian ini menjelaskan cara pembuatan dan penempatan component private (scoped) dan global (shared) di proyek STI Apps, serta best practices untuk penamaan, tipe, dan penggunaan Client / Server components di Next.js App Router.

#### 4.1 Kapan buat component private vs global

- Component global:
  - Disimpan di folder `components/ui/` atau `components/` root.
  - Digunakan lintas banyak sub-app / halaman (contoh: Button, Input, Modal, Table base dari shadcn).
  - Harus bersifat generic, configurable via props, dan tanpa dependency khusus app.
- Component private (scoped):

  - Disimpan di folder yang diawali underscore pada scope app, mis. `app/(root)/(subapps)/alumni/_components/`.
  - Hanya digunakan oleh fitur / halaman pada sub-app itu saja (contoh: Lowongan Logo untuk menampilkan Logo Perusahan).
  - Boleh menggunakan dependency internal app / hooks spesifik.

#### 4.2 Struktur & contoh

- Global:
  - components/ui/button.tsx
  - components/ui/index.ts (barrel export)
- Private:
  - app/(root)/(subapps)/alumni/\_components/lowongan-logo.tsx

Contoh struktur:

```
components/
└── ui/
    ├── button.tsx
    └── index.ts
app/(root)/(subapps)/alumni/
└── _components/
    ├── lowongan-logo.tsx
    └── survei/
        └── tabel-penilaian.tsx
```

#### 4.3 Penamaan & export

- Gunakan kebab-case untuk file: `lowongan-logo.tsx`, `unifield-date-picker.tsx`.
- Gunakan nama komponen PascalCase di dalam file: export default function LowonganLogo(...) { ... }
- Prefer default export untuk component UI biasa, named exports untuk util/helper yang bukan React component.
- Jika ada banyak komponen terkait di folder, buat `index.ts` untuk barrel export.

#### 4.4 Client vs Server components (Next.js App Router)

- Default file di App Router adalah Server Component.
- Jika component membutuhkan state, efek, event handler, browser APIs atau hooks (useState, useEffect, useRouter client hooks), tambahkan baris pertama:
  "use client"
  di baris pertama file (pastikan berada di top).
- Prefer memisahkan: buat small client wrapper jika sebagian besar logic bisa tetap server-side.

Contoh client component global (button):

```tsx
// filepath: components/ui/button.tsx
"use client";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-3 py-1 rounded ${
        variant === "primary" ? "bg-blue-600 text-white" : "bg-gray-100"
      } ${className}`}
      {...props}
    />
  );
}
```

Contoh private component (scoped) yang berada di sub-app:

Contoh private component (scoped) yang berada di sub-app:

```tsx
// filepath: app/(root)/(subapps)/alumni/_components/lowongan-logo.tsx
"use client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getLowonganLogoUrl } from "@/lib/logo-utils";
import { LowonganData } from "@/types/alumni/kelola-lowongan";

interface LowonganLogoPropsWithData {
  data: LowonganData;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface LowonganLogoPropsWithSeparate {
  logo?: string | null;
  companyName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

type LowonganLogoProps =
  | LowonganLogoPropsWithData
  | LowonganLogoPropsWithSeparate;

export const LowonganLogo: React.FC<LowonganLogoProps> = (props) => {
  const { size = "md", className = "" } = props;

  let logoUrl: string | null;
  let companyName: string;

  if ("data" in props) {
    logoUrl = getLowonganLogoUrl(props.data.logo || null);
    companyName = props.data.nama_perusahaan || "Company";
  } else {
    logoUrl = getLowonganLogoUrl(props.logo || null);
    companyName = props.companyName || "Company";
  }

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-24 h-24",
  };

  const fallbackSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-2xl",
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage
        src={logoUrl || ""}
        alt={companyName + " Logo"}
        className="object-cover"
      />
      <AvatarFallback className={`${fallbackSizes[size]} font-semibold`}>
        {companyName.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default LowonganLogo;
```

#### 4.5 Props & typing

- Selalu definisikan props dengan TypeScript interface / type.
- Gunakan generic types untuk komponen yang menerima data dinamis (mis. Table).
- Hindari any; pakai unknown jika perlu lalu refine.

#### 4.6 Styling & kelas

- Gunakan Tailwind utility classes dan helper `cn()` untuk conditional class merge.
- Jangan duplicate styling global — letakkan style reusable di komponen global.

#### 4.7 Testing & dokumentasi

- Letakkan unit/test di folder dekat file: `__tests__/button.test.tsx` atau `components/ui/__tests__/`.
- Tambahkan komentar singkat pada komponen kompleks dan contoh penggunaan di README kecil bila perlu.

#### 4.8 Best practices singkat

- Jangan ubah base components dari shadcn/ui; buat wrapper bila butuh custom behavior.
- Komponen global harus stateless bila memungkinkan.
- Break complex components menjadi sub-komponen kecil (SRP).
- Ekspos API minimal — prefer props over context untuk reuse.

#### 4.9 Checklist saat membuat komponen

- [ ] File berada di lokasi yang tepat (global vs private)
- [ ] Nama file kebab-case, component PascalCase
- [ ] Props typed, no any
- [ ] Jika butuh interaksi, tambahkan "use client"
- [ ] Ditest / punya contoh penggunaan / exported di barrel jika perlu

---

### 5. Data Handling

Berdasarkan kebutuhan pengelolaan data, STI Apps memiliki beragam cara untuk menangani data sesuai dengan karakteristik masing-masing data tersebut, antara lain:

### 5.1 Error & Loading & Empty State

#### Apa itu Error, Loading & Empty State?

Dalam pengembangan aplikasi web modern, user experience (UX) sangat bergantung pada bagaimana aplikasi berkomunikasi dengan pengguna saat data sedang diproses. Ada 3 state UI kritis yang harus ditangani dengan baik:

**1. Loading State**
State ketika aplikasi sedang mengambil data dari server. Saat ini, pengguna harus menunggu, sehingga penting untuk memberikan feedback visual (seperti skeleton atau spinner) agar pengguna tahu aplikasi sedang bekerja, bukan stuck atau error.

**2. Error State**
State ketika terjadi kesalahan dalam mengambil atau memproses data (misal: koneksi terputus, server down, atau unauthorized). Pengguna perlu tahu **apa yang salah** dan **bagaimana cara mengatasinya** (biasanya dengan tombol "Coba Lagi").

**3. Empty State**
State ketika data berhasil dimuat, tapi tidak ada data yang tersedia (misal: tabel kosong, tidak ada pengumuman). Berbeda dengan error, ini bukan masalah teknis—pengguna hanya perlu tahu bahwa memang belum ada data, dan diberi petunjuk untuk **action selanjutnya** (misal: "Buat Data Pertama").

**Mengapa penting?**

- ✅ **User Experience**: Pengguna tidak dibiarkan bingung atau merasa aplikasi error
- ✅ **Accessibility**: Screen reader dapat membaca status (dengan aria-live)
- ✅ **Trust**: Aplikasi terasa lebih profesional dan dapat diandalkan
- ✅ **Guidance**: Pengguna tahu apa yang harus dilakukan selanjutnya

---

#### Pattern Dasar

Pisahkan 3 state UI dengan komponen reusable:

1. **Loading** → `TableSkeleton` / `Spinner` (preserve layout, hindari layout shift)
2. **Error** → `ErrorState` (pesan ramah + tombol Retry)
3. **Empty** → `EmptyState` (ilustrasi + CTA)

#### UX Rules

- ✅ Skeleton saat fetch pertama kali
- ✅ Jika refresh gagal tapi data lama ada → tampilkan data + toast error
- ✅ Error 500 → pesan generik + retry
- ✅ Error 401/403 → redirect ke `/unauthorized`
- ✅ Gunakan `aria-live="polite"` untuk aksesibilitas

#### Implementation

**1. Error Helper (opsional)**

```ts
// lib/error-utils.ts
export function getErrorMessage(status?: number) {
  switch (status) {
    case 400:
      return "Permintaan salah";
    case 404:
      return "Data tidak ditemukan";
    case 500:
      return "Terjadi masalah, coba lagi";
    default:
      return "Terjadi kesalahan";
  }
}
```

**2. Komponen ErrorState**

```tsx
// components/ui/error-state.tsx
"use client";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  message = "Terjadi kesalahan",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`p-6 rounded bg-red-50 text-red-700 ${className}`}
    >
      <p className="font-medium">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
```

**3. LoadingSkeleton**

```tsx
// components/ui/loading-skeleton.tsx
"use client";

export default function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded" />
      ))}
    </div>
  );
}
```

#### Contoh Penggunaan (Real Case)

```tsx
// Di komponen table/page yang fetch data
import useSWR, { mutate } from "swr";
import ErrorState from "@/components/ui/error-state";
import TableSkeleton from "@/components/ui/loading-skeleton";
import EmptyState from "@/components/empty-state";
import { getErrorMessage } from "@/lib/error-utils";

export function MyDataTable() {
  const { data: resp, error, isLoading } = useSWR(key, fetcher);
  const data = resp?.data || [];

  // 1. Loading state
  if (isLoading) return <TableSkeleton />;

  // 2. Error tanpa data
  if (error && data.length === 0) {
    return (
      <ErrorState
        message={getErrorMessage(error?.status)}
        onRetry={() => mutate(key)}
      />
    );
  }

  // 3. Error tapi ada data lama (non-blocking toast sudah ditangani di fetcher)

  // 4. Empty state
  if (data.length === 0) {
    return <EmptyState title="Belum ada data" />;
  }

  // 5. Success - render data
  return <DataTable columns={columns} data={data} />;
}
```

#### Best Practices

- **Loading**: Gunakan skeleton yang mirip layout asli
- **Error**: Selalu sediakan tombol Retry
- **Empty**: Berikan CTA yang jelas
- **Accessibility**: Gunakan `aria-live` dan `role="alert"`
- **Non-blocking**: Jika data lama ada, tampilkan + toast error (jangan blocking ErrorState)

---

#### 5.2 Data table.

STI Apps menggunakan `@tanstack/react-table` untuk manajemen tabel data dengan komponen reusable `DataTable` yang sudah terintegrasi dengan pagination dan loading state.

**⚠️ PENTING: Komponen Base Table dari shadcn**

Komponen di `components/ui/table.tsx` adalah komponen dasar dari shadcn/ui dan **JANGAN DIUBAH**. Komponen ini digunakan sebagai building blocks untuk membuat tabel. Jika Anda perlu membuat tabel dengan fungsi khusus, buat komponen baru yang menggunakan komponen dari `components/ui/table.tsx` sebagai base.

##### A. Komponen DataTable Standar

Komponen `DataTable` di `components/data-table.tsx` adalah komponen reusable yang terintegrasi dengan:

- Pagination (otomatis muncul jika props `pagination` disediakan)
- Loading state (skeleton saat loading)
- Empty state (jika data kosong)
- Styling konsisten (zebra striping, hover effects)

**Cara Penggunaan:**

```tsx
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import useSWR from "swr";

// 1. Definisikan columns
const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <Button onClick={() => handleEdit(row.original)}>Edit</Button>
    ),
  },
];

// 2. Fetch data dari API
export default function MyTablePage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const { data: response, isLoading } = useSWR(
    `/api/data?page=${page}&limit=${limit}`,
    fetcher
  );

  // 3. Render DataTable
  return (
    <DataTable
      columns={columns}
      data={response?.data || []}
      loading={isLoading}
      pagination={{
        currentPage: page,
        lastPage: response?.meta?.last_page || 1,
        limit: limit,
        total: response?.meta?.total || 0,
      }}
    />
  );
}
```

##### B. Best Practices:

- ✅ Definisikan `columns` dengan `ColumnDef` untuk type safety
- ✅ Gunakan `useSWR` untuk fetching data dengan caching otomatis
- ✅ Pass pagination props untuk pagination otomatis
- ✅ Gunakan `loading` prop untuk skeleton loading state
- ✅ Buat custom table component jika perlu fungsi khusus (edit, delete, dll)
- ✅ Jangan ubah `components/ui/table.tsx` (dari shadcn)

**Referensi Implementasi:**

- `components/data-table.tsx` - Komponen DataTable standar
- `app/(root)/(subapps)/tugas-akhir/data-dosen/table.tsx` - Contoh dengan CRUD operations
- `app/(root)/(subapps)/bimbingan-karir/_components/rekap-kegiatan/mahasiswa/table.tsx` - Contoh custom table
- `app/(root)/(subapps)/alumni/_components/kelola/base-table.tsx` - Contoh custom table component

---

#### 5.3 PaginationControls

Komponen `PaginationControls` adalah komponen reusable untuk menangani navigasi halaman dan kontrol limit data di STI Apps. Komponen ini mendukung fitur seperti navigasi halaman, pemilihan jumlah item per halaman, dan integrasi dengan URL search params untuk state management.

**Props Utama:**

- `currentPage`: Halaman saat ini (number)
- `lastPage`: Total halaman terakhir (number)
- `total`: Total jumlah data (number)
- `limitOptions`: Array opsi limit (default: [5, 10, 20, 50])
- `defaultLimit`: Limit default (default: 10)
- `onPageChange`: Callback untuk perubahan halaman (opsional)
- `onLimitChange`: Callback untuk perubahan limit (opsional)

**Built-in di DataTable:**
Jika menggunakan komponen `DataTable`, pagination sudah terintegrasi secara otomatis. Tinggal parsing data pagination dari API ke props `pagination` pada `DataTable`. Contoh:

```tsx
<DataTable
  columns={columns}
  data={data}
  pagination={{
    currentPage: currentPage,
    lastPage: lastPage,
    limit: limit,
    total: total,
  }}
  loading={isLoading}
/>
```

Dengan cara ini, `PaginationControls` akan otomatis muncul di bawah tabel jika props `pagination` disediakan, tanpa perlu render manual.

**Penggunaan Terpisah (Tanpa DataTable):**
`PaginationControls` dapat digunakan secara independen untuk halaman yang bukan berbentuk tabel, seperti halaman pengumuman atau list card. Contoh penggunaan di `pengumuman-client.tsx`:

```tsx
<PaginationControls
  currentPage={page}
  lastPage={totalPages}
  total={totalData}
/>
```

Di sini, pagination digunakan untuk navigasi list pengumuman yang berbentuk card, bukan tabel. Data pagination diambil langsung dari response API (e.g., `data?.meta?.pagination`) dan diteruskan ke komponen. Ini memungkinkan fleksibilitas untuk berbagai jenis layout data.

---

#### 5.4 Search Control

STI Apps menyediakan komponen SearchControl, yaitu komponen input pencarian (search bar) yang digunakan untuk melakukan filtering data dengan parameter `(?search=)` pada URL. Komponen ini terintegrasi dengan `useSearchParams` dan `router.push`, sehingga setiap perubahan input akan otomatis memperbarui parameter URL dan memicu pengambilan data ulang sesuai kebutuhan.

Komponen ini digunakan di hampir seluruh halaman yang membutuhkan pencarian dinamis pada tabel maupun daftar data.

**Props Utama:**

- `placeholder`: Digunakan sebagai teks placeholder pada input pencarian. Default-nya adalah `"Cari..."`.
- `className`: Untuk kebutuhan styling pada komponen.

**Penggunaan:**

```tsx
import SearchControl from "@/components/search-control";

<SearchControl placeholder="Cari Example..." className="w-full" />;
```

**Kapan Digunakan:** Digunakan ketika terdapat data dalam jumlah banyak atau data yang bersifat dinamis sehingga pengguna membutuhkan kemampuan untuk melakukan pencarian cepat berdasarkan keyword tertentu.

---

#### 5.5 CustomTabs dan CustomSolidTabs

STI Apps menyediakan dua komponen tab reusable untuk navigasi antar konten: `CustomTabs` dan `CustomSolidTabs`. Kedua komponen ini digunakan untuk mengelompokkan dan menampilkan data berdasarkan kategori atau filter, seperti di halaman analisis kegiatan atau log aktivitas.

##### CustomTabs

Komponen tab sederhana dengan desain underline. Biasanya digunakan untuk navigasi yang lebih ringan dan responsif, dengan dukungan overflow horizontal.

**Props Utama:**

- `tabs`: Array objek tab dengan `status`, `label`, `icon` (opsional), `count` (opsional untuk badge)
- `activeTab`: Tab aktif saat ini
- `onTabChange`: Callback saat tab berubah

**Penggunaan:**

```tsx
const tabs = [
  { status: "workshop", label: "Workshop", icon: Code },
  { status: "toefl", label: "TOEFL", icon: BookOpen },
];

<CustomTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />;
```

**Kapan Digunakan:** Untuk tab dengan styling minimal, seperti di halaman analisis kegiatan (comparasion-page.tsx) untuk memilih kategori workshop, TOEFL, atau LSP.

##### CustomSolidTabs

Komponen tab dengan desain solid menggunakan shadcn/ui Tabs. Memberikan tampilan yang lebih prominent dengan background dan border yang berbeda saat aktif.

**Props Utama:**

- `tabs`: Array objek tab dengan `status`, `label`, `icon` (opsional)
- `activeTab`: Tab aktif (opsional, default ke tab pertama)
- `onTabChange`: Callback saat tab berubah

**Penggunaan:**

```tsx
const tabs = [
  { status: "all", label: "Semua", icon: Users },
  { status: "dosen", label: "Dosen", icon: User },
];

<CustomSolidTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>;
```

**Kapan Digunakan:** Untuk tab yang perlu tampilan lebih menonjol, seperti di halaman log aktivitas koordinator Tugas Akhir untuk filter "Semua", "Dosen", atau "Mahasiswa".

**Intinya Penggunaan**

- **Navigasi Konten:** Kedua komponen digunakan untuk switching konten dinamis berdasarkan kategori tanpa reload halaman.
- **Responsivitas:** Mendukung overflow horizontal untuk tab banyak di mobile.
- **Integrasi Data:** Biasanya dikombinasikan dengan SWR untuk fetch data berdasarkan tab aktif, memungkinkan filtering real-time.
- **Fleksibilitas:** Pilih `CustomTabs` untuk desain ringan, `CustomSolidTabs` untuk yang lebih solid. Sesuaikan penggunaan sesuai dengan kebutuhan.

---

#### 5.6 Filter Bar

Filter bar adalah komponen untuk mengelola filter, sorting, dan search pada halaman data. Menggunakan **URL Search Params** untuk state management sehingga filter dapat di-bookmark dan dibagikan.

**Komponen yang Digunakan:**

- `SearchControl` dari `@/components/search-control` - Search dengan debounce otomatis
- `Select` dari `@/components/ui/select` - Dropdown filter
- Icons dari `lucide-react` - Visual indicator (opsional)

**Cara Penggunaan:**

Filter bar mengintegrasikan URL Search Params untuk state persistence. Implementasinya secara garis besar:

1. **Extract params dari URL** menggunakan `useSearchParams()`
2. **Buat fungsi update** yang mengubah URL dengan params baru
3. **Pass ke FilterBar** untuk handle search, sort, dan filter
4. **Reset page ke 1** saat filter berubah

Struktur komponen FilterBar biasanya menggabungkan `SearchControl` dan beberapa `Select` dengan layout responsive (flex column pada mobile, flex row pada desktop).

**Best Practices:**

- ✅ Gunakan `URL Search Params` untuk state management (bookmarkable & shareable)
- ✅ Reset halaman ke 1 saat filter, search, atau sort berubah
- ✅ Gunakan `SearchControl` untuk search dengan debounce otomatis
- ✅ Tampilkan label jelas di Select (misal: "Status: Semua" atau "Jalur: Publikasi")
- ✅ Responsive layout: `flex-col md:flex-row`
- ✅ Sediakan opsi "all" atau "reset" untuk pembatalan filter
- ✅ Sinkronkan filter state dengan data fetch params di API call

**Referensi Implementasi:**

- `app/(root)/(subapps)/tugas-akhir/_components/pengajuan-mahasiswa/filter-bar.tsx` - Filter bar dengan multiple filters
- `app/(root)/(subapps)/kerja-praktek/_components/mahasiswa-bimbingan/filter-bar.tsx` - Filter bar dengan sort dan search
- `components/search-control.tsx` - Komponen search dengan debounce
- `components/ui/select.tsx` - Dropdown filter dari shadcn/ui

---

#### 5.7 Form

STI Apps menyediakan serangkaian komponen Form yang menjadi fondasi utama dalam pembuatan form dinamis di seluruh aplikasi, mulai dari input sederhana, textarea, rating input, hingga form kompleks dengan banyak field.

**Props Utama:**
Karena Form dibangun di atas FormProvider dari React Hook Form, props yang digunakan mengikuti konfigurasi React Hook Form seperti:

- defaultValues — Nilai awal form.
- resolver — Digunakan untuk integrasi validasi seperti Zod.

Pada komponen turunannya:

- FormField
  - name: Nama field sesuai schema.
  - control: Control dari useForm().
- FormLabel: Tidak memiliki props khusus, hanya styling tambahan.
- FormControl: Wrapper untuk input komponen.
- FormMessage: Menampilkan pesan error.
- FormDescription: Memberikan deskripsi tambahan untuk field.

**Penggunaan:**

Penggunaan dibagi menjadi dua bagian:

##### A. Pembuatan Form

```tsx
"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ExampleForm() {
  const form = useForm<ExampleFormData>({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      nama: "",
      usia: 0,
    },
  });

  function onSubmit(values) {
    console.log("Data dikirim:", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama Anda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="usia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usia</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Masukkan usia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Kirim</Button>
      </form>
    </Form>
  );
}
```

##### B. Pembuatan Zod

```tsx
import { z } from "zod";

export const exampleSchema = z.object({
  nama: z
    .string()
    .min(3, "Nama harus memiliki minimal 3 karakter")
    .max(50, "Nama tidak boleh lebih dari 50 karakter"),

  usia: z
    .number()
    .min(1, "Usia harus minimal 1 tahun")
    .max(120, "Usia tidak boleh lebih dari 120 tahun"),
});

export type ExampleFormData = z.infer<typeof exampleSchema>;
```

**Kapan Digunakan:** Ketika ingin membuat sebuah form yang rapi dan terstruktur, serta terintegrasi dengan zod sebagai validator yang memastikan setiap field tervalidasi dengan baik sebelum data dikirim atau diproses

---

#### 5.8 Utils - Helper Functions

STI Apps memiliki berbagai utility functions yang tersimpan di folder `lib/` untuk membantu common tasks seperti formatting, validation, dan data manipulation. Utility functions ini dapat digunakan secara global di seluruh aplikasi.

**Struktur Folder Utils:**

```
lib/
├── utils.ts                    # Utility functions global (cn, getInitials, format tanggal)
├── toast-response.ts           # Helper untuk toast notifications
├── logo-utils.ts               # Helper untuk logo
├── alumni/
│   ├── validation/cv-validation.ts
│   ├── cv-formatter.ts
│   └── use-profil-alumni.ts
├── bimbingan-karir/data-utils.tsx
├── tugas-akhir/data-utils.tsx
├── landing-page/pengumuman/announcement-utils.ts
└── constant/index.ts           # Konstanta aplikasi
```

**Global Utils - `lib/utils.ts`:**

Utils global yang paling sering digunakan:

**1. cn() - Merge Tailwind Classes**

Untuk merge Tailwind CSS classes dengan aman menggunakan `clsx` dan `tailwind-merge`. Gunakan ini saat perlu combine multiple conditional classes:

```tsx
import { cn } from "@/lib/utils";

const buttonClass = cn(
  "px-4 py-2 rounded",
  isActive && "bg-blue-500",
  isDisabled && "opacity-50 cursor-not-allowed"
);
```

**2. getInitials() - Get User Initials**

Mengambil 2 huruf pertama dari nama untuk avatar:

```tsx
import { getInitials } from "@/lib/utils";

const initials = getInitials("Bambang Irawan"); // "BI"
```

**3. Format Date Functions**
STI Apps menyediakan beberapa fungsi untuk formatting tanggal sesuai kebutuhan:

- **`formatDate(date)`** - Format dasar: "14 Juni 2025"
- **`formatDateTime(date)`** - Dengan waktu: "14 Juni 2025, 22.53"
- **`formatDateFull(date)`** - Lengkap dengan hari: "Sabtu, 14 Juni 2025 pukul 22.53"

Semua fungsi menerima `Date` object atau string dan secara otomatis menggunakan locale `id-ID` untuk bahasa Indonesia.

```tsx
import { formatDate, formatDateTime, formatDateFull } from "@/lib/utils";

const date = new Date();

formatDate(date); // "14 Juni 2025"
formatDateTime(date); // "14 Juni 2025, 22.53"
formatDateFull(date); // "Sabtu, 14 Juni 2025 pukul 22.53"
```

**Best Practices:**

- ✅ Gunakan `cn()` untuk merge Tailwind classes dinamis
- ✅ Gunakan `getInitials()` untuk avatar user
- ✅ Pilih format tanggal sesuai konteks UI (simple, with time, atau full)
- ✅ Semua format tanggal otomatis menggunakan bahasa Indonesia (locale id-ID)
- ✅ Untuk kebutuhan khusus aplikasi, buat utils baru di subfolder sesuai aplikasi (e.g., `lib/alumni/`, `lib/tugas-akhir/`)

**Struktur Utils Spesifik Aplikasi:**

Untuk utils yang spesifik ke aplikasi tertentu, letakkan di subfolder:

- `lib/alumni/` - Utils untuk app alumni
- `lib/tugas-akhir/` - Utils untuk app tugas-akhir
- `lib/bimbingan-karir/` - Utils untuk app bimbingan-karir
- `lib/constant/` - Konstanta global aplikasi

Jangan letakkan utils spesifik aplikasi di `lib/utils.ts`, tetapi buat file baru di subfolder yang sesuai untuk menjaga organisasi code yang baik.

**Referensi:**

- `lib/utils.ts` - Global utility functions
- `lib/alumni/` - Utils khusus alumni (cv-formatter, cv-progress-utils, validation)
- `lib/tugas-akhir/data-utils.tsx` - Utils khusus tugas-akhir
- `lib/bimbingan-karir/data-utils.tsx` - Utils khusus bimbingan-karir

---

#### 5.9 Fetching (SSR vs CSR)

#### Apa ini

- Standar pemilihan strategi fetching data di STI Apps: SSR (Server-Side Rendering), ISR (Incremental Static Regeneration), atau CSR (Client-Side Rendering dengan SWR).

#### Kapan dipakai

- Pakai SSR/ISR untuk: halaman publik/landing, SEO, FCP cepat, data tidak sangat personal, bisa di-cache.
- Pakai CSR (SWR) untuk: dashboard interaktif, data sangat personal/realtime, sering berubah, butuh revalidasi cepat.
- Hybrid: SSR untuk initial HTML + CSR untuk refresh data atau interaksi intensif.

#### Referensi

- [Server-Side Rendering Guide](./ssr-fetching.md)
- [Client-Side Rendering Guide](./fetching.md)

Decision guide

- Perlu SEO/FCP cepat? → SSR/ISR
- Data sangat dinamis/realtime atau user-specific? → CSR (SWR)
- Butuh initial fast + interaktif sesudahnya? → Hybrid (SSR initial + SWR revalidate)

Contoh singkat SSR

```tsx
// Server Component
export const revalidate = 86400; // ISR 1 hari

async function getHeroSliders() {
  const res = await HeroSliderSuperAdminService.getHeroSliderList(1, 50);
  const list = res.data?.data || [];
  return list.filter((s: { isActive?: number }) => s.isActive === 1);
}

export default async function Page() {
  const images = await getHeroSliders();
  return <HeroSlider images={images} />;
}
```

Contoh singkat CSR (SWR)

```tsx
"use client";
import useSWR from "swr";

const fetcher = () => Service.getList().then((r) => r.data);

export default function ListClient() {
  const { data, error, isLoading, mutate } = useSWR("/list", fetcher);

  if (isLoading) return <TableSkeleton />;
  if (error && !data) return <ErrorState onRetry={() => mutate()} />;

  return <DataTable data={data ?? []} />;
}
```

Checklist

- Tentukan dulu: SEO/FCP vs realtime/interaktivitas.
- Konsisten gunakan service layer + error shape terstandar.
- Gunakan ISR bila konten publik berubah tapi tidak per menit.
- Pada CSR, tampilkan stale data + toast saatrefresh gagal.

---

### 6. State management

#### 6.1 Global State

STI Apps menggunakan berbagai pendekatan state management yang ringan dan terintegrasi dengan Next.js. Berikut adalah state management yang digunakan:

- **Context API**: Mengelola state global profil pengguna (`useProfile`) dari `context/profileUseContext.tsx`, seperti data user yang sedang login yang dibagikan di seluruh aplikasi. Context untuk user pada sub-app alumni dikecualikan …
- **SWR (Stale-While-Revalidate)**: Library untuk fetching data API dengan caching otomatis, revalidasi, deduplikasi request, dan error handling. Digunakan untuk data dinamis seperti pengumuman, log aktivitas, dan tabel data.
- **URL Search Params**: Mengelola state navigasi dan filter yang persist di URL, seperti pagination (page, limit), tab aktif, dan search query. Memungkinkan bookmarking dan sharing URL.
- **Cookies**: Penyimpanan token autentikasi menggunakan `cookies-next` untuk session management.
- **React Hook Form**: Mengelola form state menggunakan `useForm()` dan `useController()` untuk form handling dengan validasi Zod.

Pendekatan ini memastikan state tetap sinkron, performa optimal dengan caching, dan navigasi yang dapat di-bookmark tanpa kompleksitas berlebih.

#### 6.2 Global State Alumni Specific - Context useProfile():

Sub-app alumni menggunakan `profileUseContext` hanya untuk **conditional rendering** di top-level layout:

- **Role-Based Sidebar**: Menentukan menu item berdasarkan role (alumnus, mahasiswa, koordinator, mitra)
- **Conditional Menu Items**: Tampil/sembunyikan menu berdasarkan `hasHasilSurvei` state (hanya untuk alumnus)

**Implementasi di Layout:**

```tsx
const { profile, hasHasilSurvei } = useProfile();
const role = profile?.roles;

// Generate sidebar berdasarkan role
const data = useMemo(() => {
  const alumnus = [
    { name: "Dashboard", url: "/alumni", icon: Home },
    // Conditional: hanya tampil jika hasHasilSurvei true
    ...(hasHasilSurvei
      ? [{ name: "Hasil Survei", url: "/alumni/hasil-survei", icon: Icon }]
      : []),
  ];
}, [role, hasHasilSurvei]);
```

**Alumni Custom Hooks:**

Untuk data fetching dan state management component-level, gunakan custom hooks:

- **`useCV()`** - Handle CV preview dan export operations
- **`useBookmark()`** - Handle bookmark lowongan
- **`useCVForm()`** - Handle form state CV
- **`useResizeObserver()`** - Monitor element size changes

**Note:** Jangan gunakan Context untuk data user di alumni. Gunakan SWR untuk API data fetching dan useState untuk dialog/form state lokal.

---

### 7. Constant ENV

Bagian ini berfungsi sebagai wrapper untuk seluruh variabel environment `.env.local` sehingga penggunaan environment variabel menjadi lebih ringkas, konsisten, dan mudah dipanggil di seluruh project.
Dengan pendekatan ini, kita tidak perlu lagi menulis process.env.xxx berulang-ulang, cukup impor constant yang sudah kita buat.

Berikut contoh ketika ingin menambahkan suatu environment:

#### 1. Membuat sebuah variabel pada file .env.local

```env
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_APP_DESCRIPTION=
NEXT_PUBLIC_SERVER_URL=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_COOKIE_NAME=
NEXT_PUBLIC_API_CHATBOT_URL=
NEXT_PUBLIC_API_PUBLIKASI_URL=

# Contoh env baru
NEXT_PUBLIC_API_EXAMPLE=
```

#### 2. Tambahkan ke file `index.ts` pada folder `lib/constant/index.ts`

Tambahkan variabel baru dengan memetakan nilai dari process.env

```ts
export const API_EXAMPLE = process.env.NEXT_PUBLIC_API_EXAMPLE;
```

Jika diperlukan default callback, gunakan :

```ts
export const API_EXAMPLE =
  process.env.NEXT_PUBLIC_API_EXAMPLE || "https://example.com";
```

#### 3. Setelah ditambahkan ke `lib/constant/index.ts`, variabel dapat dipakai di mana saja hanya dengan mengimpor constant tersebut.

contoh :

```ts
import { API_URL } from "@/lib/constant";

export const AuthService = Authentication({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});
```

---

## 📁 Project Structure

### Directory Organization

```
├── api/#### # digunakan untuk membuat service api
├── app/
│   ├── (root)/
│   │   ├── (auth)/                 # sebagi halaman login
│   │   ├── (landing)/              # sebagai halaman landing page
│   │   ├── (subapps)/              # sebagai halaman tiap apps
│   │   │   ├── alumni/
│   │   │   ├── bimbingan-karir/
│   │   │   ├── kerja-praktek
│   │   │   └── tugas-akhir/
│   │   ├── apps/                   # sebagai halaman untuk memilih subapps setelah login
│   │   ├── components/             # komponen dari halaman landing page
│   │   └── hoc/
├── components/
│   └── ui/                         # komponen dasar yang digunakan secara global (button, dialog, dsb)
├── context/
├── data/
├── docs/                           # dokumentasi dari website STI Apps
│   ├── development_guide/
│   └── software_vision/
├── hooks/
│   ├── landing-page/
│   └── pengumuman/
├── lib/                            # sebagai tempat menyimpan utilities/helper
│   ├── alumni/validation/
│   ├── bimbingan-karir/
│   ├── constant/
│   ├── landing-page/pengumuman/
│   └── tugas-akhir/
├── public/                         # sebagai tempat menyimpan aset statis (biasanya gambar atau logo bengkod)
│   ├── assets/
│   └── docs-siadin/
├── src/
└── types/                          # sebagai tempat deklarasi tipe data (type, interface, dsb)
    ├── admin/
    ├── alumni/
    ├── bimbingan-karir/
    ├── kerja-praktek/
    ├── landing-page/
    └── tugas-akhir/
```

---

## 📚 Additional Resources

### Key Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: SWR
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Fetch API
- **Icons**: Lucide React

### Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [SWR Documentation](https://swr.vercel.app/)
- [React Hook Form](https://react-hook-form.com/)

https://docs.google.com/spreadsheets/d/19PXIPIjZc-8w0lFnc9emEriIbhiut8Lfr57eMWYl3Fc/edit?gid=692693573#gid=692693573
nanti kita tambahin itu package, intinya kita jelasin ini dipakai dimana aja dan buat apa.
Nanti kita ngelanjutin aja di link.

---
