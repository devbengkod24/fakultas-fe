/* eslint-disable @typescript-eslint/no-explicit-any */
const ResearchFundServices = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const research = "/stats/research/fund";

  return {
    // Pengertian Section
    getAllResearchFund: async (year_range: any) => {
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
        throw new Error(`Error get research fund section: ${error.message}`);
      }
    },
  };
};

export default ResearchFundServices;
