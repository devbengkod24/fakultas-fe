import { AkunUser } from "@/types/fakultas/users/user";

const ManajemenAdminService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const endpoint = "/master/super-fakultas/manajemen-admin";

  return {
    getAdminAll: (page: number | string, limit: number | string, search?: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${cleanBaseUrl}${endpoint}?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${search}`;
      }

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching manajemen-admin: ${error.message}`);
        });
    },

    createAdmin: (data: Partial<AkunUser>) => {
      const headers = config();
      const formData = new FormData();

      // Append all data to formData
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof AkunUser];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((val) => formData.append(`${key}[]`, String(val)));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const formHeaders = new Headers(headers);
      formHeaders.delete("Content-Type");

      const requestConfig = {
        method: "POST",
        body: formData,
        headers: formHeaders,
      };

      return fetch(`${cleanBaseUrl}${endpoint}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add manajemen-admin section: ${error.message}`);
        });
    },

    updateAdmin: (id: number, data: Partial<AkunUser>) => {
      const headers = config();
      const formData = new FormData();

      // Append all data to formData
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof AkunUser];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((val) => formData.append(`${key}[]`, String(val)));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Laravel Multipart PUT workaround
      formData.append("_method", "PUT");

      const formHeaders = new Headers(headers);
      formHeaders.delete("Content-Type");

      const requestConfig = {
        method: "POST", // Use POST for multipart with _method spoofing
        body: formData,
        headers: formHeaders,
      };

      return fetch(`${cleanBaseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update manajemen-admin section: ${error.message}`);
        });
    },

    deleteAdmin: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${cleanBaseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in delete manajemen-admin section: ${error.message}`);
        });
    },
  };
};

export default ManajemenAdminService;
