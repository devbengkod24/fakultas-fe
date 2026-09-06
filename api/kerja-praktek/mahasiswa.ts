import { SortConfig } from "@/types/kerja-praktek/sortconfig";

const Mahasiswa = ({
    baseUrl,
    config,
} : {
    baseUrl: string;
    config: (options?: {
        accept?: string;
        isFileUpload?: boolean;
    }) => Headers;
}) => {
    const mahasiswa = "/kp/koor-kp/mahasiswa";

    return {
        getAllMahasiswa: (page: number, limit: number, search: string, periode_id?: number, sort?: SortConfig, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${mahasiswa}?limit=${limit}&search=${search}&page=${page}`;

            // Tambahkan periode_id ke URL hanya jika nilainya disediakan dan bukan 0
            if (periode_id !== undefined && periode_id !== null && periode_id !== 0) {
                url += `&periode_id=${periode_id}`;
            }

            // Tambahkan prodi_id ke URL jika disediakan
            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                url += `&prodi_id=${prodi_id}`;
            }

            if (sort) {
                if (sort.nim) {
                    url += `&sort[nim]=${sort.nim}`;
                }
                if (sort.name) {
                    url += `&sort[name]=${sort.name}`;
                }
                if (sort.pembimbing !== undefined) {
                    url += `&sort[pembimbing]=${sort.pembimbing}`;
                }
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all dosen: ${error.message}`);
                });
        },
        getAllMahasiswaAll: (page: number, limit: number, search: string, periode_id?: string) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            let url = `${baseUrl}${mahasiswa}/all?limit=${limit}&search=${search}&page=${page}`;
            if (periode_id) {
                url += `&periode_id=${periode_id}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all mahasiswa: ${error.message}`);
                });
        },
        updateDospem: (projectIds: (string | number)[], dosenId: string | number | null, isKonversi: boolean) => {
            const headers = config();

            const requestBody = {
                project_ids: projectIds,
                dosen_id: dosenId,
                is_konversi: isKonversi
            };

            const requestConfig = {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify(requestBody)
            };

            return fetch(`${baseUrl}${mahasiswa}/update-dosen-pembimbing`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error updating dospem: ${error.message}`);
                });
        },
        getDetailMahasiswa: (id: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}${mahasiswa}/${id}/detail`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get detail mahasiswa: ${error.message}`);
                });
        },
        getAvailableStudentsForPlot: (dosenId: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}${mahasiswa}/available-for-plot?dosen_id=${dosenId}`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get available students: ${error.message}`);
                });
        },
        plotStudents: (dosenId: number, studentIds: number[]) => {
            const headers = config();

            const requestBody = {
                dosen_id: dosenId,
                student_ids: studentIds
            };

            const requestConfig = {
                method: "POST",
                body: JSON.stringify(requestBody),
                headers: headers,
            };

            return fetch(`${baseUrl}${mahasiswa}/plot-students`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error plotting students: ${error.message}`);
                });
        },
        getRiwayatDospem: (mahasiswaId: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}${mahasiswa}/${mahasiswaId}/riwayat-dospem`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error fetching riwayat dospem: ${error.message}`);
                });
        },
        downloadTemplate: async () => {
            const headers = config();
            headers.set("Accept", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            const response = await fetch(`${baseUrl}${mahasiswa}/template`, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                throw new Error("Gagal mengunduh template mahasiswa");
            }

            return response.blob();
        },
        downloadExcel: async () => {
            const headers = config({
                accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const response = await fetch(`${baseUrl}${mahasiswa}/data/download-excel`, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                throw new Error("Gagal mengunduh data mahasiswa");
            }

            return response.blob();
        },
        importMahasiswa: async (file: File, periodeId?: number, prodiId?: number) => {
            const formData = new FormData();
            formData.append("file", file);

            if (periodeId) {
                formData.append("periode_id", String(periodeId));
            }

            if (prodiId) {
                formData.append("prodi_id", String(prodiId));
            }

            const headers = config({ isFileUpload: true });
            const response = await fetch(`${baseUrl}${mahasiswa}/import`, {
                method: "POST",
                headers,
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message ?? "Gagal mengimpor mahasiswa");
            }

            return result;
        },
    }
}

export default Mahasiswa;