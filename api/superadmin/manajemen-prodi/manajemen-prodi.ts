const ManajemenProdiService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/master/super-fakultas/manajemen-prodi";

  return {
    getAll: (page: number, limit: number, search?: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.append("search", search);

      return fetch(`${baseUrl}${endpoint}?${params.toString()}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching prodi list: ${error.message}`);
        });
    },

    getById: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching prodi detail: ${error.message}`);
        });
    },

    create: (data: {
      nama: string;
      kode_prodi: string;
      category_id: number;
      gelar: string;
    }) => {
      const headers = config();
      headers.set("Content-Type", "application/json");

      const body = {
        ...data,
        prodi_category_id: data.category_id, // Fallback for some backend implementations
      };

      const requestConfig = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      };

      return fetch(`${baseUrl}${endpoint}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error creating prodi: ${error.message}`);
        });
    },

    update: (
      id: number,
      data: {
        nama?: string;
        kode_prodi?: string;
        category_id?: number;
        gelar?: string;
      }
    ) => {
      const headers = config();
      headers.set("Content-Type", "application/json");

      const body = {
        ...data,
        ...(data.category_id ? { prodi_category_id: data.category_id } : {}),
      };

      const requestConfig = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body),
      };

      return fetch(`${baseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error updating prodi: ${error.message}`);
        });
    },

    getCategories: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}/master/public/prodi-category`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching prodi categories: ${error.message}`);
        });
    },

    delete: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${baseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error deleting prodi: ${error.message}`);
        });
    },
  };
};

export default ManajemenProdiService;
