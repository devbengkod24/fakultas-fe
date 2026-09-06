/* eslint-disable @typescript-eslint/no-explicit-any */
const StrukturOrganisasiService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const strukturOrganisasi = "/cms/admin/struktur";

  return {
    getStrukturOrgnisasiAll: (page: any, limit: any, search?: string, prodiId?: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      // Build query params, only include search if it has a value
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search && search.trim() !== "") {
        queryParams.append("search", search);
      }

      if (prodiId) {
        queryParams.append("prodi_id", prodiId.toString());
      }


      return fetch(
        `${baseUrl}${strukturOrganisasi}?${queryParams.toString()}`,
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error fetching struktur-organisasi: ${error.message}`
          );
        });
    },

    createStrukturOrganisasi: (data: any) => {
      const headers = config();

      // Create FormData for file upload
      const formData = new FormData();

      // Append all fields to FormData
      if (data.name) formData.append("name", data.name);
      if (data.position) formData.append("position", data.position);
      if (data.imageFile) formData.append("image", data.imageFile);
      if (data.order_no) formData.append("order_no", data.order_no);

      // Remove Content-Type header to let browser set it with boundary for FormData
      const formHeaders = new Headers(headers);
      formHeaders.delete("Content-Type");

      const requestConfig = {
        method: "POST",
        body: formData,
        headers: formHeaders,
      };

      return fetch(`${baseUrl}${strukturOrganisasi}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add struktur-organisasi: ${error.message}`);
        });
    },

    updateStrukturOrganisasi: (id: number, data: any) => {
      const headers = config();

      // Create FormData for file upload
      const formData = new FormData();

      // Always append text fields (jangan skip field yang ada value)
      if (data.name) formData.append("name", data.name);
      if (data.position) formData.append("position", data.position);

      // Only append image if a new file is selected
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }
      if (data.order_no) formData.append("order_no", data.order_no);

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

      return fetch(`${baseUrl}${strukturOrganisasi}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in update struktur-organisasi: ${error.message}`
          );
        });
    },

    deleteStrukturOrganisasi: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };
      return fetch(`${baseUrl}${strukturOrganisasi}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error in delete struktur-organisasi: ${error.message}`
          );
        });
    },
  };
};

export default StrukturOrganisasiService;
