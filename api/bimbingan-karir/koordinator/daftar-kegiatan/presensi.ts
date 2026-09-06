/* eslint-disable @typescript-eslint/no-explicit any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const Presensi = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const presensi = "/bk/presensi";

    return {
        createPresensiUpdate: (user_id: number, kegiatan_id:number) => {
            const headers = config();

            const requestConfig = {
              method: "POST",
              headers: headers,
            };

            return fetch(addProdiToUrl(`${baseUrl}${presensi}/update?user_id=${user_id}&kegiatan_id=${kegiatan_id}`),
            requestConfig
            )
            .then((response) => response.json())
            .catch((error) => {
                throw new Error(`Error get update presensi mahasiswa: ${error.message}`);
            });
        },

        createPresensiQROpen: (kegiatan_id:number) => {
            const headers = config();

            const requestConfig = {
              method: "POST",
              headers: headers,
            };

            return fetch(addProdiToUrl(`${baseUrl}${presensi}/open?kegiatan_id=${kegiatan_id}`),
            requestConfig
            )
            .then((response) => response.json())
            .catch((error) => {
                throw new Error(`Error open qr code: ${error.message}`);
            });
        },

        createPresensiQRClose: (temp_code_id:number) => {
            const headers = config();

            const requestConfig = {
              method: "POST",
              headers: headers,
            };

            return fetch(addProdiToUrl(`${baseUrl}${presensi}/close?temp_code_id=${temp_code_id}`),
            requestConfig
            )
            .then((response) => response.json())
            .catch((error) => {
                throw new Error(`Error close qr code: ${error.message}`);
            });
        },

        getMahasiswaPresensi: (detail:string, page: any, limit: any, search: any, kegiatan_id:number) => {
          const headers = config();
          const requestConfig = {
            method: "GET",
            headers: headers,
          };

          return fetch(addProdiToUrl(`${baseUrl}${presensi}/${detail}?page=${page}&limit=${limit}&search=${search}&kegiatan_id=${kegiatan_id}`),
          requestConfig
          )
          .then((response) => response.json())
          .catch((error) => {
              throw new Error(`Error get all mahasiswa: ${error.message}`);
          });
        },

        createPresensiCancel: (user_id: number, kegiatan_id:number) => {
          const headers = config();

          const requestConfig = {
            method: "POST",
            headers: headers,
          };

          return fetch(addProdiToUrl(`${baseUrl}${presensi}/cancel?user_id=${user_id}&kegiatan_id=${kegiatan_id}`),
          requestConfig
          )
          .then((response) => response.json())
          .catch((error) => {
              throw new Error(`Error cancel presensi mahasiswa: ${error.message}`);
          });
        },

        createQrCodeGenerate: (data:any) => {
          const headers = config();

          const requestConfig = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
          };

          return fetch(addProdiToUrl(`${baseUrl}${presensi}/qrcode`),
          requestConfig
          )
          .then((response) => response.json())
          .catch((error) => {
              throw new Error(`Error generate QR code: ${error.message}`);
          });
        },

        getMahasiswaIzin: (kegiatan_id:number) => {
          const headers = config();
          const requestConfig = {
            method: "GET",
            headers: headers,
          };

          return fetch(addProdiToUrl(`${baseUrl}/bk/izin-presensi/?kegiatan_id=${kegiatan_id}`),
          requestConfig
          )
          .then((response) => response.json())
          .catch((error) => {
              throw new Error(`Error get all mahasiswa: ${error.message}`);
          });
        },

        createMahasiswaIzin: (data: FormData) => {
          const headers = config();

          if (headers.has("Content-Type")) {
              headers.delete("Content-Type");
          }
          const requestConfig = {
              method: "POST",
              body: data,
              headers,
          };
          return fetch(addProdiToUrl(`${baseUrl}/bk/izin-presensi/terima`),
              requestConfig
          )
              .then((response) => response.json())
              .catch((error) => {
              throw new Error(`Error create izin presensi mahasiswa: ${error.message}`);
          });
        },

        createMahasiswaIzinTolak: (data: FormData) => {
          const headers = config();

          if (headers.has("Content-Type")) {
              headers.delete("Content-Type");
          }
          const requestConfig = {
              method: "POST",
              body: data,
              headers,
          };
          return fetch(addProdiToUrl(`${baseUrl}/bk/izin-presensi/tolak`),
              requestConfig
          )
              .then((response) => response.json())
              .catch((error) => {
              throw new Error(`Error create tolak izin presensi mahasiswa: ${error.message}`);
          });
        },

        createImportPresensi: (data: FormData) => {
            const headers = config();

            if (headers.has("Content-Type")) {
                headers.delete("Content-Type");
            }

            const requestConfig = {
                method: "POST",
                body: data,
                headers,
            };

            return fetch(addProdiToUrl(`${baseUrl}/bk/import-presensi`),
                requestConfig
            )
                .then((response) => response.json())
                .catch((error) => {
                throw new Error(`Error in import presensi: ${error.message}`);
            });
        },

        createAllMahasiswaIzin: (data: FormData) => {
          const headers = config();

          if (headers.has("Content-Type")) {
              headers.delete("Content-Type");
          }
          const requestConfig = {
              method: "POST",
              body: data,
              headers,
          };
          return fetch(addProdiToUrl(`${baseUrl}/bk/izin-presensi/terima-semua`),
              requestConfig
          )
              .then((response) => response.json())
              .catch((error) => {
              throw new Error(`Error create izin all presensi mahasiswa: ${error.message}`);
          });
        },
      getExportPresensiMahasiswa: (kegiatan_id: number) => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };

        return fetch(addProdiToUrl(`${baseUrl}${presensi}/export?kegiatan_id=${kegiatan_id}`),
          requestConfig
        )
          .then((response) => response.blob())
          .catch((error) => {
            throw new Error(`Error export presensi mahasiswa: ${error.message}`);
          });
      },
   };
};

export default Presensi;