/* eslint-disable @typescript-eslint/no-explicit-any */
import { addProdiToUrl } from "../../helpers/prodiFetcher";

const MinatConfig = ({
    baseUrl,
    config,
}: {
    baseUrl: string;
    config: () => Headers;
}) => {
    const MinatPath = "/bk/minat";

    return {
        getAll: (prodiId?: number | null) => {
            const headers = config();
            return fetch(addProdiToUrl(`${baseUrl}${MinatPath}`, prodiId), {
                method: "GET",
                headers,
            }).then((res) => res.json());
        },

        store: (data: { nama_minat: string }) => {
            const headers = config();
            headers.set("Content-Type", "application/json");
            return fetch(addProdiToUrl(`${baseUrl}${MinatPath}`), {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            }).then((res) => res.json());
        },

        update: (id: number, data: { nama_minat: string }) => {
            const headers = config();
            headers.set("Content-Type", "application/json");
            return fetch(addProdiToUrl(`${baseUrl}${MinatPath}/${id}`), {
                method: "PUT",
                headers,
                body: JSON.stringify(data),
            }).then((res) => res.json());
        },

        destroy: (id: number) => {
            const headers = config();
            return fetch(addProdiToUrl(`${baseUrl}${MinatPath}/${id}`), {
                method: "DELETE",
                headers,
            }).then((res) => res.json());
        },
    };
};

export default MinatConfig;