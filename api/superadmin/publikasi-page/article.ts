const ArticleService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const publikasiEndpoint = "/articles";

  return {
    getAllArticle: (params?: {
      source?: string;
      prodi?: string;
      min_year?: number;
      max_year?: number;
      page: number;
      limit: number;
      sort_by_citation?: boolean;
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

        if (params.source) queryParams.append("source", params.source);
        if (params.prodi) queryParams.append("prodi", params.prodi);
        if (params.min_year)
          queryParams.append("min_year", params.min_year.toString());
        if (params.max_year)
          queryParams.append("max_year", params.max_year.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.sort_by_citation !== undefined)
          queryParams.append(
            "sort_by_citation",
            params.sort_by_citation.toString()
          );

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
          throw new Error(`Error get all article section: ${error.message}`);
        });
    },

    searchArticlesByAuthor: (params?: {
      source?: string;
      prodi?: string;
      min_year?: number;
      max_year?: number;
      page: number;
      limit: number;
      sort_by_citation?: boolean;
      name: string;
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

        if (params.source) queryParams.append("source", params.source);
        if (params.prodi) queryParams.append("prodi", params.prodi);
        if (params.min_year)
          queryParams.append("min_year", params.min_year.toString());
        if (params.max_year)
          queryParams.append("max_year", params.max_year.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.sort_by_citation !== undefined)
          queryParams.append(
            "sort_by_citation",
            params.sort_by_citation.toString()
          );
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
            `Error searching articles by author: ${error.message}`
          );
        });
    },

    searchArticlesByTitle: (params?: {
      title: string;
      source?: string;
      prodi?: string;
      min_year?: number;
      max_year?: number;
      page: number;
      limit: number;
      sort_by_citation?: boolean;
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
        if (params.source) queryParams.append("source", params.source);
        if (params.prodi) queryParams.append("prodi", params.prodi);
        if (params.min_year)
          queryParams.append("min_year", params.min_year.toString());
        if (params.max_year)
          queryParams.append("max_year", params.max_year.toString());
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.sort_by_citation !== undefined)
          queryParams.append(
            "sort_by_citation",
            params.sort_by_citation.toString()
          );

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
            `Error searching articles by title: ${error.message}`
          );
        });
    },

    getArticleDetail: (articleId: string) => {
      const headers = config();

      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const url = `${baseUrl}${publikasiEndpoint}/${articleId}`;

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get article detail: ${error.message}`);
        });
    },
  };
};

export default ArticleService;
