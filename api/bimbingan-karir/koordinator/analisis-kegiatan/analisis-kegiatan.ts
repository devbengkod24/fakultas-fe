/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const AnalisisKegiatan = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const analisiskegiatan = "/bk/analisis";

  return {
    getAllAnalisisKegiatan: (prodiId: number | null, kategori: string, periode_1: number, periode_2: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(addProdiToUrl(`${baseUrl}${analisiskegiatan}?periode_1=${periode_1}&periode_2=${periode_2}&kategori=${kategori}`, prodiId),
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all analisis kegiatan: ${error.message}`);
        });
    },

  };
};

export default AnalisisKegiatan;