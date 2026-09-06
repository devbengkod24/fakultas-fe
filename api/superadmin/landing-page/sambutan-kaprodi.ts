/* eslint-disable @typescript-eslint/no-explicit-any */

const SambutanKaprodiService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const sambutan = "/cms/admin/sambutan";

  return {
    // Akreditasi Section
    getAllSambutan: (prodiId?: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${sambutan}`;
      if (prodiId) {
        url += `?prodi_id=${prodiId}`;
      }

      return fetch(url, requestConfig)

        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all sambutan section: ${error.message}`);
        });
    },
    createSambutan: (data: any) => {
      const headers = config();

      // Create FormData for file upload
      const formData = new FormData();

      // Append all fields to FormData
      if (data.name) formData.append("name", data.name);
      if (data.paragraph) formData.append("paragraph", data.paragraph);
      if (data.imageFile) formData.append("image", data.imageFile);

      // Remove Content-Type header to let browser set it with boundary for FormData
      const formHeaders = new Headers(headers);
      formHeaders.delete("Content-Type");

      const requestConfig = {
        method: "POST",
        body: formData,
        headers: formHeaders,
      };

      return fetch(`${baseUrl}${sambutan}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add Sambutan section: ${error.message}`);
        });
    },

    updateSambutan: (id: number, data: any) => {
      const headers = config();

      // Create FormData for file upload
      const formData = new FormData();

      // Always append text fields (jangan skip field yang ada value)
      if (data.name) formData.append("name", data.name);
      if (data.paragraph) formData.append("paragraph", data.paragraph);

      // Only append image if a new file is selected
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      // Add method spoofing for Laravel (common requirement for file uploads with PUT)
      formData.append("_method", "PUT");

      // Remove Content-Type header to let browser set it with boundary for FormData
      const formHeaders = new Headers(headers);
      formHeaders.delete("Content-Type");

      const requestConfig = {
        method: "POST", // Use POST with _method spoofing
        body: formData,
        headers: formHeaders,
      };

      return fetch(`${baseUrl}${sambutan}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update sambutan section: ${error.message}`);
        });
    },
    deleteSambutan: (id: number) => {
      const headers = config();

      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${baseUrl}${sambutan}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in delete sambutan section: ${error.message}`);
        });
    },
  };
};

export default SambutanKaprodiService;
