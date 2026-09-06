/* eslint-disable @typescript-eslint/no-explicit-any */

const ProgramUnggulanService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const programUnggulan = "/cms/admin/program-unggulan";

  const safeFetch = async (url: string, requestConfig: any) => {
    try {
      const response = await fetch(url, requestConfig);

      // Handle 204 No Content
      if (response.status === 204) {
        return { success: true, message: "Operation successful" };
      }

      // Try to parse JSON
      let data: any = {};
      try {
        data = await response.json();
      } catch (e) {
        // Not JSON
      }

      if (!response.ok) {
        // Handle specific Laravel "not found" errors
        const msg = (data.message || data.error || "").toString().toLowerCase();
        if (
          response.status === 404 ||
          msg.includes("no query results") ||
          msg.includes("not found") ||
          msg.includes("tidak ditemukan")
        ) {
          // If it's a DELETE, treat not found as success
          if (requestConfig.method === "DELETE") {
            return { success: true, message: "Program Unggulan berhasil dihapus" };
          }
        }
        
        return {
          success: false,
          message: data.message || `HTTP error! status: ${response.status}`,
          data: data
        };
      }

      // If response is OK but data doesn't have success field, add it
      if (data.success === undefined) {
        data.success = true;
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Network error"
      };
    }
  };

  return {
    getProgramUnggulanList: (page?: any, limit?: any, prodiId?: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${programUnggulan}?page=${page}&limit=${limit}`;
      if (prodiId) {
        url += `&prodi_id=${prodiId}`;
      }

      return safeFetch(url, requestConfig);
    },

    createProgramUnggulan: (data: any) => {
      const headers = config();
      const formData = new FormData();

      if (data.title) formData.append("title", data.title);
      if (data.short_desc) formData.append("short_desc", data.short_desc);
      if (data.imageFile) formData.append("image", data.imageFile);
      if (data.description) formData.append("description", data.description);
      if (data.partner) formData.append("partner", data.partner);
      if (data.duration) formData.append("duration", data.duration);
      if (data.location) formData.append("location", data.location);
      if (data.application_deadline) {
        formData.append("application_deadline", data.application_deadline);
      }
      if (data.application_link) {
        formData.append("application_link", data.application_link);
      }
      if (data.prodi_id) {
        formData.append("prodi_id", data.prodi_id.toString());
      }

      if (data.benefits && Array.isArray(data.benefits)) {
        data.benefits.forEach((benefit: string, index: number) => {
          formData.append(`benefits[${index}]`, benefit);
        });
      }

      if (data.requirements && Array.isArray(data.requirements)) {
        data.requirements.forEach((requirement: string, index: number) => {
          formData.append(`requirements[${index}]`, requirement);
        });
      }

      if (data.statistics && Array.isArray(data.statistics)) {
        data.statistics.forEach(
          (stat: { name: string; value: number }, index: number) => {
            if (stat.name && stat.value !== undefined && stat.value !== null) {
              formData.append(`statistics[${index}][name]`, stat.name);
              formData.append(`statistics[${index}][value]`, stat.value.toString());
            }
          }
        );
      }

      const formHeaders = new Headers(headers);
      formHeaders.delete("Content-Type");

      return safeFetch(`${baseUrl}${programUnggulan}`, {
        method: "POST",
        body: formData,
        headers: formHeaders,
      });
    },

    updateProgramUnggulan: (id: number, data: any) => {
      const headers = config();
      const formData = new FormData();

      if (data.title) formData.append("title", data.title);
      if (data.short_desc) formData.append("short_desc", data.short_desc);
      if (data.imageFile) formData.append("image", data.imageFile);
      if (data.description) formData.append("description", data.description);
      if (data.partner) formData.append("partner", data.partner);
      if (data.duration) formData.append("duration", data.duration);
      if (data.location) formData.append("location", data.location);
      if (data.application_deadline) {
        formData.append("application_deadline", data.application_deadline);
      }
      if (data.application_link) {
        formData.append("application_link", data.application_link);
      }

      if (data.benefits && Array.isArray(data.benefits)) {
        data.benefits.forEach((benefit: string, index: number) => {
          formData.append(`benefits[${index}]`, benefit);
        });
      }

      if (data.requirements && Array.isArray(data.requirements)) {
        data.requirements.forEach((requirement: string, index: number) => {
          formData.append(`requirements[${index}]`, requirement);
        });
      }

      if (data.statistics && Array.isArray(data.statistics)) {
        data.statistics.forEach(
          (stat: { name: string; value: number }, index: number) => {
            if (stat.name && stat.value !== undefined && stat.value !== null) {
              formData.append(`statistics[${index}][name]`, stat.name);
              formData.append(`statistics[${index}][value]`, stat.value.toString());
            }
          }
        );
      }

      formData.append("_method", "PUT");
      const formHeaders = new Headers(headers);
      formHeaders.delete("Content-Type");

      return safeFetch(`${baseUrl}${programUnggulan}/${id}`, {
        method: "POST",
        body: formData,
        headers: formHeaders,
      });
    },

    deleteProgramUnggulan: (id: number) => {
      const headers = config();
      return safeFetch(`${baseUrl}${programUnggulan}/${id}`, {
        method: "DELETE",
        headers: headers,
      });
    },
  };
};

export default ProgramUnggulanService;
