import { fetch } from "@tauri-apps/plugin-http";

export const requestFetch = async <T>(
  url: string,
  method: string,
  body?: string,
  timeout?: number
): Promise<T | null> => {
  const res = await fetch(url, { method, body, connectTimeout: timeout });

  if (res.status === 200) {
    const data: T = await res.json();
    return data;
  } else {
    return null;
  }
};
