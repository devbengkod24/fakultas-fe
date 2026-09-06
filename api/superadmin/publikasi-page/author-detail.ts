/* eslint-disable @typescript-eslint/no-explicit-any */
const AuthorDetailServices = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const author = "/authors";
  const dosenPublikasi = "/dosen/publikasi";

  return {
    // Get Author Detail with optimized pagination
    getAuthorDetail: async ({
      id,
      article_page = 1,
      article_limit = 10,
      research_page = 1,
      research_limit = 10,
    }: {
      id: string | number;
      article_page?: number;
      article_limit?: number;
      research_page?: number;
      research_limit?: number;
    }) => {
      const headers = config();
      const params = new URLSearchParams({
        article_page: article_page.toString(),
        article_limit: article_limit.toString(),
        research_page: research_page.toString(),
        research_limit: research_limit.toString(),
      }).toString();

      const url = `${baseUrl}${author}/${id}?${params}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error: any) {
        throw new Error(
          `Error get author detail services section: ${error.message}`
        );
      }
    },

    // Get Author Articles Only (optimized for articles tab)
    getAuthorArticles: async ({
      id,
      page = 1,
      limit = 10,
    }: {
      id: string | number;
      page?: number;
      limit?: number;
    }) => {
      const headers = config();
      const params = new URLSearchParams({
        article_page: page.toString(),
        article_limit: limit.toString(),
        research_page: "1",
        research_limit: "1", // Minimal research data
      }).toString();

      const url = `${baseUrl}${author}/${id}?${params}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Return only article-related data
        return {
          ...result,
          data: {
            ...result.data,
            articles: result.data?.articles || [],
            total_articles: result.data?.total_articles || 0,
          },
        };
      } catch (error: any) {
        throw new Error(`Error get author articles: ${error.message}`);
      }
    },

    // Get Author Research Only (optimized for research tab)
    getAuthorResearch: async ({
      id,
      page = 1,
      limit = 10,
    }: {
      id: string | number;
      page?: number;
      limit?: number;
    }) => {
      const headers = config();
      const params = new URLSearchParams({
        article_page: "1",
        article_limit: "1", // Minimal article data
        research_page: page.toString(),
        research_limit: limit.toString(),
      }).toString();

      const url = `${baseUrl}${author}/${id}?${params}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Return only research-related data
        return {
          ...result,
          data: {
            ...result.data,
            researches: result.data?.researches || [],
            total_researches: result.data?.total_researches || 0,
          },
        };
      } catch (error: any) {
        throw new Error(`Error get author research: ${error.message}`);
      }
    },

    // Get Author Detail by dosen_id (dosen_id-keyed, bukan penulis_id)
    getDosenDetail: async ({
      id,
      article_page = 1,
      article_limit = 10,
      research_page = 1,
      research_limit = 10,
    }: {
      id: string | number;
      article_page?: number;
      article_limit?: number;
      research_page?: number;
      research_limit?: number;
    }) => {
      const headers = config();
      const params = new URLSearchParams({
        article_page: article_page.toString(),
        article_limit: article_limit.toString(),
        research_page: research_page.toString(),
        research_limit: research_limit.toString(),
      }).toString();

      const url = `${baseUrl}${dosenPublikasi}/${id}?${params}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error: any) {
        throw new Error(
          `Error get dosen detail services section: ${error.message}`
        );
      }
    },

    // Get Articles Only by dosen_id (optimized for articles tab)
    getDosenArticles: async ({
      id,
      page = 1,
      limit = 10,
    }: {
      id: string | number;
      page?: number;
      limit?: number;
    }) => {
      const headers = config();
      const params = new URLSearchParams({
        article_page: page.toString(),
        article_limit: limit.toString(),
        research_page: "1",
        research_limit: "1", // Minimal research data
      }).toString();

      const url = `${baseUrl}${dosenPublikasi}/${id}?${params}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        return {
          ...result,
          data: {
            ...result.data,
            articles: result.data?.articles || [],
            total_articles: result.data?.total_articles || 0,
          },
        };
      } catch (error: any) {
        throw new Error(`Error get dosen articles: ${error.message}`);
      }
    },

    // Get Research Only by dosen_id (optimized for research tab)
    getDosenResearch: async ({
      id,
      page = 1,
      limit = 10,
    }: {
      id: string | number;
      page?: number;
      limit?: number;
    }) => {
      const headers = config();
      const params = new URLSearchParams({
        article_page: "1",
        article_limit: "1", // Minimal article data
        research_page: page.toString(),
        research_limit: limit.toString(),
      }).toString();

      const url = `${baseUrl}${dosenPublikasi}/${id}?${params}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        return {
          ...result,
          data: {
            ...result.data,
            researches: result.data?.researches || [],
            total_researches: result.data?.total_researches || 0,
          },
        };
      } catch (error: any) {
        throw new Error(`Error get dosen research: ${error.message}`);
      }
    },
  };
};

export default AuthorDetailServices;
