import { LogbookForm } from "@/types/kerja-praktek/logbook";

const Logbook = ({
    baseUrl,
    config,
}: {
    baseUrl: string;
    config: () => Headers;
}) => {
    const logbook = "/kp/koor-kp/logbook";

    return {
        getAllLogbook: (page: number, limit: number, search: string, periode_id?: number, filter?: string, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${logbook}?limit=${limit}&search=${search}&page=${page}`;

            // Tambahkan periode_id ke URL hanya jika nilainya disediakan dan bukan 0
            if (periode_id !== undefined && periode_id !== null && periode_id !== 0) {
                url += `&periode_id=${periode_id}`;
            }

            // Tambahkan filter jika disediakan (mis. 'perlu-acc')
            if (filter !== undefined && filter !== null && filter !== "") {
                url += `&filter=${encodeURIComponent(filter)}`;
            }

            // Tambahkan prodi_id ke URL jika disediakan (untuk koordinator filter by prodi)
            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                url += `&prodi_id=${prodi_id}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all logbook: ${error.message}`);
                });
        },
        getLogbookByIdKoor: (id: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}${logbook}/${id}`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get logbook by id: ${error.message}`);
                });
        },
        getLogbookByIdDosen: (id: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}/kp/dosen/logbook/${id}`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get logbook by id: ${error.message}`);
                });
        },
        acceptLogbookKoor: (logbookId: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                headers: headers,
            };

            return fetch(`${baseUrl}${logbook}/${logbookId}/accept`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error accept logbook: ${error.message}`);
                });
        },
        acceptLogbookDosen: (logbookId: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                headers: headers,
            };

            return fetch(`${baseUrl}/kp/dosen/logbook/${logbookId}/accept`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error accept logbook: ${error.message}`);
                });
        },
        getLatestKP: () => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}/kp/mahasiswa/logbook`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get latest KP: ${error.message}`);
                });
        },
        getLogbookByIdKP: (id: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}/kp/mahasiswa/logbook/${id}`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get logbook by id KP: ${error.message}`);
                });
        },
        addLogbook: (data: LogbookForm, id: number) => {
            const headers = config();
            headers.append("Content-Type", "application/json");

            const requestConfig = {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data),
            };

            return fetch(`${baseUrl}/kp/mahasiswa/logbook/${id}`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error add logbook: ${error.message}`);
                });
        },
        updateLinkFolder: (id: number, link_folder: string) => {
            const headers = config();
            headers.append("Content-Type", "application/json");

            const requestConfig = {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify({ link_folder }),
            };

            return fetch(`${baseUrl}/kp/mahasiswa/logbook/${id}/folder`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update link folder: ${error.message}`);
                });
        },
        getAllLogbookDosen: (page: number, limit: number, search: string, periode_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}/kp/dosen/logbook?limit=${limit}&search=${search}&page=${page}`;

            // Tambahkan periode_id ke URL hanya jika nilainya disediakan dan bukan 0
            if (periode_id !== undefined && periode_id !== null && periode_id !== 0) {
                url += `&periode_id=${periode_id}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all logbook: ${error.message}`);
                });
        },
        updateLogbook: (id: number, data: LogbookForm) => {
            const headers = config();
            headers.append("Content-Type", "application/json");

            const requestConfig = {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify(data),
            };

            return fetch(`${baseUrl}/kp/mahasiswa/logbook/${id}`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update logbook: ${error.message}`);
                });
        },
        updateStatusLogbook: (logbookId: number, status: string) => {
            const headers = config();
            headers.append("Content-Type", "application/json");

            const requestConfig = {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify({ status }),
            };

            return fetch(`${baseUrl}/kp/dosen/logbook/${logbookId}/status`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update status logbook: ${error.message}`);
                });
        },
        updateStatusLogbookKoor: (logbookId: number, status: string) => {
            const headers = config();
            headers.append("Content-Type", "application/json");

            const requestConfig = {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify({ status }),
            };

            return fetch(`${baseUrl}/kp/koor-kp/logbook/${logbookId}/status`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update status logbook: ${error.message}`);
                });
        },
        getPendingLogbookDosen: (page: number, limit: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}/kp/dosen/logbook/mahasiswa/pending?page=${page}&limit=${limit}`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get pending logbook: ${error.message}`);
                });
        },
        getDosenList: (page: number, limit: number, search: string, periode_id?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            let url = `${baseUrl}/kp/koor-kp/logbook/dosen?page=${page}&limit=${limit}&search=${search}`;
            if (periode_id) url += `&periode_id=${periode_id}`;
            if (prodi_id) url += `&prodi_id=${prodi_id}`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get dosbim list: ${error.message}`);
                });
        },
        getMahasiswaByDosen: (dosenId: number, page: number, limit: number, periode_id?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            let url = `${baseUrl}/kp/koor-kp/logbook/dosen/${dosenId}/mahasiswa?page=${page}&limit=${limit}`;
            if (periode_id) url += `&periode_id=${periode_id}`;
            if (prodi_id) url += `&prodi_id=${prodi_id}`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get mahasiswa by dosbim: ${error.message}`);
                });
        },
        // Endpoint baru untuk tab "Mahasiswa Bimbingan" di dosen — semua status KP
        // (pending/accepted/rejected) di periode aktif, plus tanggal_bimbingan_terakhir.
        getMahasiswaBimbinganDosen: (page: number, limit: number, search: string) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            const url = `${baseUrl}/kp/dosen/bimbingan?limit=${limit}&search=${search}&page=${page}`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get bimbingan: ${error.message}`);
                });
        },
    }
}

export default Logbook;