


export default function StatPill({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-[#E4ECE7] rounded-2xl px-4 py-3 shadow-card">
      <span className="w-9 h-9 rounded-lg bg-[#E9F4EE] text-[#14532D] flex items-center justify-center flex-shrink-0">
        <Icon className="text-lg" />
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] text-[#4B6357] uppercase tracking-wide font-semibold">{label}</span>
        <span className="text-base text-[#10231A] font-bold">{value}</span>
      </div>
    </div>
  );
}


