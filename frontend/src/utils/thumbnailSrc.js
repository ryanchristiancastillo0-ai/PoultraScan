export function thumbnailSrc(url) {
  if (!url) return null;
  return `http://localhost:${import.meta.env.VITE_BACKEND_PORT}${url}`;
}
