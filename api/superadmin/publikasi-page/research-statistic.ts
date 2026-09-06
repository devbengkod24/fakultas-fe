/* eslint-disable @typescript-eslint/no-explicit-any */
const ResearchStatisticServices = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const research = "/stats/research/total";

  return {
    // Pengertian Section
    getAllResearchStatistic: async (year_range: any) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      try {
        const response = await fetch(
          `${baseUrl}${research}?year_range=${year_range}`,
          requestConfig
        );
        return await response.json();
      } catch (error: any) {
        throw new Error(
          `Error get research statistic section: ${error.message}`
        );
      }
    },
  };
};

export default ResearchStatisticServices;
