/* eslint-disable @typescript-eslint/no-explicit-any */
const SidangKoor = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const base = "/ta/koor-ta";

  return {
    // Gelombang
    getGelombang: () =>
      fetch(`${baseUrl}${base}/gelombang-sidang`, {
        method: "GET",
        headers: config(),
      }).then((r) => r.json()),

    getGelombangAktif: (tipe?: string, prodiId?: number) => {
      const params = new URLSearchParams();
      if (tipe) params.set("tipe", tipe);
      if (prodiId) params.set("prodi_id", String(prodiId));
      return fetch(`${baseUrl}${base}/gelombang-sidang/aktif?${params}`, {
        method: "GET",
        headers: config(),
      }).then((r) => r.json());
    },

    createGelombang: (data: {
      nama_gelombang: string;
      tgl_awal: string;
      tgl_akhir: string;
    }) =>
      fetch(`${baseUrl}${base}/gelombang-sidang`, {
        method: "POST",
        headers: config(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),

    updateGelombang: (
      id: number,
      data: { nama_gelombang?: string; tgl_awal?: string; tgl_akhir?: string },
    ) =>
      fetch(`${baseUrl}${base}/gelombang-sidang/${id}`, {
        method: "PATCH",
        headers: config(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),

    deleteGelombang: (id: number) =>
      fetch(`${baseUrl}${base}/gelombang-sidang/${id}`, {
        method: "DELETE",
        headers: config(),
      }).then((r) => r.json()),

    aktivasiGelombang: (id: number) =>
      fetch(`${baseUrl}${base}/gelombang-sidang/${id}/aktivasi`, {
        method: "POST",
        headers: config(),
      }).then((r) => r.json()),

    // Plot Jadwal
    getPlotJadwal: (
      gelombangId: number | null,
      tipe?: string,
      search?: string,
      status?: "semua" | "belum" | "sudah",
    ) => {
      const params = new URLSearchParams();
      if (gelombangId !== null && gelombangId !== undefined)
        params.set("gelombang_id", String(gelombangId));
      if (tipe) params.set("tipe", tipe);
      if (search) params.set("search", search);
      if (status && status !== "semua") params.set("status", status);
      return fetch(`${baseUrl}${base}/plot-jadwal-sidang?${params}`, {
        method: "GET",
        headers: config(),
      }).then((r) => r.json());
    },

    getRuangan: () =>
      fetch(`${baseUrl}${base}/plot-jadwal-sidang/ruangan`, {
        method: "GET",
        headers: config(),
      }).then((r) => r.json()),

    buatJadwal: (data: {
      gelombang_id: number;
      tgl_sidang: string;
      ruangan_id?: number | null;
      jam_mulai: string;
      sidang_items: Array<{
        sidang_id: number;
        tipe: "ta1" | "ta2";
        urutan?: number | null;
        pendamping_id?: number | null;
        penguji_id?: number | null;
        penguji_2_id?: number | null;
        penguji_3_id?: number | null;
      }>;
    }) =>
      fetch(`${baseUrl}${base}/plot-jadwal-sidang/buat`, {
        method: "POST",
        headers: config(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),

    updateJadwal: (
      sidangId: number,
      data: {
        tipe: "ta1" | "ta2";
        urutan?: number | null;
        pendamping_id?: number | null;
        penguji_id?: number | null;
        penguji_2_id?: number | null;
        penguji_3_id?: number | null;
        tgl_sidang?: string | null;
        ruangan_id?: number | null;
        jam_mulai?: string | null;
      },
    ) =>
      fetch(`${baseUrl}${base}/plot-jadwal-sidang/${sidangId}`, {
        method: "PATCH",
        headers: config(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),

    getDosenAvailability: (dosenId: number, bulan: number, tahun: number) =>
      fetch(
        `${baseUrl}${base}/plot-jadwal-sidang/dosen/${dosenId}/availability?bulan=${bulan}&tahun=${tahun}`,
        { method: "GET", headers: config() },
      ).then((r) => r.json()),

    // Hasil Sidang
    getHasilSidang: (
      gelombangId: number | null,
      tipe?: string,
      search?: string,
    ) => {
      const params = new URLSearchParams();
      if (gelombangId) params.set("gelombang_id", String(gelombangId));
      if (tipe) params.set("tipe", tipe);
      if (search) params.set("search", search);
      return fetch(`${baseUrl}${base}/hasil-sidang?${params}`, {
        method: "GET",
        headers: config(),
      }).then((r) => r.json());
    },

    inputNilai: (
      sidangId: number,
      data: {
        tipe: string;
        nilai_pembimbing: number;
        nilai_penguji_1: number;
        nilai_penguji_2?: number | null;
        nilai_penguji_3?: number | null;
      },
    ) =>
      fetch(`${baseUrl}${base}/hasil-sidang/${sidangId}/nilai`, {
        method: "POST",
        headers: config(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),

    validasiNilai: (
      sidangId: number,
      tipe: string,
      validasiStatus: "diterima" | "ditolak" | "batal",
    ) =>
      fetch(`${baseUrl}${base}/hasil-sidang/${sidangId}/validasi`, {
        method: "POST",
        headers: config(),
        body: JSON.stringify({ tipe, validasi_status: validasiStatus }),
      }).then((r) => r.json()),

    bulkValidasiNilai: (sidangIds: number[], tipe: string, validasiStatus: "diterima" | "ditolak") =>
      fetch(`${baseUrl}${base}/hasil-sidang/bulk-validasi`, {
        method: "POST",
        headers: config(),
        body: JSON.stringify({ sidang_ids: sidangIds, tipe, validasi_status: validasiStatus }),
      }).then((r) => r.json()),

    downloadBeritaAcara: (sidangId: number, tipe: string) => {
      const params = new URLSearchParams({ tipe });
      return fetch(
        `${baseUrl}${base}/hasil-sidang/${sidangId}/berita-acara?${params}`,
        { method: "GET", headers: config() },
      );
    },

    downloadAllBeritaAcara: (gelombangId: number | null, tipe: string) => {
      const params = new URLSearchParams({ tipe });
      if (gelombangId) params.set("gelombang_id", String(gelombangId));
      return fetch(
        `${baseUrl}${base}/hasil-sidang/berita-acara/bulk?${params}`,
        { method: "GET", headers: config() },
      );
    },

    getRekaptulasi: (gelombangId?: number | null, tipe?: string) => {
      const params = new URLSearchParams();
      if (gelombangId) params.set('gelombang_id', String(gelombangId));
      if (tipe) params.set('tipe', tipe);
      return fetch(`${baseUrl}${base}/hasil-sidang/rekaptulasi?${params}`, {
        method: 'GET',
        headers: config(),
      }).then((r) => r.json());
    },

    exportRekaptulasi: (gelombangId?: number | null, tipe?: string) => {
      const params = new URLSearchParams();
      if (gelombangId) params.set('gelombang_id', String(gelombangId));
      if (tipe) params.set('tipe', tipe);
      return fetch(`${baseUrl}${base}/hasil-sidang/rekaptulasi/export?${params}`, {
        method: 'GET',
        headers: config(),
      });
    },

    generateUndangan: (params: {
      tipe: "ta1" | "ta2";
      gelombang_id?: number | null;
      kode_undangan?: string;
      tgl_undangan?: string;
      group_by?: "jadwal" | "pembimbing";
    }) => {
      const qs = new URLSearchParams({ tipe: params.tipe });
      if (params.gelombang_id) qs.set("gelombang_id", String(params.gelombang_id));
      if (params.kode_undangan) qs.set("kode_undangan", params.kode_undangan);
      if (params.tgl_undangan) qs.set("tgl_undangan", params.tgl_undangan);
      if (params.group_by) qs.set("group_by", params.group_by);
      return fetch(
        `${baseUrl}${base}/plot-jadwal-sidang/undangan?${qs}`,
        { method: "GET", headers: config() },
      );
    },
  };
};

export default SidangKoor;
