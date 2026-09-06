# 📦 Data Fetching Flow (SWR, Service Pattern, and Manual Mutation Request)

Dokumen ini menjelaskan standar alur fetching data pada STI APPs menggunakan **Service Pattern**, **Configurable Headers**, dan **SWR** serta mengetahui bagaimana cara mengirimkan data ketika method yang digunakan **POST**, **DELETE**, dll untuk data management yang konsisten dan scalable.

---

## 1️⃣ Create Service Module (`/api/...`)

```ts
// Example service module
const DaftarKegiatanMahasiswa = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const daftarkegiatanmhs = "/bk/mahasiswa-kegiatan";

  return {
    getAllDaftarKegiatanMhs: (status: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(
        `${baseUrl}${daftarkegiatanmhs}?status=${status}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get all daftar kegiatan mahasiswa: ${error.message}`
          );
        });
    },
    createPresensi: (data: any) => {
      const headers = config();
      const requestConfig = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      };
      return fetch(`${baseUrl}${daftarkegiatanmhs}/presensi`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error create presensi mahasiswa: ${error.message}`);
        });
    },
  };
};

export default DaftarKegiatanMahasiswa;
```

## 2️⃣ Register Service in API Index

```ts
// /api/[nama_aplikasi]/index.ts
import { configureHeaders } from "./index";
import { API_URL } from "@/lib/constant";
import DaftarKegiatan from "./koordinator/daftar-kegiatan/daftar-kegiatan";

export const DaftarKegiatanService = DaftarKegiatan({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});
```

#### Note Configure Request Headers digunakan untuk menghasilkan header request secara konsisten, termasuk:

1. Content-Type
2. Authorization (Bearer Token)
3. Accept
4. Optional: file upload header
5. Tujuannya adalah standarisasi seluruh request API agar tidak perlu menulis header berulang di setiap endpoint.

## 3️⃣ Fetching Data in Component (Using SWR)

1. Untuk menggunakan SWR, dapat dilakukan dengan membuat fetcher terlebih dahulu.

```tsx
const fetcherDaftarKegiatanMahasiswa = (status: string) =>
  DaftarKegiatanMahasiswaService.getAllDaftarKegiatanMhs(status).then(
    (res) => res
  );
```

2. Kemudian menggunakan SWR untuk GET data.

```tsx
"use client";

import useSWR from "swr";

export function TablesRiwayat() {
  const { data, error, isLoading, mutate } = useSWR(
    ["daftar-kegiatan", activeTab],
    () => fetcherDaftarKegiatanMahasiswa(activeTab),
    { revalidateOnFocus: false }
  );

  // data -> result
  // isLoading -> loading state
  // error -> error handling
}
```

## 4️⃣ Mutation (Post/Put/Patch/Delete) — Manual Mutation Request + handleToastResponse

1. Gunakan manual mutation request untuk handling ketika ingin mengirimkan data.

```tsx
const res = await DaftarKegiatanMahasiswaService.createPresensi({
  code,
  kegiatan_id: String(selectedActivityId),
});
```

2. Gunakan handleToastResponse untuk menampilkan toast berdasarkan response yang didapatkan.

```tsx
handleToastResponse(res);
```

---

## 📚 **Additional Resources**

### Internal Documentation:

- [Server-Side Rendering Guide](./ssr-fetching.md)
- [Coding Standard](./coding-standards.md)
