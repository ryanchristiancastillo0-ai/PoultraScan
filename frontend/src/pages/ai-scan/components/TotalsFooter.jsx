import { GiChicken } from 'react-icons/gi';

export default function TotalsFooter({ chickens, totalWeight, totalOilMl, marketReadyCount }) {
  return (
    <div className="w-full mt-6 p-5 rounded-xl bg-[#2F5D3A] text-white">
      <div className="flex items-center gap-2 mb-4">
        <GiChicken className="text-[#A7D7B4] text-lg" />
        <span className="text-sm font-bold">{chickens.length} Chickens Scanned</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-white/70 font-semibold">Total Weight</p>
          <p className="text-base font-bold mt-0.5">{totalWeight} kg</p>
        </div>
        <div className="border-l border-white/15 pl-3">
          <p className="text-[9px] uppercase tracking-wider text-white/70 font-semibold">Total Oil Yield</p>
          <p className="text-base font-bold mt-0.5">{totalOilMl} ml</p>
        </div>
        <div className="border-l border-white/15 pl-3">
          <p className="text-[9px] uppercase tracking-wider text-white/70 font-semibold">Market Ready</p>
          <p className="text-base font-bold mt-0.5">{marketReadyCount}/{chickens.length}</p>
        </div>
      </div>
    </div>
  );
}