export default function AlertFeed({ recentEvents }) {
  const typeStyles = {
    anomaly: { color: '#EF4444', bg: '#FEF2F2' },
    completed: { color: '#2F5D3A', bg: '#ECFDF3' },
  };

  const timeAgo = (value) => {
    if (!value) return '';
    const diffMs = Date.now() - new Date(value).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  return (
    <div className="md:col-span-12 lg:col-span-4 bg-white rounded-xl border border-[#E5E7EB] flex flex-col shadow-sm">
      <div className="px-6 py-4 border-b border-[#E5E7EB]">
        <h3 className="text-[15px] font-semibold text-[#111827]">Alert Feed</h3>
      </div>
      {recentEvents.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-[#6B7280]">No recent activity.</p>
        </div>
      ) : (
        <ul className="divide-y divide-[#E5E7EB] overflow-y-auto max-h-[320px]">
          {recentEvents.map((alert, i) => {
            const style = typeStyles[alert.type] || typeStyles.completed;
            return (
              <li key={i} className="px-6 py-4 hover:bg-[#F7F8F5] transition-colors flex gap-3.5">
                <span
                  className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: style.bg }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.color }} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#111827] leading-snug">{alert.title}</p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {alert.farm_name} • {timeAgo(alert.created_at)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}