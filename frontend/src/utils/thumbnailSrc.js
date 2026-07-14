export function thumbnailSrc(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${import.meta.env.VITE_BACKEND_URL}${url}`;
}