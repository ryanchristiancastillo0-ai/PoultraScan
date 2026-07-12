// Backend base URL
export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function formatErrorDetail(detail, fallback) {
  if (!detail) return fallback;

  // FastAPI validation errors: array of { loc, msg, type }
  if (Array.isArray(detail)) {
    return detail
      .map((err) => {
        const field = Array.isArray(err.loc) ? err.loc.join(".") : err.loc;
        return `${field}: ${err.msg}`;
      })
      .join(" | ");
  }

  // Plain string detail
  if (typeof detail === "string") return detail;

  // Fallback: stringify whatever shape it is
  try {
    return JSON.stringify(detail);
  } catch {
    return fallback;
  }
}

export async function apiRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include", // Send httpOnly cookies
    headers: {
      // Only force JSON content-type when the body isn't FormData.
      // For FormData, the browser must set its own Content-Type
      // (including the multipart boundary) or the server can't parse it.
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
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
    const message = formatErrorDetail(data?.detail, data?.message || res.statusText);
    console.error(`API Error [${res.status}] ${path}:`, data);
    const error = new Error(message);
    error.status = res.status;
    error.detail = data?.detail;
    throw error;
  }

  return data;
}