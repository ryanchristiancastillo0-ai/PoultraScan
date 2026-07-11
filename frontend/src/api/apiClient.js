const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;
export const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}:${BACKEND_PORT}`;

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include', // sends the httpOnly cookie
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    // no JSON body
  }

  if (!res.ok) {
    console.error(`API error [${res.status}] on ${path}:`, data);
    throw new Error(data?.detail || res.statusText);
  }

  return data;
}