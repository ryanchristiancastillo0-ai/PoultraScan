export default function MarketReadyBar({ ready, total }) {
  if (total == null || total === 0) {
    return <span className="text-[#9CA3AF] italic text-sm">--</span>;
  }
  const pct = Math.round((ready / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-[#1B1D1B] w-10">{ready}/{total}</span>
      <div className="w-20 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
        <div className="h-full bg-[#2E7D32] rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}