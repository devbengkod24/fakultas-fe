const PlottingJadwal = ({
    baseUrl,
    config,
} : {
    baseUrl: string;
    config: () => Headers;
}) => {
    const plottingJadwal = "/kp/koor-kp/plot-jadwal-sidang";

    return {
        getRuangan: () => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            const url = `${baseUrl}${plottingJadwal}/ruangan`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get ruangan: ${error.message}`);
                });
        },

        getAllPlottingJadwal: (page?: number, limit?: number, search?: string, gelombang_id?: number, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${plottingJadwal}`;

            // Buat array untuk menyimpan parameter query
            const queryParams = [];

            // Tambahkan page ke parameter query jika ada
            if (page !== undefined && page !== null) {
                queryParams.push(`page=${page}`);
            }

            // Tambahkan limit ke parameter query jika ada
            if (limit !== undefined && limit !== null) {
                queryParams.push(`limit=${limit}`);
            }

            // Tambahkan search ke parameter query jika ada
            if (search !== undefined && search !== null && search !== '') {
                queryParams.push(`search=${encodeURIComponent(search)}`);
            }

            // Tambahkan gelombang_id ke parameter query jika valid
            if (gelombang_id !== undefined && gelombang_id !== null && gelombang_id !== 0) {
                queryParams.push(`gelombang_id=${gelombang_id}`);
            }

            // prodi_id tidak perlu ditambahkan ke URL karena sudah dikirim via header X-Prodi-Id di config()

            // Tambahkan parameter query ke URL jika ada
            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all plotting jadwal: ${error.message}`);
                });
        },
        getAvailability: (id: number, month?: string) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            const url = `${baseUrl}${plottingJadwal}/dosen/${id}/availability?month=${month}`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get dosen availability: ${error.message}`);
                });
        },
        getSlot: (id: number, month?: string) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            const url = `${baseUrl}${plottingJadwal}/dosen/${id}/slots?date=${month}`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get dosen slot: ${error.message}`);
                });
        },
        /**
         * Ambil info slot harian untuk plotting (dipakai FE dropdown jam_mulai).
         * @param date dd-MM-yyyy
         * @param excludeSidangId untuk mode edit, exclude 1 sidang dari count
         */
        getSlotInfo: (date: string, excludeSidangId?: number | null) => {
            const headers = config();

            const queryParams = [`date=${encodeURIComponent(date)}`];
            if (excludeSidangId != null) {
                queryParams.push(`exclude_sidang_id=${excludeSidangId}`);
            }

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            const url = `${baseUrl}${plottingJadwal}/slot-info?${queryParams.join("&")}`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get slot info: ${error.message}`);
                });
        },
        updateJadwal: (pengajuan_sidang_id: number, tgl_sidang: string, jam_mulai: string, ruangan_id?: number | null, penguji_id?: number | null, penguji_2_id?: number | null, penguji_3_id?: number | null) => {
            const headers = config();

            const body: Record<string, any> = {
                tgl_sidang,
                jam_mulai,
            };

            if (ruangan_id) body.ruangan_id = ruangan_id;
            if (penguji_id) body.penguji_id = penguji_id;
            if (penguji_2_id) body.penguji_2_id = penguji_2_id;
            if (penguji_3_id) body.penguji_3_id = penguji_3_id;

            const requestConfig = {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify(body)
            };

            const url = `${baseUrl}${plottingJadwal}/${pengajuan_sidang_id}`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update jadwal: ${error.message}`);
                });
        },
        buatJadwalBulk: (payload: {
            gelombang_id: number;
            tgl_sidang: string; // dd-MM-yyyy
            jam_mulai: string;  // HH:mm
            ruangan_id?: number | null;
            sidang_items: Array<{
                sidang_id: number;
                urutan?: number;
                penguji_id?: number | null;
                penguji_2_id?: number | null;
                penguji_3_id?: number | null;
            }>;
        }) => {
            const headers = config();

            const requestConfig = {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload),
            };

            const url = `${baseUrl}${plottingJadwal}/bulk`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error bulk plot jadwal: ${error.message}`);
                });
        },
    }
}

export default PlottingJadwal;