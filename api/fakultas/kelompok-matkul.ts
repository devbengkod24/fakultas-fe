/* eslint-disable @typescript-eslint/no-explicit-any */

const KelompokMatkulFakultas = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/fik/kelompok-matkul";

  return {
    getAll: (params?: {
      page?: number;
      limit?: number;
      search?: string;
    }) => {
      const headers = config();
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      const qs = queryParams.toString();

      return fetch(`${baseUrl}${endpoint}${qs ? `?${qs}` : ""}`, {
        method: "GET",
        headers,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get Kelompok Matkul: ${error.message}`);
        });
    },
  };
};

export default KelompokMatkulFakultas;
