/* eslint-disable @typescript-eslint/no-explicit-any */

const AkreditasiService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const akreditasi = "/cms/admin/akreditasi";

  return {
    // Akreditasi Section
    getAllAkreditasi: (prodiId?: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${akreditasi}`;
      if (prodiId) {
        url += `?prodi_id=${prodiId}`;
      }

      return fetch(url, requestConfig)

        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all akreditasi section: ${error.message}`);
        });
    },
    createAkreditasi: (data: any) => {
      const headers = config();

      // Create FormData for file upload
      const formData = new FormData();

      // Append all fields to FormData
      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.accred) formData.append("accred", data.accred);
      if (data.imageFile) formData.append("image", data.imageFile);

      // Remove Content-Type header to let browser set it with boundary for FormData
      const formHeaders = new Headers(headers);
      formHeaders.delete("Content-Type");

      const requestConfig = {
        method: "POST",
        body: formData,
        headers: formHeaders,
      };

      return fetch(`${baseUrl}${akreditasi}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add Akreditasi section: ${error.message}`);
        });
    },
    updateAkreditasi: (id: number, data: any) => {
      const headers = config();

      // Create FormData for file upload
      const formData = new FormData();

      // Always append text fields (jangan skip field yang ada value)
      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.accred) formData.append("accred", data.accred);

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

      return fetch(`${baseUrl}${akreditasi}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in update akreditasi section: ${error.message}`
          );
        });
    },
    deleteAkreditasi: (id: number) => {
      const headers = config();

      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };

      return fetch(`${baseUrl}${akreditasi}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in delete akreditasi section: ${error.message}`
          );
        });
    },
  };
};

export default AkreditasiService;
