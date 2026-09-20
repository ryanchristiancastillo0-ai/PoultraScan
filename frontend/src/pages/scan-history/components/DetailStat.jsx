export default function DetailStat({ icon: Icon, label, value, tone = 'default' }) {
  const tones = {
    default: 'bg-[#F7FAF8] border-[#E4ECE7]',
    good: 'bg-[#E9F4EE] border-[#E9F4EE]',
    warn: 'bg-[#FEF3C7] border-[#FDE68A]',
    bad: 'bg-[#FEF2F2] border-[#FEF2F2]',
  };
  return (
    <div className={`flex flex-col gap-1.5 p-3 sm:p-4 rounded-xl border ${tones[tone]}`}>
      <div className="flex items-center gap-1.5">
        <Icon className="text-[#14532D] text-base flex-shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4B6357] truncate">{label}</span>
      </div>
      <p className="text-base sm:text-lg font-bold text-[#10231A] break-words">{value}</p>
    </div>
  );
}