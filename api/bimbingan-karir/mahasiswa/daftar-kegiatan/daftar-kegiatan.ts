/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const DaftarKegiatanMahasiswa = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const daftarkegiatanmhs = "/bk/mahasiswa-kegiatan";

    return {
        getAllDaftarKegiatanMhs: (prodiId: number | null, status: string) => {
          if (prodiId === null) {
            return Promise.resolve({ success: true, data: [] });
          }

          const headers = config();
          const requestConfig = {
            method: "GET",
            headers: headers,
            };

            const url = addProdiToUrl(`${baseUrl}${daftarkegiatanmhs}?status=${status}`, prodiId);
            return fetch(url, requestConfig)
            .then((response) => response.json())
            .catch((error) => {
                throw new Error(`Error get all daftar kegiatan mahasiswa: ${error.message}`);
            });
        },
        createPresensi: (data: any) => {
          const headers = config();

          const requestConfig = {
              method: "POST",
              headers: headers,
              body: JSON.stringify(data),
          };
          const url = addProdiToUrl(`${baseUrl}${daftarkegiatanmhs}/presensi`);
          return fetch(url, requestConfig)
              .then((response) => response.json())
              .catch((error) => {
              throw new Error(`Error create presensi mahasiswa: ${error.message}`);
          });
        },
        createFeedback: (data: any) => {
          const headers = config();

          const requestConfig = {
              method: "POST",
              headers: headers,
              body: JSON.stringify(data),
          };
          const url = addProdiToUrl(`${baseUrl}/bk/feedback-mahasiswa`);
          return fetch(url, requestConfig)
              .then((response) => response.json())
              .catch((error) => {
              throw new Error(`Error create feedback mahasiswa: ${error.message}`);
          });
        },
        createIzinKegiatan: (data: FormData) => {
            const headers = config();

            if (headers.has("Content-Type")) {
                headers.delete("Content-Type");
            }
            const requestConfig = {
                method: "POST",
                body: data,
                headers,
            };
            const url = addProdiToUrl(`${baseUrl}/bk/mahasiswa-kegiatan/izin`);
            return fetch(url, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                throw new Error(`Error create izin kegiatan mahasiswa: ${error.message}`);
            });
        },
        getDaftarKegiatanMhsDetail: (id:number) => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            const url = addProdiToUrl(`${baseUrl}${daftarkegiatanmhs}/${id}`);
            return fetch(url, requestConfig)
            .then((response) => response.json())
            .catch((error) => {
                throw new Error(`Error get daftar kegiatan detail: ${error.message}`);
            });
        },
    };
  };

  export default DaftarKegiatanMahasiswa;