import { GelombangTA } from "@/types/tugas-akhir/gelombang";

const GelombangTAApi = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const base = "/ta/koor-ta/gelombang-sidang";

  return {
    getAllGelombang: (
      periode_id?: number,
      tipe?: string,
      search?: string,
      page?: number,
      limit?: number,
    ) => {
      const headers = config();
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (periode_id) params.append("periode_id", String(periode_id));
      if (tipe) params.append("tipe", tipe);
      if (page) params.append("page", String(page));
      if (limit) params.append("limit", String(limit));

      const url = `${baseUrl}${base}${params.toString() ? `?${params}` : ""}`;

      return fetch(url, { method: "GET", headers })
        .then((res) => res.json())
        .catch((err) => {
          throw new Error(`Error get gelombang TA: ${err.message}`);
        });
    },

    addGelombang: (data: GelombangTA) => {
      const headers = config();

      return fetch(`${baseUrl}${base}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers,
      })
        .then((res) => res.json())
        .catch((err) => {
          throw new Error(`Error tambah gelombang TA: ${err.message}`);
        });
    },

    editGelombang: (data: GelombangTA, id: number) => {
      const headers = config();

      return fetch(`${baseUrl}${base}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers,
      })
        .then((res) => res.json())
        .catch((err) => {
          throw new Error(`Error edit gelombang TA: ${err.message}`);
        });
    },

    activateGelombang: (id: number) => {
      const headers = config();

      return fetch(`${baseUrl}${base}/${id}/aktivasi`, {
        method: "POST",
        headers,
      })
        .then((res) => res.json())
        .catch((err) => {
          throw new Error(`Error aktivasi gelombang TA: ${err.message}`);
        });
    },

    deleteGelombang: (id: number) => {
      const headers = config();

      return fetch(`${baseUrl}${base}/${id}`, {
        method: "DELETE",
        headers,
      })
        .then((res) => res.json())
        .catch((err) => {
          throw new Error(`Error hapus gelombang TA: ${err.message}`);
        });
    },
  };
};

export default GelombangTAApi;
