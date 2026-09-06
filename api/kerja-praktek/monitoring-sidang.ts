const MonitoringSidang = ({
    baseUrl,
    config,
} : {
    baseUrl: string;
    config: () => Headers;
}) => {
    const monitoringSidang = "/kp/koor-kp/monitoring-sidang";

    return {
        getAllMonitoringSidang: (gelombang_id?: number, search?: string, page?: number, limit?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${monitoringSidang}`;

            // Buat array untuk menyimpan parameter query
            const queryParams = [];

            // Tambahkan gelombang_id ke parameter query jika valid
            if (gelombang_id !== undefined && gelombang_id !== null && gelombang_id !== 0) {
                queryParams.push(`gelombang_id=${gelombang_id}`);
            }

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

            // prodi_id tidak perlu ditambahkan ke URL karena sudah dikirim via header X-Prodi-Id di config()

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
        getDataPengajuan: (gelombang_id?: number, search?: string, page?: number, limit?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${monitoringSidang}/data-pengajuan`;

            // Buat array untuk menyimpan parameter query
            const queryParams = [];

            // Tambahkan gelombang_id ke parameter query jika valid
            if (gelombang_id !== undefined && gelombang_id !== null && gelombang_id !== 0) {
                queryParams.push(`gelombang_id=${gelombang_id}`);
            }

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

            // prodi_id tidak perlu ditambahkan ke URL karena sudah dikirim via header X-Prodi-Id di config()

            // Tambahkan parameter query ke URL jika ada
            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get Data Pengajuan: ${error.message}`);
                });
        },
        /**
         * Endpoint khusus dosen untuk halaman "Data Pengajuan" sidang KP.
         * Di-scope otomatis ke dosen yang sedang login (backend filter via
         * pembimbing_id / penguji_id / penguji_2_id / penguji_3_id).
         * BE: GET /kp/dosen/sidang/data-pengajuan
         */
        getDataPengajuanDosen: (gelombang_id?: number, search?: string, page?: number, limit?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            let url = `${baseUrl}/kp/dosen/sidang/data-pengajuan`;

            const queryParams: string[] = [];

            if (gelombang_id !== undefined && gelombang_id !== null && gelombang_id !== 0) {
                queryParams.push(`gelombang_id=${gelombang_id}`);
            }

            if (search !== undefined && search !== null && search !== '') {
                queryParams.push(`search=${encodeURIComponent(search)}`);
            }

            if (page !== undefined && page !== null) {
                queryParams.push(`page=${page}`);
            }

            if (limit !== undefined && limit !== null) {
                queryParams.push(`limit=${limit}`);
            }

            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get Data Pengajuan Dosen: ${error.message}`);
                });
        },
        downloadPDF: (id: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}${monitoringSidang}/${id}/download-pdf`;

            return fetch(url, requestConfig)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    // Kembalikan sebagai blob karena response adalah file PDF
                    return response.blob();
                })
                .catch((error) => {
                    throw new Error(`Error Download PDF: ${error.message}`);
                });
        },
        downloadAllPDF: (gelombang_id?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL dengan parameter gelombang_id opsional
            let url = `${baseUrl}${monitoringSidang}/download-all-pdf`;
            const queryParams = [];

            if (gelombang_id !== undefined && gelombang_id !== null && gelombang_id !== 0) {
                queryParams.push(`gelombang_id=${gelombang_id}`);
            }

            // prodi_id tidak perlu ditambahkan ke URL karena sudah dikirim via header X-Prodi-Id di config()

            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            console.log('[downloadAllPDF] Request URL:', url);

            return fetch(url, requestConfig)
                .then(async (response) => {
                    console.log('[downloadAllPDF] Response status:', response.status);
                    console.log('[downloadAllPDF] Response headers:', Object.fromEntries(response.headers.entries()));

                    if (!response.ok) {
                        // Try to parse error message from backend
                        const contentType = response.headers.get("content-type");
                        if (contentType && contentType.includes("application/json")) {
                            try {
                                const errorData = await response.json();
                                console.error('[downloadAllPDF] Error response:', errorData);
                                const errorMessage = errorData.errors || errorData.message || `HTTP error! status: ${response.status}`;
                                throw new Error(errorMessage);
                            } catch (parseError: any) {
                                if (parseError.message && !parseError.message.includes('JSON')) {
                                    throw parseError;
                                }
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                        } else {
                            const textResponse = await response.text();
                            console.error('[downloadAllPDF] Non-JSON error response:', textResponse);
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                    }
                    return response.blob();
                });
        },
        downloadExcel: (gelombang_id?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL dengan parameter gelombang_id opsional
            let url = `${baseUrl}${monitoringSidang}/download-excel`;
            const queryParams = [];

            if (gelombang_id !== undefined && gelombang_id !== null && gelombang_id !== 0) {
                queryParams.push(`gelombang_id=${gelombang_id}`);
            }

            // prodi_id tidak perlu ditambahkan ke URL karena sudah dikirim via header X-Prodi-Id di config()

            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            return fetch(url, requestConfig)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.blob();
                })
                .catch((error) => {
                    throw new Error(`Error Download Excel: ${error.message}`);
                });
        },
        updateNilaiPenyelia: (id: number, nilai_penyelia: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                body: JSON.stringify({ nilai_penyelia }),
                headers: headers,
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}${monitoringSidang}/${id}/nilai-penyelia`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update nilai penyelia: ${error.message}`);
                });
        },
        updateNilaiPembimbing: (id: number, nilai_pembimbing: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                body: JSON.stringify({ nilai_pembimbing }),
                headers: headers,
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}${monitoringSidang}/${id}/nilai-pembimbing`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update nilai pembimbing: ${error.message}`);
                });
        },
        updateNilaiPenguji1: (id: number, nilai_penguji_1: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                body: JSON.stringify({ nilai_penguji_1 }),
                headers: headers,
            };

            const url = `${baseUrl}${monitoringSidang}/${id}/nilai-penguji-1`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update nilai penguji 1: ${error.message}`);
                });
        },
        updateNilaiPenguji2: (id: number, nilai_penguji_2: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                body: JSON.stringify({ nilai_penguji_2 }),
                headers: headers,
            };

            const url = `${baseUrl}${monitoringSidang}/${id}/nilai-penguji-2`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update nilai penguji 2: ${error.message}`);
                });
        },
        updateNilaiPenguji3: (id: number, nilai_penguji_3: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                body: JSON.stringify({ nilai_penguji_3 }),
                headers: headers,
            };

            const url = `${baseUrl}${monitoringSidang}/${id}/nilai-penguji-3`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update nilai penguji 3: ${error.message}`);
                });
        },
        getTtdKoor: () => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}${monitoringSidang}/ttd-koor`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get TTD koor: ${error.message}`);
                });
        },
        storeTtdKoor: (ttd_koor: File) => {
            const headers = config();

            // Untuk upload file, kita perlu menggunakan FormData
            const formData = new FormData();
            formData.append('ttd_koor', ttd_koor);

            // Jangan set Content-Type header karena browser akan
            // otomatis mengatur dengan boundary yang tepat untuk FormData
            headers.delete('Content-Type');

            const requestConfig = {
                method: "POST",
                body: formData,
                headers: headers,
            };

            const url = `${baseUrl}${monitoringSidang}/ttd-koor`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error store TTD koor: ${error.message}`);
                });
        },
        getAllMonitoringSidangDosen: (gelombang_id?: number, search?: string, page?: number, limit?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}/kp/dosen/sidang`;

            // Buat array untuk menyimpan parameter query
            const queryParams = [];

            // Tambahkan gelombang_id ke parameter query jika valid
            if (gelombang_id !== undefined && gelombang_id !== null && gelombang_id !== 0) {
                queryParams.push(`gelombang_id=${gelombang_id}`);
            }

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

            // prodi_id tidak perlu ditambahkan ke URL karena sudah dikirim via header X-Prodi-Id di config()

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
        getTtdDosen: () => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}/kp/dosen/sidang/ttd`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get TTD dosen: ${error.message}`);
                });
        },
        storeTtdDosen: (ttd: File) => {
            const headers = config();

            // Untuk upload file, kita perlu menggunakan FormData
            const formData = new FormData();
            formData.append('ttd', ttd);

            // Jangan set Content-Type header karena browser akan
            // otomatis mengatur dengan boundary yang tepat untuk FormData
            headers.delete('Content-Type');

            const requestConfig = {
                method: "POST",
                body: formData,
                headers: headers,
            };

            const url = `${baseUrl}/kp/dosen/sidang/ttd`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error store TTD dosen: ${error.message}`);
                });
        },
        updateNilaiDosen: (id: number, peran: "pembimbing" | "penguji_1" | "penguji_2" | "penguji_3", nilai: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                body: JSON.stringify({ peran, nilai }),
                headers: headers,
            };

            // Backend menentukan kolom DB mana yang di-update dari `peran`.
            // BE akan reject 403 jika dosen tidak memegang peran tsb di sidang ini.
            const url = `${baseUrl}/kp/dosen/sidang/${id}/nilai-sidang`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update nilai via dosen: ${error.message}`);
                });
        },
        /**
         * Mode 1 & 2: Download undangan personal per-penguji (DOCX).
         * - dosenId undefined → semua penguji di gelombang tsb
         * - dosenId specified → hanya penguji tsb
         */
        downloadUndanganPersonal: (gelombang_id: number, kode_undangan: string, tgl_undangan: string, dosen_id?: number, prodi_id?: number) => {
            const headers = config();
            const requestConfig = { method: "GET" as const, headers: headers };

            const params = new URLSearchParams({
                gelombang_id: gelombang_id.toString(),
                kode_undangan: kode_undangan,
                tgl_undangan: tgl_undangan,
            });
            if (dosen_id !== undefined && dosen_id !== null) {
                params.append("dosen_id", dosen_id.toString());
            }
            // prodi_id dikirim via header X-Prodi-Id di config()

            const url = `${baseUrl}/kp/koor-kp/plot-jadwal-sidang/download-undangan/personal?${params.toString()}`;

            return fetch(url, requestConfig)
                .then(async (response) => {
                    if (!response.ok) {
                        const text = await response.text();
                        try {
                            const json = JSON.parse(text);
                            throw new Error(json.message || `HTTP error! status: ${response.status}`);
                        } catch {
                            throw new Error(text || `HTTP error! status: ${response.status}`);
                        }
                    }
                    return response.blob();
                })
                .catch((error) => {
                    throw new Error(error.message || "Error Download Undangan Personal");
                });
        },

        /**
         * Mode 3: Download undangan per-sesi, grouped by (tgl, jam, ruangan) (PDF).
         */
        downloadUndanganSesi: (gelombang_id: number, kode_undangan: string, tgl_undangan: string, prodi_id?: number) => {
            const headers = config();
            const requestConfig = { method: "GET" as const, headers: headers };

            const params = new URLSearchParams({
                gelombang_id: gelombang_id.toString(),
                kode_undangan: kode_undangan,
                tgl_undangan: tgl_undangan,
            });

            const url = `${baseUrl}/kp/koor-kp/plot-jadwal-sidang/download-undangan/sesi?${params.toString()}`;

            return fetch(url, requestConfig)
                .then(async (response) => {
                    if (!response.ok) {
                        const text = await response.text();
                        try {
                            const json = JSON.parse(text);
                            throw new Error(json.message || `HTTP error! status: ${response.status}`);
                        } catch {
                            throw new Error(text || `HTTP error! status: ${response.status}`);
                        }
                    }
                    return response.blob();
                })
                .catch((error) => {
                    throw new Error(error.message || "Error Download Undangan Sesi");
                });
        },
    }
}

export default MonitoringSidang;
