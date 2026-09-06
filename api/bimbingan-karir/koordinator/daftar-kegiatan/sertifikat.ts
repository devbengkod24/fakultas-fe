/* eslint-disable @typescript-eslint/no-explicit any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const Sertifikat = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const sertifikat = "/bk/sertifikat";

    return {
        getAllSertifikat: (prodiId?: number | null) => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(addProdiToUrl(`${baseUrl}${sertifikat}`, prodiId),
            requestConfig
            )
            .then((response) => response.json())
            .catch((error) => {
                throw new Error(`Error get all sertifikat: ${error.message}`);
            });
        },

        getSertifikatPreview: async (template_id: number) => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            try {
                const response = await fetch(
                    addProdiToUrl(`${baseUrl}${sertifikat}/preview?template_id=${template_id}`),
                    requestConfig
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                return { data: url };
            } catch (error: any) {
                throw new Error(`Error get preview sertifikat: ${error.message}`);
            }
        },

        createSertifikat: (rilis: string, kegiatan_id: string, template_id: string) => {
            const headers = config();

            const requestConfig = {
                method: "POST",
                headers,
            };
            return fetch(addProdiToUrl(`${baseUrl}${sertifikat}/${rilis}?kegiatan_id=${kegiatan_id}&template_id=${template_id}`),
                requestConfig
            )
                .then((response) => response.json())
                .catch((error) => {
                throw new Error(`Error create sertifikat: ${error.message}`);
            });
        },

        createSertifikatTemplate: (data: FormData, prodiId?: number | null) => {
            const headers = config();

            if (headers.has("Content-Type")) {
                headers.delete("Content-Type");
            }
            const requestConfig = {
                method: "POST",
                body: data,
                headers,
            };

            return fetch(addProdiToUrl(`${baseUrl}${sertifikat}`, prodiId),
                requestConfig
            )
                .then((response) => response.json())
                .catch((error) => {
                throw new Error(`Error create sertifikat: ${error.message}`);
            });
        },

        updateSertifikatTemplate: (data: FormData, id:number, prodiId?: number | null) => {
            const headers = config();

            if (headers.has("Content-Type")) {
                headers.delete("Content-Type");
            }
            const requestConfig = {
                method: "POST",
                body: data,
                headers,
            };

            return fetch(addProdiToUrl(`${baseUrl}${sertifikat}/${id}`, prodiId),
                requestConfig
            )
                .then((response) => response.json())
                .catch((error) => {
                throw new Error(`Error create sertifikat: ${error.message}`);
            });
        },

        deleteSertifikatTemplate: (id:number) => {
            const headers = config();
            const requestConfig = {
              method: "DELETE",
              headers: headers,
            };

            return fetch(addProdiToUrl(`${baseUrl}${sertifikat}/${id}`),
                requestConfig
            )
                .then((response) => response.json())
                .catch((error) => {
                throw new Error(`Error create sertifikat: ${error.message}`);
            });
        },



    };
  };

  export default Sertifikat;