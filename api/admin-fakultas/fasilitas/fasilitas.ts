/* eslint-disable @typescript-eslint/no-explicit-any */

const FasilitasService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const endpoint = "/fasilitas";

  return {
    getAllFasilitas: (page?: number, limit?: number, search?: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (limit) queryParams.append("limit", limit.toString());
      if (search) queryParams.append("search", search);

      const queryString = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";

      const url = `${cleanBaseUrl}${endpoint}${queryString}`;

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all fasilitas: ${error.message}`);
        });
    },

    createFasilitas: (data: any) => {
      const headers = config();
      const formData = new FormData();

      if (data.judul) formData.append("judul", data.judul);
      if (data.deskripsi) formData.append("deskripsi", data.deskripsi);
      if (data.gambar) formData.append("gambar", data.gambar);

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
          throw new Error(`Error in create fasilitas: ${error.message}`);
        });
    },

    updateFasilitas: (id: number, data: any) => {
      const headers = config();
      const formData = new FormData();

      if (data.judul) formData.append("judul", data.judul);
      if (data.deskripsi) formData.append("deskripsi", data.deskripsi);
      if (data.gambar) formData.append("gambar", data.gambar);
      
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
          throw new Error(`Error in update fasilitas: ${error.message}`);
        });
    },

    deleteFasilitas: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${cleanBaseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in delete fasilitas: ${error.message}`);
        });
    },
  };
};

export default FasilitasService;
