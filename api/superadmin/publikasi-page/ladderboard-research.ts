const LadderboardResearchServices = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const ladderboard = "/stats/top-authors/researches?limit=5";

  return {
    // Research Leaderboard Section
    getAllLadderboardResearch: () => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(`${baseUrl}${ladderboard}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(
            `Error get all research ladderboard services section: ${error.message}`
          );
        });
    },
  };
};

export default LadderboardResearchServices;
