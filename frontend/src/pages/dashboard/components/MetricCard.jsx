

export default function MetricCard({ icon: Icon, label, value, caption, accent }) {
  const accents = {
    teal: { bg: '#E8F5E9', text: '#2E7D32' },
    green: { bg: '#E8F5E9', text: '#2E7D32' },
    red: { bg: '#FFEBEE', text: '#D32F2F' },
    farm: { bg: '#E8F5E9', text: '#1976D2' },
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
      <h3 className="text-3xl font-bold text-[#1B1D1B] tracking-tight leading-none">{value}</h3>
      {caption && <p className="text-[13px] text-[#6B7280] mt-2.5">{caption}</p>}
    </div>
  );
}