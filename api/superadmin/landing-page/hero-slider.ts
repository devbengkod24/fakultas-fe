/* eslint-disable @typescript-eslint/no-explicit-any */
const HeroSliderService = ({
  baseUrl,
  config,
  endpoint = "/cms/admin/heroslider",
}: {
  baseUrl: string;
  config: () => Headers;
  endpoint?: string;
}) => {
  return {
    getHeroSliderList: (
      page: any,
      limit: any,
      prodiId?: number | string | null,
      search?: string,
      status?: string,
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${endpoint}?page=${page}&limit=${limit}`;
      if (prodiId !== undefined && prodiId !== null) {
        url += `&prodi_id=${prodiId}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (status) {
        url += `&status=${encodeURIComponent(status)}`;
      }

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching hero-slider: ${error.message}`);
        });
    },

    createHeroSlider: (data: any) => {
      const headers = config();

      // Create FormData for file upload
      const formData = new FormData();

      // Append all fields to FormData
      if (data.title) formData.append("title", data.title);
      if (data.subtitle) formData.append("subtitle", data.subtitle);
      if (data.imageFile) formData.append("image", data.imageFile);
      if (data.isActive !== undefined)
        formData.append("isActive", data.isActive.toString());

      // Remove Content-Type header to let browser set it with boundary for FormData
      const formHeaders = new Headers(headers);
      formHeaders.delete("Content-Type");

      const requestConfig = {
        method: "POST",
        body: formData,
        headers: formHeaders,
      };

      return fetch(`${baseUrl}${endpoint}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add hero-slider: ${error.message}`);
        });
    },

    updateHeroSlider: (id: number, data: any) => {
      const headers = config();

      // Create FormData for file upload
      const formData = new FormData();

      // Always append text fields (jangan skip field yang ada value)
      if (data.title) formData.append("title", data.title);
      if (data.subtitle) formData.append("subtitle", data.subtitle);

      // Only append image if a new file is selected
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      // Append isActive field if it exists
      if (data.isActive !== undefined) {
        formData.append("isActive", data.isActive.toString());
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

      return fetch(`${baseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in update hero-slider: ${error.message}`);
        });
    },

    deleteHeroSlider: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };
      return fetch(`${baseUrl}${endpoint}/${id}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in delete hero-slider: ${error.message}`);
        });
    },
  };
};

export default HeroSliderService;
