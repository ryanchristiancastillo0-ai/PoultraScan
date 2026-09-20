import { GiChicken } from 'react-icons/gi';
import { MdInfoOutline } from 'react-icons/md';

function MarketReadyBar({ ready, total }) {
  if (!total) return null;
  const pct = Math.round((ready / total) * 100);
  return (
    <div className="mt-3 flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-[#E4ECE7] rounded-full overflow-hidden">
        <div className="h-full bg-[#14532D] rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-[#14532D]">{pct}%</span>
    </div>
  );
}

export default function TotalsFooter({ chickens, totalWeight, totalOilMl, marketReadyCount }) {
  return (
    <section className="bg-white rounded-2xl border border-[#E4ECE7] shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E4ECE7] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-[#E9F4EE] flex items-center justify-center">
            <GiChicken className="text-lg text-[#14532D]" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-[#10231A]">Flock Summary</h2>
            <p className="text-xs text-[#4B6357] mt-0.5">
              {chickens.length} {chickens.length === 1 ? 'chicken' : 'chickens'} scanned in this run
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E4ECE7]">
        <div className="py-4 sm:py-5 sm:px-6 first:sm:pl-5 last:sm:pr-5">
          <p className="text-[10px] text-[#718279] uppercase tracking-wider font-semibold">Total Weight</p>
          <p className="mt-1.5 text-2xl font-bold text-[#10231A] leading-none">
            {totalWeight}<span className="ml-1 text-sm font-medium text-[#4B6357]">kg</span>
          </p>
        </div>
        <div className="py-4 sm:py-5 sm:px-6 first:sm:pl-5 last:sm:pr-5">
          <p className="text-[10px] text-[#718279] uppercase tracking-wider font-semibold flex items-center gap-1 whitespace-nowrap">
            Total Estimated Oil Yield
            <MdInfoOutline
              className="text-xs text-[#B3C4BA] cursor-help"
              title="Estimated from body weight using an assumed fat percentage and rendering efficiency. Actual oil yield may vary depending on breed, age, sex, body condition, and rendering method."
            />
          </p>
          <p className="mt-1.5 text-2xl font-bold text-[#10231A] leading-none">
            ~{Math.round(totalOilMl ?? 0)}<span className="ml-1 text-sm font-medium text-[#4B6357]">mL</span>
          </p>
        </div>
        <div className="py-4 sm:py-5 sm:px-6 first:sm:pl-5 last:sm:pr-5">
          <p className="text-[10px] text-[#718279] uppercase tracking-wider font-semibold">Market Ready</p>
          <p className="mt-1.5 text-2xl font-bold text-[#10231A] leading-none">
            {marketReadyCount}<span className="ml-1 text-sm font-medium text-[#4B6357]">of {chickens.length}</span>
          </p>
          <MarketReadyBar ready={marketReadyCount} total={chickens.length} />
        </div>
      </div>
    </section>
  );
}