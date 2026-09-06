const ResearchService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const publikasiEndpoint = "/researches";

  return {
    getAllResearch: (params?: {
      fund_source?: string;
      prodi?: string;
      min_year?: number;
      max_year?: number;
      termahal?: boolean;
      page: number;
      limit: number;
    }) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      // Build query string from params
      let url = `${baseUrl}${publikasiEndpoint}`;
      if (params) {
        const queryParams = new URLSearchParams();

        if (params.fund_source)
          queryParams.append("fund_source", params.fund_source);
        if (params.prodi) 
          queryParams.append("prodi", params.prodi);
        if (params.min_year)
          queryParams.append("min_year", params.min_year.toString());
        if (params.max_year)
          queryParams.append("max_year", params.max_year.toString());
        if (params.termahal) queryParams.append("termahal", "true");
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      return fetch(url, requestConfig)
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          throw new Error(`Error get all research section: ${error.message}`);
        });
    },

    searchResearchByAuthor: (params?: {
      fund_source?: string;
      prodi?: string;
      min_year?: number;
      max_year?: number;
      page: number;
      limit: number;
      name: string;
      termahal?: boolean;
    }) => {
      const headers = config();

      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      // Build query string from params
      let url = `${baseUrl}/search${publikasiEndpoint}/authors`;
      if (params) {
        const queryParams = new URLSearchParams();

        if (params.fund_source)
          queryParams.append("fund_source", params.fund_source);
        if (params.prodi) 
          queryParams.append("prodi", params.prodi);
        if (params.min_year)
          queryParams.append("min_year", params.min_year.toString());
        if (params.max_year)
          queryParams.append("max_year", params.max_year.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.termahal !== undefined)
          queryParams.append("termahal", params.termahal.toString());
        if (params.name) queryParams.append("name", params.name);

        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      return fetch(url, requestConfig)
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          throw new Error(
            `Error searching research by author: ${error.message}`
          );
        });
    },

    searchResearchByTitle: (params?: {
      title: string;
      prodi?: string;
      fund_source?: string;
      min_year?: number;
      max_year?: number;
      page: number;
      limit: number;
      termahal?: boolean;
    }) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      // Build query string from params
      let url = `${baseUrl}/search${publikasiEndpoint}/title`;
      if (params) {
        const queryParams = new URLSearchParams();

        if (params.title) queryParams.append("title", params.title);
        if (params.prodi) queryParams.append("prodi", params.prodi);
        if (params.fund_source)
          queryParams.append("fund_source", params.fund_source);
        if (params.min_year)
          queryParams.append("min_year", params.min_year.toString());
        if (params.max_year)
          queryParams.append("max_year", params.max_year.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.termahal !== undefined)
          queryParams.append("termahal", params.termahal.toString());

        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      return fetch(url, requestConfig)
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          throw new Error(
            `Error searching research by title: ${error.message}`
          );
        });
    },
  };
};

export default ResearchService;
