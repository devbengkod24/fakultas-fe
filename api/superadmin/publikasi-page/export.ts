export type ExportArtikelParams = {
  prodi_id?: number | string;
  prodi?: string;
  year_from?: number | string;
  year_to?: number | string;
  source?: string;
};

export type ExportPenelitianParams = {
  prodi_id?: number | string;
  prodi?: string;
  year_from?: number | string;
  year_to?: number | string;
  fund_source?: string;
};

interface ExportErrorPayload {
  message?: string;
  detail?: string | Array<{ msg?: string }>;
}

const buildQuery = (params: object): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const getExportErrorMessage = async (response: Response): Promise<string> => {
  let payload: ExportErrorPayload | null = null;

  try {
    payload = (await response.json()) as ExportErrorPayload;
  } catch {
    return `HTTP ${response.status}`;
  }

  if (Array.isArray(payload.detail)) {
    return payload.detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join("; ");
  }

  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  return payload.message || `HTTP ${response.status}`;
};

const ExportPublikasiService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const downloadExcel = async (url: string, filename: string) => {
    const response = await fetch(url, { method: "GET", headers: config() });
    if (!response.ok) {
      throw new Error(await getExportErrorMessage(response));
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(blobUrl);
  };

  const today = () => new Date().toISOString().split("T")[0];

  return {
    exportArticles: (params: ExportArtikelParams = {}) =>
      downloadExcel(
        `${baseUrl}/export/articles${buildQuery(params)}`,
        `publikasi_artikel_${today()}.xlsx`,
      ),

    exportResearches: (params: ExportPenelitianParams = {}) =>
      downloadExcel(
        `${baseUrl}/export/researches${buildQuery(params)}`,
        `publikasi_penelitian_${today()}.xlsx`,
      ),
  };
};

export default ExportPublikasiService;
