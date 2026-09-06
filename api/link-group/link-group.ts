/* eslint-disable @typescript-eslint/no-explicit-any */
const LinkGroup = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const link = "/link-group";
  const linkKoor = "/link-group-koor";

  return {
    getLinkGlobal: (type: any, prodi_id?: number) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      // TA / KP / BK / ALUMNI
      let url = `${baseUrl}${link}/active-koor?type=${type}`;

      // Tambahkan prodi_id ke URL jika disediakan
      if (prodi_id !== undefined && prodi_id !== null && prodi_id !== 0) {
        url += `&prodi_id=${prodi_id}`;
      }

      return fetch(url, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error fetching link: ${error.message}`);
        });
    },

    createLinkGlobal: (data: any) => {
      const headers = config();

      const requestConfig = {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      };

      return fetch(`${baseUrl}${linkKoor}`, requestConfig)
        .then((response) => response.json())
        .catch((error) => {
          throw new Error(`Error in add link: ${error.message}`);
        });
    },
  };
};

export default LinkGroup;
