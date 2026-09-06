/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const FeedbackRating = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const feedback = "/bk/feedback";

    return {
      getAllFeedback: (prodiId: number | null, page: any, limit: any, kegiatan_id?: any, rating?: number) => {
        const headers = config();
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));

        if (kegiatan_id !== undefined && kegiatan_id !== "" && !Number.isNaN(Number(kegiatan_id))) {
          params.set("kegiatan_id", String(kegiatan_id));
        } else {
          params.set("kegiatan_id", "");
        }

        if (rating !== undefined) {
          // rating bisa "" (untuk semua) atau "1".."5"
          params.set("rating", String(rating));
        }

        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        return fetch(addProdiToUrl(`${baseUrl}${feedback}?${params.toString()}`, prodiId), requestConfig)
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error get all feedback: ${error.message}`);
          });
      },
      getAllOptions: (prodiId?: number | null) => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        return fetch(addProdiToUrl(`${baseUrl}${feedback}/kegiatan-options`, prodiId),
          requestConfig
        )
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error get all kegiatan options: ${error.message}`);
          });
      },
      getFeedbackSummary: (id:number) => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        return fetch(addProdiToUrl(`${baseUrl}${feedback}/summary/${id}`),
          requestConfig
        )
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error get feedback summary: ${error.message}`);
          });
      },
      createFeedbackSummary: (id:number) => {
        const headers = config();
        const requestConfig = {
          method: "POST",
          headers: headers,
        };

        return fetch(addProdiToUrl(`${baseUrl}${feedback}/summary/${id}`),
          requestConfig
        )
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error create feedback summary: ${error.message}`);
          });
      },

    };
};

export default FeedbackRating;