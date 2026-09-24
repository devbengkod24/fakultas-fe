/* eslint-disable @typescript-eslint/no-explicit-any */

export type SyncErrorDetail = {
  item: string | null;
  // Nama dosen dari sumber (mis. sync_dosen) -- opsional krn gak semua sync
  // service (mahasiswa/periode/dll) kirim field ini, cuma dosen yang perlu.
  nama?: string | null;
  error: string;
  code?: string;
};

// Peringatan non-blocking -- item TETAP sukses ter-sync, cuma ke-flag buat
// direview manual (mis. possible_duplicate_sibling di sync_dosen). Beda dari
// SyncErrorDetail (`error`) yang berarti item GAGAL -- field ini `warning`.
export type SyncWarningDetail = {
  item: string | null;
  nama?: string | null;
  warning: string;
  code?: string;
};

export type SyncResult = {
  total_fetched: number;
  total_synced: number;
  errors: number;
  error_details: SyncErrorDetail[];
  warnings?: SyncWarningDetail[];
};

export type SyncResponse = {
  success: boolean;
  message: string;
  data: SyncResult | Record<string, SyncResult>;
};

const FakultasSync = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const post = (endpoint: string, body?: any) => {
    const headers = config();
    return fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
      .then((response) => response.json())
      .catch((error) => {
        throw new Error(`Sync error (${endpoint}): ${error.message}`);
      });
  };

  return {
    health: () => {
      return fetch(`${baseUrl}/health`, { method: "GET" })
        .then((res) => res.json())
        .catch((err) => {
          throw new Error(`Health check failed: ${err.message}`);
        });
    },

    syncAll: () => post("/all"),

    syncProdi: () => post("/prodi"),

    syncPeriode: () => post("/periode"),

    syncMatkul: () => post("/matkul"),

    syncDosen: (kodeProdi?: string) =>
      post("/dosen", kodeProdi ? { kode_prodi: kodeProdi } : undefined),

    syncMahasiswa: (params?: {
      prodi?: string;
      nim?: string;
      angkatan?: string;
      status?: string;
      status_mhs?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.prodi) queryParams.append("prodi", params.prodi);
      if (params?.nim) queryParams.append("nim", params.nim);
      if (params?.angkatan) queryParams.append("angkatan", params.angkatan);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.status_mhs) queryParams.append("status_mhs", params.status_mhs);
      const qs = queryParams.toString();
      return post(`/mahasiswa${qs ? `?${qs}` : ""}`);
    },

    syncKrsKhs: (params?: {
      prodi?: string;
      nim?: string;
      max_items?: number;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.prodi) queryParams.append("prodi", params.prodi);
      if (params?.nim) queryParams.append("nim", params.nim);
      if (params?.max_items) queryParams.append("max_items", String(params.max_items));
      const qs = queryParams.toString();
      return post(`/krs-khs${qs ? `?${qs}` : ""}`);
    },

    syncKelompokMatkul: (params?: {
      prodi?: string;
      nim?: string;
      max_items?: number;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.prodi) queryParams.append("prodi", params.prodi);
      if (params?.nim) queryParams.append("nim", params.nim);
      if (params?.max_items) queryParams.append("max_items", String(params.max_items));
      const qs = queryParams.toString();
      return post(`/kelompok-matkul${qs ? `?${qs}` : ""}`);
    },

    syncYudisium: (params?: {
      nim?: string;
      prodi?: string;
      wisuda_ke?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.nim) queryParams.append("nim", params.nim);
      if (params?.prodi) queryParams.append("prodi", params.prodi);
      if (params?.wisuda_ke) queryParams.append("wisuda_ke", params.wisuda_ke);
      const qs = queryParams.toString();
      return post(`/yudisium${qs ? `?${qs}` : ""}`);
    },
  };
};

export default FakultasSync;
