import { configurePublicHeaders } from "@/api/index";
import { API_URL } from "@/lib/constant";

const createManajemenProdiPublicService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/master/public/prodi";
  const categoryEndpoint = "/master/public/prodi-category";

  return {
    getAll: (params?: {
      category_id?: number;
      gelar?: string;
      search?: string;
      limit?: number;
      sort_by?: string;
      sort_order?: "asc" | "desc";
    }) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      const searchParams = new URLSearchParams();
      if (params?.category_id) searchParams.append("category_id", String(params.category_id));
      if (params?.gelar) searchParams.append("gelar", params.gelar);
      if (params?.search) searchParams.append("search", params.search);
      if (params?.limit) searchParams.append("limit", String(params.limit));
      if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params?.sort_order) searchParams.append("sort_order", params.sort_order);

      const queryString = searchParams.toString();
      const url = queryString
        ? `${baseUrl}${endpoint}?${queryString}`
        : `${baseUrl}${endpoint}`;

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching prodi list: ${error.message}`);
        });
    },

    getCategories: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${categoryEndpoint}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching prodi categories: ${error.message}`);
        });
    },
  };
};

export const ManajemenProdiPublicService = createManajemenProdiPublicService({
  baseUrl: API_URL || "",
  config: configurePublicHeaders,
});

export default ManajemenProdiPublicService;
