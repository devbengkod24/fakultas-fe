/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const RekapNilaiMahasiswa = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const rekapnilaimahasiswa = "/bk/rekap-nilai-mahasiswa";

    return {
      getAllRekapNilai: () => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        const url = addProdiToUrl(`${baseUrl}${rekapnilaimahasiswa}`);
        return fetch(url, requestConfig)
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error get all rekap nilai mahasiswa: ${error.message}`);
          });
      },

      getAllRekapNilaiDetail: (id: number) => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        const url = addProdiToUrl(`${baseUrl}${rekapnilaimahasiswa}/${id}`);
        return fetch(url, requestConfig)
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error get detail rekap nilai: ${error.message}`);
          });
      },

      getSertifikat: (kegiatan_id: number) => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        const url = addProdiToUrl(`${baseUrl}${rekapnilaimahasiswa}/sertifikat?kegiatan_id=${kegiatan_id}`);
        return fetch(url, requestConfig)
          .then(async (response) => {
            // Check if response is ok
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check content type
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/pdf")) {
              throw new Error(`Expected PDF but got: ${contentType}`);
            }

            return response.blob();
          })
          .catch((error) => {
            throw new Error(`Error get sertifikat: ${error.message}`);
          });
      },

      getInformasi: () => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        const url = addProdiToUrl(`${baseUrl}${rekapnilaimahasiswa}/informasi`);
        return fetch(url, requestConfig)
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error get informasi: ${error.message}`);
          });
      },
    };
};

export default RekapNilaiMahasiswa;