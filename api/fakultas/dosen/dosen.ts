/* eslint-disable @typescript-eslint/no-explicit-any */
const PUBLIKASI_API_URL = process.env.NEXT_PUBLIC_API_PUBLIKASI_URL || "";

export type Dosen = {
  id: number;
  nama: string;
  npp?: string;
  gelar_depan?: string;
  gelar_belakang?: string;
  jabatan?: string;
  jabatan_fungsional?: string;
  bidang_kajian?: string;
  scholar_link?: string;
  telepon?: string;
  email_alternatif?: string;
  prodi_homebase?: any;
  prodi_tugas?: any;
};

const DosenFakultas = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/master/dosen";
  const dosenEndpoint = "/master/dosen";
  const prodiEndpoint = "/fik/prodi";

  return {
    getAll: (page: number, limit: number, search?: string, prodi?: string, jabatan?: string) => {
      const headers = config();
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search);
      if (prodi) params.append("prodi_id", prodi);
      if (jabatan) params.append("jabatan_fungsional", jabatan);
      return fetch(`${baseUrl}${endpoint}?${params.toString()}`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error get all dosen: ${error.message}`); });
    },

    sync: () => {
      const headers = config();
      return fetch(`${baseUrl}${dosenEndpoint}/sync`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error sync dosen: ${error.message}`); });
    },

    getById: (id: number) => {
      const headers = config();
      return fetch(`${baseUrl}${dosenEndpoint}/${id}`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error fetching dosen by ID: ${error.message}`); });
    },

    // ── CRUD data biografis dosen (riwayat karir/pendidikan, pengabdian, kekayaan intelektual) ──
    createKeterangan: (dosenId: number, type: string, data: Record<string, unknown>) => {
      const headers = config();
      return fetch(`${baseUrl}${dosenEndpoint}/${dosenId}/${type}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error creating ${type}: ${error.message}`); });
    },

    updateKeterangan: (dosenId: number, type: string, itemId: number, data: Record<string, unknown>) => {
      const headers = config();
      return fetch(`${baseUrl}${dosenEndpoint}/${dosenId}/${type}/${itemId}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error updating ${type}: ${error.message}`); });
    },

    deleteKeterangan: (dosenId: number, type: string, itemId: number) => {
      const headers = config();
      return fetch(`${baseUrl}${dosenEndpoint}/${dosenId}/${type}/${itemId}`, {
        method: "DELETE",
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error deleting ${type}: ${error.message}`); });
    },

    // ── CRUD Jadwal Mengajar ──
    createJadwalMengajar: (dosenId: number, data: { hari: string; jam: string; kelas: string; matkul: string; ruang: string }) => {
      const headers = config();
      return fetch(`${baseUrl}${dosenEndpoint}/${dosenId}/jadwal-mengajar`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error creating jadwal mengajar: ${error.message}`); });
    },

    updateJadwalMengajar: (dosenId: number, itemId: number, data: { hari: string; jam: string; kelas: string; matkul: string; ruang: string }) => {
      const headers = config();
      return fetch(`${baseUrl}${dosenEndpoint}/${dosenId}/jadwal-mengajar/${itemId}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error updating jadwal mengajar: ${error.message}`); });
    },

    deleteJadwalMengajar: (dosenId: number, itemId: number) => {
      const headers = config();
      return fetch(`${baseUrl}${dosenEndpoint}/${dosenId}/jadwal-mengajar/${itemId}`, {
        method: "DELETE",
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error deleting jadwal mengajar: ${error.message}`); });
    },

    getProdi: () => {
      const headers = config();
      return fetch(`${baseUrl}${prodiEndpoint}?limit=100`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error fetching prodi: ${error.message}`); });
    },

    getJabatanOptions: () => {
      const headers = config();
      return fetch(`${baseUrl}${dosenEndpoint}/jabatan-options`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error fetching jabatan options: ${error.message}`); });
    },

    update: (id: number, data: {
      npp?: string;
      nidn?: string;
      gelar_depan?: string;
      gelar_belakang?: string;
      jabatan_fungsional?: string;
      golongan?: string;
      bidang_kajian?: string;
      scholar_link?: string;
      telepon?: string;
      email_alternatif?: string;
      prodi_ids?: number[];
    }) => {
      const headers = config();
      return fetch(`${baseUrl}${dosenEndpoint}/${id}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error updating dosen: ${error.message}`); });
    },

    updateProfil: (data: {
      bidang_kajian?: string;
      scholar_link?: string;
      telepon?: string;
      email_alternatif?: string;
    }) => {
      const headers = config();
      return fetch(`${baseUrl}/update-profil-dosen`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error updating profil dosen: ${error.message}`); });
    },

    getPublikasi: (dosenId: number, params?: {
      article_page?: number;
      article_limit?: number;
      research_page?: number;
      research_limit?: number;
    }) => {
      const headers = config();
      const queryParams = new URLSearchParams({
        article_page: (params?.article_page ?? 1).toString(),
        article_limit: (params?.article_limit ?? 10).toString(),
        research_page: (params?.research_page ?? 1).toString(),
        research_limit: (params?.research_limit ?? 10).toString(),
      });
      return fetch(`${PUBLIKASI_API_URL}/dosen/publikasi/${dosenId}?${queryParams}`, {
        method: "GET",
        headers,
      })
        .then((response) => response.json())
        .catch((error) => { throw new Error(`Error fetching publikasi dosen: ${error.message}`); });
    },

    // ── CRUD Publikasi ──
    createArtikel: (authorId: number, data: {
      judul: string;
      tahun: number;
      jurnal: string;
      doi?: string;
      accred?: string;
      abstrak?: string;
      url_artikel?: string;
      sumber?: "GARUDA" | "SCOPUS" | "GOOGLE_SCHOLAR";
      jumlah_sitasi?: number;
      is_locked?: boolean;
      co_author_ids?: number[];
      penulis_utama_id?: number;
    }) => {
      const headers = config();
      return fetch(`${PUBLIKASI_API_URL}/authors/${authorId}/articles`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .catch((err) => { throw new Error(`Error creating artikel: ${err.message}`); });
    },

    updateArtikel: (articleId: number, data: {
      judul?: string;
      tahun?: number;
      jurnal?: string;
      doi?: string;
      accred?: string;
      abstrak?: string;
      url_artikel?: string;
      sumber?: "GARUDA" | "SCOPUS" | "GOOGLE_SCHOLAR";
      jumlah_sitasi?: number;
      penulis_utama_id?: number;
      is_locked?: boolean;
    }) => {
      const headers = config();
      return fetch(`${PUBLIKASI_API_URL}/articles/${articleId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .catch((err) => { throw new Error(`Error updating artikel: ${err.message}`); });
    },

    deleteArtikel: (articleId: number) => {
      const headers = config();
      return fetch(`${PUBLIKASI_API_URL}/articles/${articleId}`, {
        method: "DELETE",
        headers,
      })
        .then((res) => res.json())
        .catch((err) => { throw new Error(`Error deleting artikel: ${err.message}`); });
    },

    // ── Co-author picker & mutasi ──
    // Sumber id yang benar untuk co_author_ids: penulis.id (author_id), BUKAN dosen.id.
    getAuthorsWithDosen: (search?: string, limit: number = 200, dosenId?: number) => {
      const headers = config();
      const params = new URLSearchParams({ page: "1", limit: limit.toString() });
      if (search) params.append("search", search);
      if (dosenId != null) params.append("dosen_id", dosenId.toString());
      return fetch(`${PUBLIKASI_API_URL}/authors-with-dosen?${params.toString()}`, {
        method: "GET",
        headers,
      })
        .then((res) => res.json())
        .catch((err) => { throw new Error(`Error fetching authors with dosen: ${err.message}`); });
    },

    updateArtikelCoAuthors: (articleId: number, data: {
      co_author_ids: number[];
      action: "add" | "remove" | "replace";
    }) => {
      const headers = config();
      return fetch(`${PUBLIKASI_API_URL}/articles/${articleId}/co-authors`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .catch((err) => { throw new Error(`Error updating co-author artikel: ${err.message}`); });
    },

    updatePenelitianCoAuthors: (researchId: number, data: {
      co_author_ids: number[];
      action: "add" | "remove" | "replace";
    }) => {
      const headers = config();
      return fetch(`${PUBLIKASI_API_URL}/researches/${researchId}/co-authors`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .catch((err) => { throw new Error(`Error updating co-author penelitian: ${err.message}`); });
    },

    // ── CRUD Penelitian ──
    getPenelitianDetail: (researchId: number) => {
      const headers = config();
      return fetch(`${PUBLIKASI_API_URL}/researches/${researchId}`, {
        method: "GET",
        headers,
      })
        .then((res) => res.json())
        .catch((err) => { throw new Error(`Error fetching penelitian detail: ${err.message}`); });
    },

    createPenelitian: (authorId: number, data: {
      judul: string;
      tahun: number;
      dana?: number;
      sumber_dana?: string;
      status_dana?: string;
      fund_type?: string;
      nama_ketua?: string;
      is_locked?: boolean;
      co_author_ids?: number[];
    }) => {
      const headers = config();
      return fetch(`${PUBLIKASI_API_URL}/authors/${authorId}/researches`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .catch((err) => { throw new Error(`Error creating penelitian: ${err.message}`); });
    },

    updatePenelitian: (researchId: number, data: {
      judul?: string;
      tahun?: number;
      dana?: number;
      sumber_dana?: string;
      status_dana?: string;
      fund_type?: string;
      nama_ketua?: string;
      is_locked?: boolean;
    }) => {
      const headers = config();
      return fetch(`${PUBLIKASI_API_URL}/researches/${researchId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .catch((err) => { throw new Error(`Error updating penelitian: ${err.message}`); });
    },

    deletePenelitian: (researchId: number) => {
      const headers = config();
      return fetch(`${PUBLIKASI_API_URL}/researches/${researchId}`, {
        method: "DELETE",
        headers,
      })
        .then((res) => res.json())
        .catch((err) => { throw new Error(`Error deleting penelitian: ${err.message}`); });
    },

    // ✅ Pindahkan ke sini, masih di dalam return { ... }
    getTtd: (dosenId: number) => {
      const headers = config();
      return fetch(`${baseUrl}${dosenEndpoint}/${dosenId}/ttd`, {
        method: "GET",
        headers,
      })
        .then((res) => {
          if (!res.ok) {
            // 404 or other HTTP errors - return not found response without throwing
            return { success: false, message: "TTD not found", data: null };
          }
          return res.json();
        })
        .catch((err) => {
          // Network errors - return not found without throwing
          console.error("Error fetching TTD:", err);
          return { success: false, message: "Error fetching TTD", data: null };
        });
    },

    uploadTtd: (dosenId: number, file: File, isSelf: boolean = true) => {
      const headers = config();
      headers.delete("Content-Type");
      const formData = new FormData();
      formData.append("ttd_dosen", file);

      const endpoint = isSelf
        ? `${baseUrl}/update-profil-dosen`
        : `${baseUrl}${dosenEndpoint}/${dosenId}`;

      return fetch(endpoint, {
        method: "PUT",
        headers,
        body: formData,
      })
        .then((res) => res.json())
        .catch((err) => { throw new Error(`Error uploading TTD: ${err.message}`); });
    },

  }; // ← penutup return {}
};   // ← penutup DosenFakultas

export default DosenFakultas;