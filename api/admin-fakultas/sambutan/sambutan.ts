/* eslint-disable @typescript-eslint/no-explicit-any */

const SambutanService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const endpoint = "/sambutan";

  return {
    getAllSambutan: (prodiId?: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${cleanBaseUrl}${endpoint}`;
      if (prodiId) {
        url += `?prodi_id=${prodiId}`;
      }

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sambutan: ${error.message}`);
        });
    },

    createSambutan: (data: any) => {
      const headers = config();
      const formData = new FormData();

      if (data.name) formData.append("name", data.name);
      if (data.paragraph) formData.append("paragraph", data.paragraph);
      if (data.image) formData.append("image", data.image);
      if (data.prodi_id) formData.append("prodi_id", data.prodi_id);

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
          throw new Error(`Error in create sambutan: ${error.message}`);
        });
    },

    updateSambutan: (id: number, data: any) => {
      const headers = config();
      const formData = new FormData();

      if (data.name) formData.append("name", data.name);
      if (data.paragraph) formData.append("paragraph", data.paragraph);
      if (data.image) formData.append("image", data.image);
      
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
          throw new Error(`Error in update sambutan: ${error.message}`);
        });
    },

    deleteSambutan: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${cleanBaseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in delete sambutan: ${error.message}`);
        });
    },
  };
};

export default SambutanService;
