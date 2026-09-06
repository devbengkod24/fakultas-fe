/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const DaftarKegiatan = ({
    baseUrl,
    config,
}: {
    baseUrl: string;
    config: () => Headers;
}) => {
    const daftarkegiatan = "/bk/kegiatan";

    return {
        getAllDaftarKegiatan: (prodiId: number | null, status: string) => {
            if (prodiId === null) {
                return Promise.resolve({ success: true, data: [] });
            }

            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(addProdiToUrl(`${baseUrl}${daftarkegiatan}?status=${status}`, prodiId),
                requestConfig
            )
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all daftar kegiatan: ${error.message}`);
                });
        },

        createDaftarKegiatan: (data: FormData) => {
            const headers = config();

            if (headers.has("Content-Type")) {
                headers.delete("Content-Type");
            }
            const requestConfig = {
                method: "POST",
                body: data,
                headers,
            };
            return fetch(addProdiToUrl(`${baseUrl}${daftarkegiatan}`),
                requestConfig
            )
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error create daftar kegiatan: ${error.message}`);
                });
        },

        updateDaftarKegiatan: (id: number, data: FormData) => {
            const headers = config();
            if (headers.has("Content-Type")) {
                headers.delete("Content-Type");
            }
            const requestConfig = {
                method: "POST",
                body: data,
                headers,
            };
            return fetch(addProdiToUrl(`${baseUrl}${daftarkegiatan}/${id}`), requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error in update daftar kegiatan: ${error.message}`);
                });
        },

        getDaftarKegiatanDetail: (id: number) => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(addProdiToUrl(`${baseUrl}${daftarkegiatan}/${id}`),
                requestConfig
            )
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get daftar kegiatan detail: ${error.message}`);
                });
        },

        deleteDaftarKegiatan: (id: number) => {
            const headers = config();
            const requestConfig = {
                method: "DELETE",
                headers: headers,
            };
            return fetch(addProdiToUrl(`${baseUrl}${daftarkegiatan}/${id}`), requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error in delete daftar kegiatan: ${error.message}`);
                });
        },
    };
};

export default DaftarKegiatan;