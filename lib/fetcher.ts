const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api-fik.jong.my.id/api/v1";

export async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include", // kirim cookie otomatis (Bearer token dari cookie)
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}