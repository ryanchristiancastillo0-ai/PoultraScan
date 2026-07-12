export function thumbnailSrc(url) {
  if (!url) return null;
  return `${import.meta.env.VITE_BACKEND_URL}${url}`;
}
