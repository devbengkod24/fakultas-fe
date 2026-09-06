interface ValidationIssue {
  loc?: Array<string | number>;
  msg?: string;
}

interface ApiPayload {
  success?: boolean;
  message?: string;
  data?: unknown;
  detail?: string | ValidationIssue[];
}

export interface PublikasiServiceResponse {
  success: boolean;
  message: string;
  data: unknown | null;
  status?: number;
}

const parsePayload = async (response: Response): Promise<ApiPayload> => {
  try {
    return (await response.json()) as ApiPayload;
  } catch {
    return {
      success: false,
      message: "Response tidak valid dari server",
    };
  }
};

const getErrorMessage = (payload: ApiPayload, status: number): string => {
  if (Array.isArray(payload.detail)) {
    return payload.detail
      .map((issue) => {
        const location = issue.loc?.join(".");
        return location ? `${location}: ${issue.msg || "Data tidak valid"}` : issue.msg;
      })
      .filter(Boolean)
      .join("; ");
  }

  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  return payload.message || `HTTP ${status}`;
};

const ImportService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const triggerDownload = async (url: string, filename: string) => {
    const response = await fetch(url, { method: "GET", headers: config() });
    if (!response.ok) {
      const payload = await parsePayload(response);
      throw new Error(getErrorMessage(payload, response.status));
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

  const uploadFile = async (
    url: string,
    file: File,
  ): Promise<PublikasiServiceResponse> => {
    const headers = config();
    headers.delete("Content-Type");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });
    const payload = await parsePayload(response);

    if (!response.ok) {
      return {
        success: false,
        message: getErrorMessage(payload, response.status),
        data: payload.data ?? null,
        status: response.status,
      };
    }

    return {
      success: payload.success ?? true,
      message: payload.message ?? "Import berhasil",
      data: payload.data ?? null,
      status: response.status,
    };
  };

  return {
    uploadArticles: (file: File) =>
      uploadFile(`${baseUrl}/upload/articles`, file),

    uploadResearches: (file: File) =>
      uploadFile(`${baseUrl}/upload/researches`, file),

    relinkPenulis: async (): Promise<PublikasiServiceResponse> => {
      const response = await fetch(`${baseUrl}/admin/relink-penulis`, {
        method: "POST",
        headers: config(),
      });
      const payload = await parsePayload(response);

      if (!response.ok) {
        return {
          success: false,
          message: getErrorMessage(payload, response.status),
          data: payload.data ?? null,
          status: response.status,
        };
      }

      return {
        success: payload.success ?? true,
        message: payload.message ?? "Re-link selesai",
        data: payload.data ?? null,
        status: response.status,
      };
    },

    getArticlesTemplate: () =>
      triggerDownload(
        `${baseUrl}/admin/import-template/articles`,
        "template_artikel.xlsx",
      ),

    getResearchesTemplate: () =>
      triggerDownload(
        `${baseUrl}/admin/import-template/researches`,
        "template_penelitian.xlsx",
      ),
  };
};

export default ImportService;
