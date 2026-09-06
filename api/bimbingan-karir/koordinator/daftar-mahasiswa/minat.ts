/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const MinatMhs = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const daftarMinat = "/bk/minat";

  return {
    getMinat: (prodiId?: number | null) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      return fetch(addProdiToUrl(`${baseUrl}${daftarMinat}`, prodiId),
        requestConfig
      )
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error get all minat mahasiswa: ${error.message}`);
        });
    },

    createMinatMahasiswa: (data: FormData) => {
      const headers = config();
      
      if (headers.has("Content-Type")) {
          headers.delete("Content-Type");
      }
      const requestConfig = {
          method: "POST",
          body: data,
          headers,
      };
      return fetch(`${baseUrl}${daftarMinat}`, 
          requestConfig
      )
          .then((response) => response.json())
          .catch((error) => {
          throw new Error(`Error create minat mahasiswa: ${error.message}`);
      });
    },

    updateMinatMahasiswa: (data: any, id:number) => {
      const headers = config();

      const requestConfig = {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      };
      
      return fetch(`${baseUrl}${daftarMinat}/${id}`, 
          requestConfig
      )
          .then((response) => response.json())
          .catch((error) => {
          throw new Error(`Error update minat mahasiswa: ${error.message}`);
      });
    },

    deleteMinatMahasiswa: (id:number) => {
        const headers = config();
        const requestConfig = {
          method: "DELETE",
          headers: headers,
        };

        return fetch(`${baseUrl}${daftarMinat}/${id}`, 
            requestConfig
        )
            .then((response) => response.json())
            .catch((error) => {
            throw new Error(`Error delete minat mahasiswa: ${error.message}`);
        });
    },
  };
};

export default MinatMhs;