/* eslint-disable @typescript-eslint/no-explicit-any */
const LadderboardArticleServices = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const ladderboard = "/stats/top-authors/articles?limit=10";

  return {
    // Pengertian Section
    getAllLadderboardArticle: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${ladderboard}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get all ladderboard services section: ${error.message}`
          );
        });
    },
  };
};

export default LadderboardArticleServices;
