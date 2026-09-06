const LogActivity = ({
    baseUrl,
    config,
} : {
    baseUrl: string;
    config: () => Headers;
}) => {
    const logActivity = "/kp/koor-kp/activity";

    return {
        getAllLogActivityKoordinator: (search?: string, page?: string, limit?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${logActivity}`;

            // Buat array untuk menyimpan parameter query
            const queryParams = [];

            // Tambahkan search ke parameter query jika ada
            if (search !== undefined && search !== null && search !== '') {
                queryParams.push(`search=${encodeURIComponent(search)}`);
            }

            // Tambahkan page dan limit ke parameter query jika ada
            if (page !== undefined && page !== null) {
                queryParams.push(`page=${page}`);
            }

            if (limit !== undefined && limit !== null) {
                queryParams.push(`limit=${limit}`);
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
                    throw new Error(`Error get all Monitoring Sidang: ${error.message}`);
                });
        },
        getLogPengajuanKoordinator: (search?: string, page?: string, limit?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${logActivity}/pengajuan`;

            // Buat array untuk menyimpan parameter query
            const queryParams = [];

            // Tambahkan search ke parameter query jika ada
            if (search !== undefined && search !== null && search !== '') {
                queryParams.push(`search=${encodeURIComponent(search)}`);
            }

            // Tambahkan page dan limit ke parameter query jika ada
            if (page !== undefined && page !== null) {
                queryParams.push(`page=${page}`);
            }

            if (limit !== undefined && limit !== null) {
                queryParams.push(`limit=${limit}`);
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
                    throw new Error(`Error get log pengajuan: ${error.message}`);
                });
        },
        getLogLogbookKoordinator: (search?: string, page?: string, limit?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${logActivity}/logbook`;

            // Buat array untuk menyimpan parameter query
            const queryParams = [];

            // Tambahkan search ke parameter query jika ada
            if (search !== undefined && search !== null && search !== '') {
                queryParams.push(`search=${encodeURIComponent(search)}`);
            }

            // Tambahkan page dan limit ke parameter query jika ada
            if (page !== undefined && page !== null) {
                queryParams.push(`page=${page}`);
            }

            if (limit !== undefined && limit !== null) {
                queryParams.push(`limit=${limit}`);
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
                    throw new Error(`Error get log logbook: ${error.message}`);
                });
        },
        getLogPengajuanSidangKoordinator: (search?: string, page?: string, limit?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${logActivity}/pengajuan-sidang`;

            // Buat array untuk menyimpan parameter query
            const queryParams = [];

            // Tambahkan search ke parameter query jika ada
            if (search !== undefined && search !== null && search !== '') {
                queryParams.push(`search=${encodeURIComponent(search)}`);
            }

            // Tambahkan page dan limit ke parameter query jika ada
            if (page !== undefined && page !== null) {
                queryParams.push(`page=${page}`);
            }

            if (limit !== undefined && limit !== null) {
                queryParams.push(`limit=${limit}`);
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
                    throw new Error(`Error get log pengajuan sidang: ${error.message}`);
                });
        },
        getLogSidangKoordinator: (search?: string, page?: string, limit?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${logActivity}/sidang`;

            // Buat array untuk menyimpan parameter query
            const queryParams = [];

            // Tambahkan search ke parameter query jika ada
            if (search !== undefined && search !== null && search !== '') {
                queryParams.push(`search=${encodeURIComponent(search)}`);
            }

            // Tambahkan page dan limit ke parameter query jika ada
            if (page !== undefined && page !== null) {
                queryParams.push(`page=${page}`);
            }

            if (limit !== undefined && limit !== null) {
                queryParams.push(`limit=${limit}`);
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
                    throw new Error(`Error get log sidang: ${error.message}`);
                });
        },
        getAllLogActivityDosen: (search?: string, page?: string, limit?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}/kp/dosen/activity`;
            
            // Buat array untuk menyimpan parameter query
            const queryParams = [];
            
            // Tambahkan search ke parameter query jika ada
            if (search !== undefined && search !== null && search !== '') {
                queryParams.push(`search=${encodeURIComponent(search)}`);
            }
            
            // Tambahkan page dan limit ke parameter query jika ada
            if (page !== undefined && page !== null) {
                queryParams.push(`page=${page}`);
            }
            
            if (limit !== undefined && limit !== null) {
                queryParams.push(`limit=${limit}`);
            }
            
            // Tambahkan parameter query ke URL jika ada
            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }
            
            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all Monitoring Sidang: ${error.message}`);
                });
        },
        getAllPengajuanDosen: (search?: string, page?: string, limit?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}/kp/dosen/activity/pengajuan`;

            // Buat array untuk menyimpan parameter query
            const queryParams = [];

            // Tambahkan search ke parameter query jika ada
            if (search !== undefined && search !== null && search !== '') {
                queryParams.push(`search=${encodeURIComponent(search)}`);
            }

            // Tambahkan page dan limit ke parameter query jika ada
            if (page !== undefined && page !== null) {
                queryParams.push(`page=${page}`);
            }

            if (limit !== undefined && limit !== null) {
                queryParams.push(`limit=${limit}`);
            }

            // Tambahkan parameter query ke URL jika ada
            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get log pengajuan: ${error.message}`);
                });
        },
        getAllLogbookDosen: (search?: string, page?: string, limit?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}/kp/dosen/activity/logbook`;

            // Buat array untuk menyimpan parameter query
            const queryParams = [];

            // Tambahkan search ke parameter query jika ada
            if (search !== undefined && search !== null && search !== '') {
                queryParams.push(`search=${encodeURIComponent(search)}`);
            }

            // Tambahkan page dan limit ke parameter query jika ada
            if (page !== undefined && page !== null) {
                queryParams.push(`page=${page}`);
            }

            if (limit !== undefined && limit !== null) {
                queryParams.push(`limit=${limit}`);
            }

            // Tambahkan parameter query ke URL jika ada
            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get log logbook: ${error.message}`);
                });
        }
    }
}

export default LogActivity;