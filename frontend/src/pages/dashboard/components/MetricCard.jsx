

export default function MetricCard({ icon: Icon, label, value, caption, accent }) {
  const accents = {
    teal: { bg: '#EEF3EF', text: '#2F5D3A' },
    green: { bg: '#ECFDF3', text: '#22C55E' },
    red: { bg: '#FEF2F2', text: '#EF4444' },
    farm: { bg: '#EFF6FF', text: '#2563EB' },
  };
  const a = accents[accent];

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm hover:border-[#D1D5DB] transition-colors duration-200">
      <div className="flex items-center justify-between mb-5">
        <span
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: a.bg, color: a.text }}
        >
          <Icon className="text-xl" />
        </span>
      </div>
      <p className="text-[#6B7280] text-xs font-semibold mb-2 uppercase tracking-wide">{label}</p>
      <h3 className="text-3xl font-bold text-[#111827] tracking-tight leading-none">{value}</h3>
      {caption && <p className="text-[13px] text-[#6B7280] mt-2.5">{caption}</p>}
    </div>
  );
}