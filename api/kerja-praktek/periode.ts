import { PeriodeUpdate } from "@/types/kerja-praktek/periode";

const Periode = ({
    baseUrl,
    config,
}: {
    baseUrl: string;
    config: () => Headers;
}) => {
    const periode = "/periode";

    return {
        getAllPeriode: () => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}${periode}?limit=999`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error get all periode: ${error.message}`);
                });
        },
        syncPeriode: () => {
            const headers = config();
            const requestConfig = {
                method: "GET",
                headers: headers,
            };

            return fetch(`${baseUrl}${periode}/sync`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error sync periode: ${error.message}`);
                });
        },
        updatePeriode: (data: PeriodeUpdate, id: number) => {
            const headers = config();
            headers.append("Content-Type", "application/json");

            const requestConfig = {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify(data),
            };

            return fetch(`${baseUrl}/periode/${id}/update`, requestConfig)
                .then((response) => response.json())
                .catch((error) => {
                    throw new Error(`Error update periode: ${error.message}`);
                });
        }
    }
}

export default Periode;
