import {useState} from 'react'
import {SEVERITY_STYLES} from '../../../constant/severity'
import {
  MdHealthAndSafety,
  MdCheck,
  MdOutlinePets,
  MdOutlineShield,
  MdOutlineMedicalServices,

} from 'react-icons/md';
export default function ChickenCard({ chicken }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sev = SEVERITY_STYLES[chicken.severity?.toUpperCase()] || SEVERITY_STYLES.UNKNOWN;
  const isUncertain = chicken.disease === 'UNKNOWN';
  const hasExtraContent = Boolean(chicken.breed || chicken.recommendation || chicken.prevention_tips);

  return (
    <div className="flex-shrink-0 w-80 bg-white rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#F7F8F5] border-b border-[#E5E7EB] flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#111827] tracking-wide">
          Chicken {chicken.tracking_id ?? '—'}
        </span>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${sev.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
          <span className={`text-[9px] font-bold uppercase tracking-wider ${sev.text}`}>
            {sev.label}
          </span>
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md self-start border ${
          chicken.healthy
            ? 'bg-[#EAF2EC] text-[#2F5D3A] border-[#CFE2D4]'
            : 'bg-[#FBEBEB] text-[#B91C1C] border-[#F3C9C9]'
        }`}>
          <MdHealthAndSafety className="text-sm" />
          <span className="text-xs font-bold">{chicken.disease}</span>
        </div>

        {isUncertain && chicken.reasoning && (
          <p className="text-[11px] text-[#8A6A1E] bg-[#FBF4E6] border border-[#F0E2C0] rounded-lg px-2.5 py-2 leading-snug">
            {chicken.reasoning}
          </p>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 border-y border-[#E5E7EB] py-3">
          <div>
            <p className="text-[9px] text-[#6B7280] uppercase tracking-wider font-semibold">Weight</p>
            <p className="text-sm font-bold text-[#111827] mt-0.5">{chicken.estimated_weight} kg</p>
          </div>
          <div className="border-l border-[#E5E7EB] pl-3">
            <p className="text-[9px] text-[#6B7280] uppercase tracking-wider font-semibold">Oil Yield</p>
            <p className="text-sm font-bold text-[#111827] mt-0.5">{chicken.estimated_oil_ml} ml</p>
          </div>
        </div>

        {/* Confidence */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Confidence</span>
            <span className="text-xs font-bold text-[#2F5D3A]">{chicken.confidence}%</span>
          </div>
          <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-[#2F5D3A] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${chicken.confidence}%` }}
            />
          </div>
        </div>

        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md self-start border ${
          chicken.market_ready
            ? 'bg-[#EAF2EC] text-[#2F5D3A] border-[#CFE2D4]'
            : 'bg-[#FBF4E6] text-[#B45309] border-[#F0E2C0]'
        }`}>
          <MdCheck className="text-sm" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {chicken.market_ready ? 'Market Ready' : 'Not Ready'}
          </span>
        </div>

        {isExpanded && (
          <div className="flex flex-col gap-2.5 pt-1">
            {chicken.breed && (
              <div className="flex items-center gap-1.5 pb-2 border-b border-[#E5E7EB]">
                <MdOutlinePets className="text-[#6B7280] text-sm" />
                <span className="text-[11px] text-[#6B7280] font-medium">{chicken.breed}</span>
              </div>
            )}
            {chicken.recommendation && (
              <div className="p-2.5 rounded-lg bg-[#F7F8F5] border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 mb-1">
                  <MdOutlineMedicalServices className="text-[#111827] text-xs" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#111827]">Recommendation</span>
                </div>
                <p className="text-[11px] text-[#4B5563] leading-relaxed">{chicken.recommendation}</p>
              </div>
            )}
            {chicken.prevention_tips && (
              <div className="p-2.5 rounded-lg bg-[#EAF2EC] border border-[#CFE2D4]">
                <div className="flex items-center gap-1.5 mb-1">
                  <MdOutlineShield className="text-[#2F5D3A] text-xs" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#2F5D3A]">Prevention</span>
                </div>
                <p className="text-[11px] text-[#4B5563] leading-relaxed">{chicken.prevention_tips}</p>
              </div>
            )}
          </div>
        )}

        {hasExtraContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 w-full py-2 bg-[#F7F8F5] hover:bg-[#EEF0EC] border border-[#E5E7EB] rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#6B7280] transition-colors"
          >
            {isExpanded ? 'See Less' : 'See More'}
          </button>
        )}
      </div>
    </div>
  );
}