/* eslint-disable @typescript-eslint/no-explicit-any */

export type Krs = {
  id: number;
  nama_krs: string;
  mahasiswa_id: number;
  nim: string;
  nama_mahasiswa: string;
  prodi: string;
  periode_id: number;
  tahun_ajaran: string;
  created_at: string;
  updated_at: string;
};

const KrsFakultas = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/fik/krs";

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
          throw new Error(`Error get KRS: ${error.message}`);
        });
    },
  };
};

export default KrsFakultas;
