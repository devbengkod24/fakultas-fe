import { useCallback } from "react";

export const useApi = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api-dev-sti.dinus.id/api/v1";
  const publikasiUrl =
    process.env.NEXT_PUBLIC_PUBLIKASI_URL ||
    "https://sti.dinus.id/publikasi-api/api/";

  const config = useCallback(
    () => ({
      headers: {
        "Content-Type": "application/json",
        // Add any other headers you need, like authentication tokens
      },
    }),
    []
  );

  return { baseUrl, publikasiUrl, config };
};
