import {MdCheckCircle} from 'react-icons/md'

export default function AnomalyChart({ diseaseBreakdown, totalAnomalies }) {
  const palette = ['#2F5D3A', '#F59E0B', '#6B7280', '#EF4444', '#22C55E'];

  const topDiseases = diseaseBreakdown.slice(0, 4);
  const otherCount = diseaseBreakdown.slice(4).reduce((sum, d) => sum + d.count, 0);
  const segments = [
    ...topDiseases.map((d, i) => ({
      label: d.disease.charAt(0) + d.disease.slice(1).toLowerCase(),
      value: d.count,
      color: palette[i % palette.length],
    })),
    ...(otherCount > 0 ? [{ label: 'Other', value: otherCount, color: '#D1D5DB' }] : []),
  ];

  let cumulative = 0;
  const gradientStops = segments.map((seg) => {
    const start = (cumulative / totalAnomalies) * 360;
    cumulative += seg.value;
    const end = (cumulative / totalAnomalies) * 360;
    return `${seg.color} ${start}deg ${end}deg`;
  });

  return (
    <div className="md:col-span-6 bg-white rounded-xl p-6 border border-[#E5E7EB] flex flex-col shadow-sm">
      <h3 className="text-[15px] font-semibold text-[#111827] mb-6">Anomaly Classification</h3>
      {totalAnomalies === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] text-center">
          <MdCheckCircle className="text-3xl text-[#22C55E] mb-2" />
          <p className="text-sm text-[#6B7280]">No anomalies detected yet.</p>
        </div>
      ) : (
        <>
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <div
              className="w-40 h-40 rounded-full relative"
              style={{ background: `conic-gradient(${gradientStops.join(', ')})` }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-[26px]">
                <span className="text-3xl font-bold text-[#111827] leading-none">{totalAnomalies}</span>
                <span className="text-xs font-semibold text-[#6B7280] mt-1.5 uppercase tracking-wide">Total</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-6 pt-5 border-t border-[#E5E7EB]">
            {segments.map((seg, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-sm font-medium text-[#6B7280]">{seg.label}</span>
                </div>
                <span className="text-sm font-semibold text-[#111827]">
                  {Math.round((seg.value / totalAnomalies) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}