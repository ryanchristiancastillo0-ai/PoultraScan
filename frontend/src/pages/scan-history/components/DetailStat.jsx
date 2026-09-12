export default function DetailStat({ icon: Icon, label, value, tone = 'default' }) {
  const tones = {
    default: 'bg-[#F8FAF7] border-[#E5E7EB]',
    good: 'bg-[#E8F5E9] border-[#E8F5E9]',
    warn: 'bg-[#FFF6E0] border-[#F0E2C0]',
    bad: 'bg-[#FFEBEE] border-[#FFEBEE]',
  };
  return (
    <div className={`flex flex-col gap-1.5 p-3 sm:p-4 rounded-xl border ${tones[tone]}`}>
      <div className="flex items-center gap-1.5">
        <Icon className="text-[#2E7D32] text-base flex-shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] truncate">{label}</span>
      </div>
      <p className="text-base sm:text-lg font-bold text-[#1B1D1B] break-words">{value}</p>
    </div>
  );
}