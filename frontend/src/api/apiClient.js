// Backend base URL
export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include", // Send httpOnly cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;

  try {
    data = await res.json();
  } catch (err) {
    // Response has no JSON body
  }

  if (!res.ok) {
    console.error(`API Error [${res.status}] ${path}:`, data);
    throw new Error(data?.detail || data?.message || res.statusText);
  }

  return data;
}