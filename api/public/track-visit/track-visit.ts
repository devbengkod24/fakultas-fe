const TrackVisitService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const endpoint = "/cms/public/track-visit";

  return {
    track: () => {
      const headers = config();
      const requestConfig = {
        method: "POST",
        headers: headers,
      };

      return fetch(`${baseUrl}${endpoint}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error tracking visit: ${error.message}`);
        });
    },
  };
};

export default TrackVisitService;
