/* eslint-disable @typescript-eslint/no-explicit-any */

export type MataKuliah = {
  id: number;
  kode: string;
  name: string;
  sks: number;
  semester: number | null;
  peminatan_id: number | null;
  prodi_id: number;
  created_at: string;
  updated_at: string;
};

const MataKuliahFakultas = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/cms/mata-kuliah";

  return {
    getAll: (params?: { semester?: string; prodi_id?: string }) => {
      const headers = config();
      const queryParams = new URLSearchParams();
      if (params?.semester) queryParams.append("semester", params.semester);
      if (params?.prodi_id) queryParams.append("prodi_id", params.prodi_id);
      const qs = queryParams.toString();

      return fetch(`${baseUrl}${endpoint}${qs ? `?${qs}` : ""}`, {
        method: "GET",
        headers,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get mata kuliah: ${error.message}`);
        });
    },

    getById: (id: number) => {
      const headers = config();
      return fetch(`${baseUrl}${endpoint}/${id}`, {
        method: "GET",
        headers,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get mata kuliah by id: ${error.message}`);
        });
    },
  };
};

export default MataKuliahFakultas;
