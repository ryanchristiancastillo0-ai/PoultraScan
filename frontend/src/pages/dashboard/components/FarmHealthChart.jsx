import {useState} from 'react'

export default function FarmHealthChart({ farmHealthIndex }) {
  const [range, setRange] = useState('7');

  const getColor = (pct) => {
    if (pct >= 90) return '#2F5D3A';
    if (pct >= 70) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="md:col-span-6 bg-white rounded-xl p-6 border border-[#E5E7EB] flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[15px] font-semibold text-[#111827]">Health Index by Farm</h3>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="bg-white border border-[#E5E7EB] text-sm font-medium rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2F5D3A]/20 focus:border-[#2F5D3A] text-[#111827] outline-none cursor-pointer transition-colors"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>
      {farmHealthIndex.length === 0 ? (
        <div className="flex-1 min-h-[200px] flex items-center justify-center">
          <p className="text-sm text-[#6B7280]">No farm scan data yet.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-[200px] flex items-end justify-between gap-4 pt-10">
          {farmHealthIndex.map((farm) => {
            const color = getColor(farm.health_percentage);
            return (
              <div key={farm.farm_id} className="flex-1 flex flex-col items-center gap-3 group relative">
                <div
                  className="w-full max-w-[40px] rounded-t-md relative transition-opacity duration-200 opacity-90 group-hover:opacity-100"
                  style={{ height: `${Math.max(farm.health_percentage, 4)}%`, backgroundColor: color }}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-xs font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {farm.health_percentage}%
                  </div>
                </div>
                <span
                  className="text-xs font-medium truncate max-w-[64px]"
                  style={{ color: farm.health_percentage < 70 ? '#EF4444' : farm.health_percentage >= 90 ? '#2F5D3A' : '#6B7280' }}
                >
                  {farm.farm_name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}