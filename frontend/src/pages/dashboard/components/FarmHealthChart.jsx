import { useState, useEffect } from 'react';

export default function FarmHealthChart({ farmHealthIndex }) {
  const [range, setRange] = useState('7');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [farmHealthIndex]);

  const getColor = (pct) => {
    if (pct >= 90) return '#2F5D3A';
    if (pct >= 70) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="md:col-span-6 bg-white rounded-xl p-4 sm:p-6 border border-[#E5E7EB] flex flex-col shadow-sm">
      <div className="flex flex-col xs:flex-row sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h3 className="text-[15px] font-semibold text-[#111827]">Health Index by Farm</h3>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="bg-white border border-[#E5E7EB] text-sm font-medium rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2F5D3A]/20 focus:border-[#2F5D3A] text-[#111827] outline-none cursor-pointer transition-colors w-full sm:w-auto"
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
        <div className="flex-1 overflow-x-auto -mx-1 px-1">
          <div className="h-[180px] sm:h-[220px] flex items-end gap-3 sm:gap-4 pt-10 min-w-max sm:min-w-0 sm:justify-between">
            {farmHealthIndex.map((farm, index) => {
              const color = getColor(farm.health_percentage);
              const targetHeight = Math.max(farm.health_percentage, 4);
              return (
                <div
                  key={farm.farm_id}
                  className="w-12 sm:w-auto sm:flex-1 h-full flex flex-col items-center justify-end gap-2 sm:gap-3 group relative flex-shrink-0"
                >
                  <div
                    className="w-full max-w-[32px] sm:max-w-[40px] rounded-t-md relative opacity-90 group-hover:opacity-100"
                    style={{
                      height: animate ? `${targetHeight}%` : '0%',
                      backgroundColor: color,
                      transition: `height 700ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 70}ms, opacity 200ms`,
                    }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-xs font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {farm.health_percentage}%
                    </div>
                  </div>
                  <span
                    className="text-[11px] sm:text-xs font-medium truncate max-w-[48px] sm:max-w-[64px]"
                    style={{
                      color:
                        farm.health_percentage < 70
                          ? '#EF4444'
                          : farm.health_percentage >= 90
                          ? '#2F5D3A'
                          : '#6B7280',
                    }}
                  >
                    {farm.farm_name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}