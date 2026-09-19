/* eslint-disable @typescript-eslint/no-explicit-any */

export type Prodi = {
  id: number;
  nama: string;
  kode_prodi: string;
  category_id: number;
  gelar: string;
  created_at: string;
  updated_at: string;
};

const ProdiFakultas = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/fik/prodi";

  return {
    getAll: (page?: number, limit?: number, search?: string) => {
      const headers = config();
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      if (search) params.append("search", search);

      return fetch(`${baseUrl}${endpoint}?${params.toString()}`, {
        method: "GET",
        headers,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get prodi: ${error.message}`);
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
          throw new Error(`Error get prodi by id: ${error.message}`);
        });
    },
  };
};

export default ProdiFakultas;
