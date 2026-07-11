


export default function StatPill({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 shadow-sm">
      <span className="w-9 h-9 rounded-lg bg-[#EEF3EF] text-[#2F5D3A] flex items-center justify-center flex-shrink-0">
        <Icon className="text-lg" />
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] text-[#6B7280] uppercase tracking-wide font-semibold">{label}</span>
        <span className="text-base text-[#111827] font-bold">{value}</span>
      </div>
    </div>
  );
}


