import {useState} from 'react'
import {SEVERITY_STYLES} from '../../../constant/severity'
import {
  MdCheck,
  MdHealthAndSafety,
  MdInfoOutline,
  MdOutlineMedicalServices,
  MdOutlinePets,
} from 'react-icons/md';

export default function ChickenCard({ chicken }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sev = SEVERITY_STYLES[chicken.severity?.toUpperCase()] || SEVERITY_STYLES.UNKNOWN;
  const isUncertain = chicken.disease === 'UNKNOWN';
  const hasExtraContent = Boolean(chicken.breed || chicken.recommendation);

  return (
    <article className="w-full bg-white rounded-2xl border border-[#E4ECE7] shadow-card hover:shadow-card-hover transition-shadow flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-5 py-3.5 bg-[#FBFDFC] border-b border-[#E4ECE7] flex items-center justify-between">
        <span className="text-xs font-bold text-[#10231A] tracking-wide">
          Chicken {chicken.tracking_id ?? '—'}
        </span>
        <span className={`badge ${sev.bg} ${sev.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
          {sev.label}
        </span>
      </header>

      {/* Body */}
      <div className="p-5 flex flex-col gap-5 flex-1">
        {/* Health status */}
        <div className="flex items-center gap-3">
          <span className={`w-9 h-9 rounded-full flex items-center justify-center ${
            chicken.healthy
              ? 'bg-[#E9F4EE] text-[#14532D]'
              : 'bg-[#FEF2F2] text-[#EF4444]'
          }`}>
            <MdHealthAndSafety className="text-lg" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#10231A]">{chicken.disease}</p>
            <p className={`text-xs mt-0.5 ${
              chicken.healthy ? 'text-[#4B6357]' : 'text-[#B91C1C]'
            }`}>
              {chicken.healthy ? 'No health issues detected' : 'Health issue flagged'}
            </p>
          </div>
        </div>

        {isUncertain && chicken.reasoning && (
          <p className="text-xs text-[#D97706] bg-[#FEF3C7] border border-[#FDE68A] rounded-lg px-3 py-2 leading-relaxed">
            {chicken.reasoning}
          </p>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 border-y border-[#E4ECE7] py-4">
          <div>
            <p className="text-[10px] text-[#718279] uppercase tracking-wider font-semibold">Weight</p>
            <p className="text-lg font-bold text-[#10231A] mt-1">
              {chicken.estimated_weight}<span className="ml-1 text-sm font-medium text-[#4B6357]">kg</span>
            </p>
          </div>
          <div className="border-l border-[#E4ECE7] pl-4">
            <p className="text-[10px] text-[#718279] uppercase tracking-wider font-semibold flex items-center gap-1">
              Estimated Oil Yield
              <span
                className="inline-flex cursor-help text-[#B3C4BA]"
                title="Estimated from body weight using an assumed fat percentage and rendering efficiency. Actual oil yield may vary depending on breed, age, sex, body condition, and rendering method."
              >
                <MdInfoOutline className="text-xs" />
              </span>
            </p>
            <p className="text-lg font-bold text-[#10231A] mt-1">
              ~{Math.round(chicken.estimated_oil_ml ?? 0)}<span className="ml-1 text-sm font-medium text-[#4B6357]">mL</span>
            </p>
            <p className="text-[10px] text-[#9AAEA2] mt-0.5">from estimated weight</p>
          </div>
        </div>

        {/* Confidence */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#718279] font-semibold uppercase tracking-wider">Confidence</span>
            <span className="text-xs font-bold text-[#14532D]">{chicken.confidence}%</span>
          </div>
          <div className="w-full bg-[#E4ECE7] rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="h-1.5 rounded-full bg-[#14532D] transition-all duration-500"
              style={{ width: `${chicken.confidence}%` }}
            />
          </div>
        </div>

        {/* Market ready */}
        <div className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 ${
          chicken.market_ready
            ? 'bg-[#E9F4EE] border-[#C7E2D2]'
            : 'bg-[#F7FAF8] border-[#E4ECE7]'
        }`}>
          <span className={`text-xs font-semibold ${
            chicken.market_ready ? 'text-[#14532D]' : 'text-[#718279]'
          }`}>
            {chicken.market_ready ? 'Market Ready' : 'Not Market Ready'}
          </span>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center ${
            chicken.market_ready
              ? 'bg-[#14532D] text-white'
              : 'bg-white text-[#B6C4BC] border border-[#E4ECE7]'
          }`}>
            <MdCheck className="text-sm" />
          </span>
        </div>

        {isExpanded && (
          <div className="flex flex-col gap-3">
            {chicken.breed && (
              <div className="flex items-center gap-2 text-sm text-[#4B6357]">
                <MdOutlinePets className="text-base text-[#718279]" />
                <span>{chicken.breed}</span>
              </div>
            )}
            {chicken.recommendation && (
              <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E4ECE7]">
                <div className="flex items-center gap-1.5 mb-1">
                  <MdOutlineMedicalServices className="text-[#14532D] text-sm" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#14532D]">Recommendation</span>
                </div>
                <p className="text-xs text-[#3D5949] leading-relaxed">{chicken.recommendation}</p>
              </div>
            )}
          </div>
        )}

        {hasExtraContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-auto w-full py-2.5 rounded-xl bg-white hover:bg-[#F7FAF8] border border-[#E4ECE7] text-xs font-bold uppercase tracking-widest text-[#4B6357] transition-colors"
          >
            {isExpanded ? 'See Less' : 'See More'}
          </button>
        )}
      </div>
    </article>
  );
}