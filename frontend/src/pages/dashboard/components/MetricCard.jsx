export default function MetricCard({ icon: Icon, label, value, caption, accent }) {
  const accents = {
    teal: { bg: '#FFF6E0', text: '#B45309' },
    green: { bg: '#D1FAE5', text: '#059669' },
    red: { bg: '#FEF2F2', text: '#EF4444' },
    farm: { bg: '#E9F4EE', text: '#14532D' },
  };
  const a = accents[accent];
  const valueColor = accent === 'teal' ? '#B45309' : '#10231A';

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E4ECE7] shadow-card hover:shadow-card-hover hover:border-[#9CCFB0] hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: a.bg, color: a.text }}
        >
          <Icon className="text-xl" />
        </span>
      </div>
      <p className="text-[#4B6357] text-[11px] font-semibold mb-1.5 uppercase tracking-wider">{label}</p>
      <h3
        className="text-[28px] font-bold tracking-tight leading-none text-tabular"
        style={{ color: valueColor }}
      >
        {value}
      </h3>
      {caption && <p className="text-[13px] text-[#4B6357] mt-2">{caption}</p>}
    </div>
  );
}