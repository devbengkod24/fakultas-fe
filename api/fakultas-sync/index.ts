/* eslint-disable @typescript-eslint/no-explicit-any */

export type SyncResult = {
  total_fetched: number;
  total_synced: number;
  errors: number;
  error_details: any[];
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

    syncAll: () => post("/sync/all"),

    syncProdi: () => post("/sync/prodi"),

    syncPeriode: () => post("/sync/periode"),

    syncMatkul: () => post("/sync/matkul"),

    syncDosen: (kodeProdi?: string) =>
      post("/sync/dosen", kodeProdi ? { kode_prodi: kodeProdi } : undefined),

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
      return post(`/sync/mahasiswa${qs ? `?${qs}` : ""}`);
    },

    syncKrsKhs: (body: {
      prodi?: string;
      nim?: string;
      limit?: number;
      offset?: number;
    }) => post("/sync/krs-khs", body),

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
      return post(`/sync/yudisium${qs ? `?${qs}` : ""}`);
    },
  };
};

export default FakultasSync;
