/* eslint-disable @typescript-eslint/no-explicit-any */
const ArticleStatisticServices = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const article = "/stats/articles/source";

  return {
    // Pengertian Section
    getAllArticleStatistic: async (year_range: any) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      try {
        const response = await fetch(
          `${baseUrl}${article}?year_range=${year_range}`,
          requestConfig
        );
        return await response.json();
      } catch (error: any) {
        throw new Error(
          `Error get summary statistic section: ${error.message}`
        );
      }
    },
  };
};

export default ArticleStatisticServices;
