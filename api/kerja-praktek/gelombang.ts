import { Gelombang as GelombangType } from "@/types/kerja-praktek/gelombang";

const Gelombang = ({
    baseUrl,
    config,
} : {
    baseUrl: string;
    config: () => Headers;
}) => {
    const gelombang = "/kp/koor-kp/gelombang-sidang-kp";

    return {
        getAllGelombang: (periode_id?: number, search?: string, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${gelombang}`;

            // Buat array untuk menyimpan parameter query
            const queryParams = [];

            // Tambahkan search parameter jika ada
            if (search !== undefined && search !== null) {
                queryParams.push(`search=${encodeURIComponent(search)}`);
            }

            // Tambahkan periode_id ke URL jika nilainya disediakan dan bukan 0
            if (periode_id !== undefined && periode_id !== null && periode_id !== 0) {
                queryParams.push(`periode_id=${periode_id}`);
            }

            // Tambahkan prodi_id ke URL jika disediakan
            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                queryParams.push(`prodi_id=${prodi_id}`);
            }

            // Tambahkan parameter query ke URL jika ada
            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all gelombang: ${error.message}`);
                });
        },
        addGelombang: (data: GelombangType) => {
            const headers = config();
            
            const requestConfig = {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers,
            };

            return fetch(`${baseUrl}${gelombang}/store`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error gagal menambahkan gelombang: ${error.message}`);
                });
        },
        editGelombang: (data: GelombangType, id: number) => {
            const headers = config();
            
            const requestConfig = {
                method: "PATCH",
                body: JSON.stringify(data),
                headers: headers,
            };

            return fetch(`${baseUrl}${gelombang}/${id}/update`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error gagal mengedit gelombang: ${error.message}`);
                });
        },
        activateGelombang: (id: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                headers: headers,
            };

            return fetch(`${baseUrl}${gelombang}/${id}/aktivasi`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error gagal mengaktifkan gelombang: ${error.message}`);
                });
        },
        getGelombangAktif: (prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            let url = `${baseUrl}${gelombang}`;
            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                url += `?prodi_id=${prodi_id}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get gelombang aktif: ${error.message}`);
                });
        },
    }
}

export default Gelombang;