const StrukturOrganisasiService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const adminPath = "/cms/admin-fakultas/struktur-organisasi";
  const publicPath = "/cms/public/struktur-organisasi";

  const getFormDataHeaders = () => {
    const configHeaders = config();
    const headers = new Headers();
    headers.append("Accept", "application/json");
    const auth = configHeaders.get("Authorization");
    if (auth) {
      headers.append("Authorization", auth);
    }
    return headers;
  };

  return {
    // Public (No Auth)
    getStrukturPublic: (page?: number, limit?: number, search?: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (limit) queryParams.append("limit", limit.toString());
      if (search) queryParams.append("search", search);

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

      return fetch(`${baseUrl}${publicPath}${queryString}`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error fetching public struktur organisasi: ${error.message}`);
        });
    },

    headStrukturPublic: () => {
      const headers = config();
      const requestConfig = {
        method: "HEAD",
        headers: headers,
      };
      return fetch(`${baseUrl}${publicPath}`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response;
        })
        .catch((error) => {
          throw new Error(`Error in HEAD public struktur organisasi: ${error.message}`);
        });
    },

    // Admin List
    getStrukturAdmin: (page?: number, limit?: number, search?: string) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page.toString());
      if (limit) queryParams.append("limit", limit.toString());
      if (search) queryParams.append("search", search);

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

      return fetch(`${baseUrl}${adminPath}${queryString}`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error fetching admin struktur organisasi: ${error.message}`);
        });
    },

    createStruktur: (data: FormData) => {
      const headers = getFormDataHeaders();
      const requestConfig = {
        method: "POST",
        body: data,
        headers: headers,
      };
      return fetch(`${baseUrl}${adminPath}`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error in create struktur organisasi: ${error.message}`);
        });
    },

    updateStruktur: (id: number, data: FormData) => {
      const headers = getFormDataHeaders();
      // Laravel method spoofing for PUT
      data.append("_method", "PUT");
      const requestConfig = {
        method: "POST",
        body: data,
        headers: headers,
      };
      return fetch(`${baseUrl}${adminPath}/${id}`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error in update struktur organisasi: ${error.message}`);
        });
    },

    deleteStruktur: (id: number) => {
      const headers = config();
      const requestConfig = {
        method: "DELETE",
        headers: headers,
      };
      return fetch(`${baseUrl}${adminPath}/${id}`, requestConfig)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error in delete struktur organisasi: ${error.message}`);
        });
    },
  };
};

export default StrukturOrganisasiService;
