export function getInitials(fullname) {
  if (!fullname) return '?';
  return fullname
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}
