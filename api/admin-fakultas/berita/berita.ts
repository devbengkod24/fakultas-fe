const Berita = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  // baseUrl already includes /api/v1, so path starts with /cms/...
  const berita = "/cms/public/berita";

  // Create headers for FormData (no Content-Type, let browser set it)
  const getFormDataHeaders = () => {
    // Create fresh headers without Content-Type
    const configHeaders = config();
    const headers = new Headers();

    headers.append("Accept", "application/json");

    // Copy Authorization from config headers
    const auth = configHeaders.get("Authorization");
    if (auth) {
      headers.append("Authorization", auth);
    }

    return headers;
  };

  return {
    getBeritaList: (page: number = 1, limit: number = 10, search: string = "", type: string = "") => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${berita}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      if (type && type !== "all") {
        url += `&type=${encodeURIComponent(type)}`;
      }

      console.log("[BeritaService.getBeritaList] Fetching from:", url);

      return fetch(url, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then((json) => {
          console.log("[BeritaService.getBeritaList] Response:", {
            hasData: !!json.data,
            dataIsArray: Array.isArray(json.data),
            dataLength: Array.isArray(json.data) ? json.data.length : "N/A",
            keys: Object.keys(json),
          });
          return json;
        })
        .catch((error) => {
          console.error("[BeritaService.getBeritaList] Error:", error);
          throw new Error(`Error fetching berita list: ${error.message}`);
        });
    },

    getBeritaById: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };
      return fetch(`${baseUrl}${berita}/${id}`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error fetching berita by ID: ${error.message}`);
        });
    },

    createBerita: (data: FormData) => {
      const headers = getFormDataHeaders();
      const requestConfig = {
        method: "POST",
        body: data,
        headers: headers,
      };
      return fetch(`${baseUrl}${berita}`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error in create berita: ${error.message}`);
        });
    },

    updateBerita: (id: number, data: FormData) => {
      const headers = getFormDataHeaders();
      // Use _method=PUT for Laravel route spoofing
      data.append("_method", "PUT");
      const requestConfig = {
        method: "POST",
        body: data,
        headers: headers,
      };
      return fetch(`${baseUrl}${berita}/${id}`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error in update berita: ${error.message}`);
        });
    },

    deleteBerita: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };
      return fetch(`${baseUrl}${berita}/${id}`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error in delete berita: ${error.message}`);
        });
    },
  };
};

export default Berita;