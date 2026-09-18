/* eslint-disable @typescript-eslint/no-explicit-any */

export type Mahasiswa = {
  mahasiswa_id: number;
  name: string;
  email: string;
  nim: string;
  ipk: number;
  transkrip: string | null;
  telepon: string | null;
  photo: string | null;
  dosen_name: string;
  krs_ta1: number;
  krs_ta2: number;
  created_at: string;
  created_at_sta1: string | null;
  jalur_sta1: string | null;
  created_at_sta2: string | null;
  jalur_sta2: string | null;
  prodi: string | null;
  kode_prodi: string | null;
  angkatan: string | null;
  semester_aktif: number | null;
  status: string | null;
  sks_lulus: number | null;
  sks_aktif: number | null;
  sks_gagal: number | null;
  minat: string | null;
  cuti: string | null;
};

const MahasiswaFakultas = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/mahasiswa";

  return {
    getAll: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      prodi?: string;
    }) => {
      const headers = config();
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.prodi) queryParams.append("prodi", params.prodi);
      const qs = queryParams.toString();

      return fetch(`${baseUrl}${endpoint}${qs ? `?${qs}` : ""}`, {
        method: "GET",
        headers,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get mahasiswa: ${error.message}`);
        });
    },

    getById: (id: number) => {
      const headers = config();
      return fetch(`${baseUrl}${endpoint}/${id}/detail`, {
        method: "GET",
        headers,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get mahasiswa by id: ${error.message}`);
        });
    },
  };
};

export default MahasiswaFakultas;
