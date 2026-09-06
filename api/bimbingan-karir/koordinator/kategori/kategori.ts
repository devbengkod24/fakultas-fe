export interface Kategori {
    id: number;
    kode: string;
    nama: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

import { addProdiToUrl } from "../../helpers/prodiFetcher";

const KategoriConfig = ({
    baseUrl,
    config,
}: {
    baseUrl: string;
    config: () => Headers;
}) => {
    const KategoriPath = "/bk/kategori";
    return {
        getAll: (prodiId?: number | null) => {
            const headers = config();
            return fetch(addProdiToUrl(`${baseUrl}${KategoriPath}`, prodiId), {
                method: "GET",
                headers,
            }).then((res) => res.json());
        },
        getActive: (prodiId?: number | null) => {
            const headers = config();
            return fetch(addProdiToUrl(`${baseUrl}${KategoriPath}/active`, prodiId), {
                method: "GET",
                headers,
            }).then((res) => res.json());
        },
        store: (data: { kode: string; nama: string; is_active?: boolean }) => {
            const headers = config();
            headers.set("Content-Type", "application/json");
            return fetch(addProdiToUrl(`${baseUrl}${KategoriPath}`), {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            }).then((res) => res.json());
        },
        update: (id: number, data: { kode: string; nama: string }) => {
            const headers = config();
            headers.set("Content-Type", "application/json");
            return fetch(addProdiToUrl(`${baseUrl}${KategoriPath}/${id}`), {
                method: "PUT",
                headers,
                body: JSON.stringify(data),
            }).then((res) => res.json());
        },
        toggleActive: (id: number) => {
            const headers = config();
            return fetch(addProdiToUrl(`${baseUrl}${KategoriPath}/${id}/toggle`), {
                method: "PUT",
                headers,
            }).then((res) => res.json());
        },
        destroy: (id: number) => {
            const headers = config();
            return fetch(addProdiToUrl(`${baseUrl}${KategoriPath}/${id}`), {
                method: "DELETE",
                headers,
            }).then((res) => res.json());
        },
    };
};

export default KategoriConfig;
