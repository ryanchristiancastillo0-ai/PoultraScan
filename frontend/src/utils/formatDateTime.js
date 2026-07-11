export function formatDateTime(iso) {
  if (!iso) return { date: '--', time: '--' };
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
  };
}