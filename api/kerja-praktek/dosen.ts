import { Dosen as DosenType } from "@/types/kerja-praktek/dosen";
import { SortConfig } from "@/types/kerja-praktek/sortconfig";

const Dosen = ({
    baseUrl,
    config,
} : {
    baseUrl: string;
    config: () => Headers;
}) => {
    const dosen = "/kp/koor-kp/dosen";

    return {
        getAllDosen: (page: number, limit: number, search: string, periode_id?: number, sort?: SortConfig, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${dosen}?limit=${limit}&search=${search}&page=${page}`;

            // Tambahkan periode_id ke URL hanya jika nilainya disediakan dan bukan 0
            if (periode_id !== undefined && periode_id !== null && periode_id !== 0) {
                url += `&periode_id=${periode_id}`;
            }

            // Tambahkan prodi_id ke URL jika disediakan
            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                url += `&prodi_id=${prodi_id}`;
            }

            if (sort) {
                if (sort.npp) {
                    url += `&sort[npp]=${sort.npp}`;
                }
                if (sort.name) {
                    url += `&sort[name]=${sort.name}`;
                }
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all dosen: ${error.message}`);
                });
        },
        syncDosen: () => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}/dosen/sync`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error sync dosen: ${error.message}`);
                });
        },
        tambahDosen: (data: DosenType) => {
            const headers = config();
            
            const requestConfig = {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers,
            };

            return fetch(`${baseUrl}/dosen/add`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error gagal menambahkan dosen: ${error.message}`);
                });
        },
        updateDosen: (data: DosenType, id: number) => {
            const headers = config();
            
            const requestConfig = {
                method: "PATCH",
                body: JSON.stringify(data),
                headers: headers,
            };

            return fetch(`${baseUrl}/dosen/${id}/update`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error gagal mengupdate dosen: ${error.message}`);
                });
        },
        updateKuota: (id: number, kuota: number) => {
            const headers = config();
            
            const requestConfig = {
                method: "PATCH",
                body: JSON.stringify({ kuota }),
                headers: headers,
            };

            return fetch(`${baseUrl}${dosen}/${id}/kuota`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error gagal mengupdate kuota dosen: ${error.message}`);
                });
        },
        deleteDosen: (id: number) => {
            const headers = config();
            
            const requestConfig = {
                method: "DELETE",
                headers: headers,
            };

            return fetch(`${baseUrl}/dosen/${id}/delete`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error gagal menghapus dosen: ${error.message}`);
                });
        },
        getDosenById: (id: number) => {
            const headers = config();
            
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}${dosen}/${id}`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error gagal mendapatkan dosen: ${error.message}`);
                });
        },
        getDosenUpdateDospem: (prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            let url = `${baseUrl}/kp/koor-kp/mahasiswa/dosen-periode`;
            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                url += `?prodi_id=${prodi_id}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error gagal mendapatkan dosen untuk update dospem: ${error.message}`);
                });
        },
        getDosenByPeriode: (page?: number, limit?: number, search?: string, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            const queryParams: string[] = [];
            if (page !== undefined && page !== null) queryParams.push(`page=${page}`);
            if (limit !== undefined && limit !== null) queryParams.push(`limit=${limit}`);
            if (search !== undefined && search !== null && search !== "") {
                queryParams.push(`search=${encodeURIComponent(search)}`);
            }
            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                queryParams.push(`prodi_id=${prodi_id}`);
            }

            const qs = queryParams.length ? `?${queryParams.join("&")}` : "";
            return fetch(`${baseUrl}${dosen}/by-periode${qs}`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get dosen by periode: ${error.message}`);
                });
        },
        toggleAktifPeriode: (id: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                headers: headers,
            };

            return fetch(`${baseUrl}${dosen}/${id}/toggle-aktif`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error toggle aktif periode: ${error.message}`);
                });
        },
    }
}

export default Dosen;