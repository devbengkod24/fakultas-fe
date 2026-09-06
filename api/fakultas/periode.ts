/* eslint-disable @typescript-eslint/no-explicit-any */
const PeriodeFakultas = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/periode";

  return {
    getAll: (page?: number, limit?: number, search?: string, prodiId?: string, status?: string) => {
      const headers = config();
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      if (search) params.append("search", search);
      if (prodiId) params.append("prodi_id", prodiId);
      if (status) params.append("status", status);

      return fetch(`${baseUrl}${endpoint}?${params.toString()}`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all periode: ${error.message}`);
        });
    },

    sync: () => {
      const headers = config();
      return fetch(`${baseUrl}${endpoint}/sync`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error sync periode: ${error.message}`);
        });
    },

    changeStatus: (id: number) => {
      const headers = config();
      return fetch(`${baseUrl}${endpoint}/${id}/change-status`, {
        method: "PUT",
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error change status periode: ${error.message}`);
        });
    },

    update: (id: number, data: any) => {
      const headers = config();
      return fetch(`${baseUrl}${endpoint}/${id}/update`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: headers,
      })
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error update periode: ${error.message}`);
        });
    },
  };
};

export default PeriodeFakultas;
