/* eslint-disable @typescript-eslint/no-explicit-any */
const AturanNilai = ({
    baseUrl,
    config,
  }: {
    baseUrl: string;
    config: () => Headers;
  }) => {
    const aturannilai = "/bk/aturan-nilai";
  
    return {
      getAturanNilai: () => {
        const headers = config();
        const requestConfig = {
          method: "GET",
          headers: headers,
        };
  
        return fetch(`${baseUrl}${aturannilai}`,
          requestConfig
        )
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error get aturan nilai: ${error.message}`);
          });
      },

      updateAturanNilai: (data: any, label: string) => {
        const headers = config();
  
        const requestConfig = {
          method: "PUT",
          body: JSON.stringify(data),
          headers: headers,
        };
  
        return fetch(`${baseUrl}${aturannilai}/${label}`, 
            requestConfig
        )
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(`Error update aturan nilai: ${error.message}`);
          });
      },
  

  };
};

export default AturanNilai;