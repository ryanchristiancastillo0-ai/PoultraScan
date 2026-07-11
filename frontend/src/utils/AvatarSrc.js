const API_BASE = `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}`; 
export function resolveAvatarSrc(avatarUrl) {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith('http') || avatarUrl.startsWith('blob:')) return avatarUrl;
  return `${API_BASE}${avatarUrl}`;
}