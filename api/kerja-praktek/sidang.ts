import { PengajuanSidangForm } from "@/types/kerja-praktek/sidang";

const Sidang = ({
    baseUrl,
    config,
} : {
    baseUrl: string;
    config: () => Headers;
}) => {
    const sidang = "/kp/mahasiswa/pengajuan-sidang";

    return {
        getPengajuanSidang: () => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}${sidang}`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get pengajuan sidang: ${error.message}`);
                });
        },
        addPengajuanSidang: (data: PengajuanSidangForm) => {
            const headers = config();
            headers.append("Content-Type", "application/json");

            const requestConfig = {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data),
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}${sidang}`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error add pengajuan sidang: ${error.message}`);
            });
        },
        deletePengajuanSidang: () => {
            const headers = config();

            const requestConfig = {
                method: "DELETE",
                headers: headers,
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}${sidang}/delete`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error delete pengajuan sidang: ${error.message}`);
            });
        },
        updatePengajuanSidang: (data: PengajuanSidangForm) => {
            const headers = config();
            headers.append("Content-Type", "application/json");

            const requestConfig = {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify(data),
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}${sidang}/update`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update pengajuan sidang: ${error.message}`);
            });
        },
    }
}

export default Sidang;