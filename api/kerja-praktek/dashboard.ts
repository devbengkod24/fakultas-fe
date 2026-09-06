const Dashboard = ({
    baseUrl,
    config,
}: {
    baseUrl: string;
    config: () => Headers;
}) => {
    const dashboard = "/kp/koor-kp/";

    return {
        getDashboardKoordinator: (prodi_id?: number) => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            let url = `${baseUrl}${dashboard}`;
            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                url += `?prodi_id=${prodi_id}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get dashboard: ${error.message}`);
                });
        },
        getKoorPengajuan: (type?: string, prodi_id?: number) => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            let url = `${baseUrl}${dashboard}daftar-pending-pengajuan`;
            if (type === 'sidang') {
                url = `${baseUrl}${dashboard}monitoring-sidang`;
            }

            // Tambahkan prodi_id ke URL jika disediakan
            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                url += `?prodi_id=${prodi_id}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get koor pengajuan: ${error.message}`);
                });
        },
        getLogbookMahasiswaStats: (prodi_id?: number) => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            let url = `${baseUrl}/kp/koor-kp/logbook`;
            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                url += `?prodi_id=${prodi_id}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get logbook mahasiswa stats: ${error.message}`);
                });
        },
        getDashboardMahasiswa: () => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}/kp/mahasiswa`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get dashboard mahasiswa: ${error.message}`);
                });
        },
        getDashboardDosen: () => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}/kp/dosen`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get dashboard dosen: ${error.message}`);
                });
        },
        getLinkWaDosen: () => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}/kp/dosen/link-wa`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get link WA dosen: ${error.message}`);
                });
        },

        /**
         * Ambil link_wa dosen pembimbing KP untuk mahasiswa yang sedang login.
         * Endpoint: GET /api/v1/kp/mahasiswa/dosen-link-wa
         * Sumber data: dosen_periode.link_wa (via KP project → dosen_id)
         * Return: { success, message, data: string|null }
         */
        getDosenLinkWa: () => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}/kp/mahasiswa/dosen-link-wa`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(
                        `Error get dosen link wa (mahasiswa): ${error.message}`,
                    );
                });
        },
        updateLinkWaDosen: (data: { link_wa: string }) => {
            const headers = config();
            const requestConfig = {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data),
            };

            return fetch(`${baseUrl}/kp/dosen/link-wa`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update link WA dosen: ${error.message}`);
                });
        },
        getKuotaSummary: (periode_id?: number, prodi_id?: number) => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            let url = `${baseUrl}/kp/koor-kp/dosen/kuota-summary`;
            const params = new URLSearchParams();

            if (periode_id !== undefined && periode_id !== null && periode_id !== 0) {
                params.append('periode_id', String(periode_id));
            }

            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                params.append('prodi_id', String(prodi_id));
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get kuota summary: ${error.message}`);
                });
        },
    }
}

export default Dashboard;
