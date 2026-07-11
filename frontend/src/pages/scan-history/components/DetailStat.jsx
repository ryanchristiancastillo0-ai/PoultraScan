export default function DetailStat({ icon: Icon, label, value, tone = 'default' }) {
  const tones = {
    default: 'bg-[#F7F8F5] border-[#E5E7EB]',
    good: 'bg-[#EAF2EC] border-[#D3E4D8]',
    warn: 'bg-[#FBF4E6] border-[#F0E2C0]',
    bad: 'bg-[#FBEBEB] border-[#F3D3D3]',
  };
  return (
    <div className={`flex flex-col gap-1.5 p-3 sm:p-4 rounded-xl border ${tones[tone]}`}>
      <div className="flex items-center gap-1.5">
        <Icon className="text-[#2F5D3A] text-base flex-shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] truncate">{label}</span>
      </div>
      <p className="text-base sm:text-lg font-bold text-[#111827] break-words">{value}</p>
    </div>
  );
}