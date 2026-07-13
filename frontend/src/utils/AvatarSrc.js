const RAW_BASE = import.meta.env.VITE_BACKEND_URL;
const PORT = import.meta.env.VITE_BACKEND_PORT;

const API_BASE = PORT ? `${RAW_BASE}:${PORT}` : RAW_BASE;

export function resolveAvatarSrc(avatarUrl) {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith('http') || avatarUrl.startsWith('blob:')) return avatarUrl;
  return `${API_BASE}${avatarUrl}`;
}