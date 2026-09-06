import { PengajuanForm } from "@/types/kerja-praktek/pengajuan";

const Pengajuan = ({
    baseUrl,
    config,
} : {
    baseUrl: string;
    config: () => Headers;
}) => {
    const pengajuan = "/kp/koor-kp/daftar-pending-pengajuan";

    return {
        getAllPengajuan: (page?: number, limit?: number, search?: string, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}${pengajuan}?page=${page}&limit=${limit}&search=${search}`;

            // Tambahkan prodi_id ke URL jika disediakan
            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                url += `&prodi_id=${prodi_id}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all dosen: ${error.message}`);
                });
        },
        acceptPengajuanKoor: (id: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                headers: headers,
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}${pengajuan}/${id}/accept`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error accept pengajuan: ${error.message}`);
                });
        },
        rejectPengajuanKoor: (id: number, alasan: string) => {
            // 👈 Validate inputs before making API call
            if (!id || id <= 0) {
                throw new Error("ID pengajuan tidak valid");
            }
            
            if (!alasan || typeof alasan !== 'string') {
                throw new Error("Alasan penolakan harus berupa string yang valid");
            }
            
            const trimmedAlasan = alasan.trim();
            if (trimmedAlasan.length === 0) {
                throw new Error("Alasan penolakan tidak boleh kosong");
            }
            
            if (trimmedAlasan.length < 10) {
                throw new Error("Alasan penolakan minimal 10 karakter");
            }

            const headers = config();
            headers.append("Content-Type", "application/json");

            const requestConfig = {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify({ 
                    alasan: trimmedAlasan // 👈 Ensure we send trimmed string
                }),
            };

            // 👈 Log the request for debugging
            console.log("Reject API Call:", {
                url: `${baseUrl}/kp/koor-kp/tolak-pengajuan/${id}`,
                body: { alasan: trimmedAlasan },
                headers: Object.fromEntries(headers.entries())
            });

            return fetch(`${baseUrl}${pengajuan}/${id}/reject`, requestConfig)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .catch((error) => {
                    console.error("Reject pengajuan error:", error);
                    throw new Error(`Error reject pengajuan: ${error.message}`);
                });
        },
        getDosenList: () => {  
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}/kp/mahasiswa/pengajuan/dosen-periode`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all dosen: ${error.message}`);
                });
        },
        postPengajuan: (data: PengajuanForm) => {
            const headers = config();
            
            const requestConfig = {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers,
            };

            return fetch(`${baseUrl}/kp/mahasiswa/pengajuan`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error gagal menambahkan pengajuan: ${error.message}`);
                });
        },
        showPengajuan: () => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}/kp/mahasiswa/pengajuan/show`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error show pengajuan: ${error.message}`);
                });
        },
        updatePengajuan: (data: PengajuanForm, pengajuanId: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                body: JSON.stringify({ posisi: data.posisi }),
                headers: headers,
            };

            // Gunakan ID pengajuan, bukan dosen_id
            const url = `${baseUrl}/kp/mahasiswa/pengajuan/${pengajuanId}/update`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update pengajuan: ${error.message}`);
                });
        },
        deletePengajuan: (id: number) => {
            const headers = config();

            const requestConfig = {
                method: "DELETE",
                headers: headers,
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}/kp/mahasiswa/pengajuan/${id}/delete`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error delete pengajuan: ${error.message}`);
                });
        },
        getAllPengajuanDosen: (page?: number, limit?: number, search?: string, prodi_id?: number) => {
            const headers = config();

            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            // Buat URL query secara dinamis
            let url = `${baseUrl}/kp/dosen/pengajuan?page=${page}&limit=${limit}&search=${search}`;

            // Tambahkan prodi_id ke URL jika disediakan
            if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
                url += `&prodi_id=${prodi_id}`;
            }

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all dosen: ${error.message}`);
                });
        },
        acceptPengajuanDosen: (id: number) => {
            const headers = config();

            const requestConfig = {
                method: "PATCH",
                headers: headers,
            };

            // Buat URL query secara dinamis
            const url = `${baseUrl}/kp/dosen/pengajuan/${id}/accept`;

            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error accept pengajuan: ${error.message}`);
                });
        },
        rejectPengajuanDosen: (id: number, alasan: string) => {
            // 👈 Validate inputs before making API call
            if (!id || id <= 0) {
                throw new Error("ID pengajuan tidak valid");
            }
            
            if (!alasan || typeof alasan !== 'string') {
                throw new Error("Alasan penolakan harus berupa string yang valid");
            }
            
            const trimmedAlasan = alasan.trim();
            if (trimmedAlasan.length === 0) {
                throw new Error("Alasan penolakan tidak boleh kosong");
            }
            
            if (trimmedAlasan.length < 10) {
                throw new Error("Alasan penolakan minimal 10 karakter");
            }

            const headers = config();
            headers.append("Content-Type", "application/json");

            const requestConfig = {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify({ 
                    alasan: trimmedAlasan // 👈 Ensure we send trimmed string
                }),
            };

            return fetch(`${baseUrl}/kp/dosen/pengajuan/${id}/reject`, requestConfig)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .catch((error) => {
                    console.error("Reject pengajuan error:", error);
                    throw new Error(`Error reject pengajuan: ${error.message}`);
                });
        },
    }
}

export default Pengajuan;