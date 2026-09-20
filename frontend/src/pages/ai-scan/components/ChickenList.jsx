import { useState } from 'react';
import {
  MdChevronRight,
  MdCheck,
  MdOutlinePets,
  MdOutlineMedicalServices,
} from 'react-icons/md';
import { SEVERITY_STYLES } from '../../../constant/severity';

export default function ChickenList({ chickens }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <ul className="bg-white rounded-2xl border border-[#E4ECE7] shadow-card divide-y divide-[#E4ECE7] overflow-hidden">
      {chickens.map((chicken, i) => {
        const sev = SEVERITY_STYLES[chicken.severity?.toUpperCase()] || SEVERITY_STYLES.UNKNOWN;
        const isOpen = expanded === i;
        const isUncertain = chicken.disease === 'UNKNOWN';
        const hasExtra = Boolean(
          chicken.breed || chicken.recommendation || (isUncertain && chicken.reasoning)
        );

        return (
          <li
            key={chicken.tracking_id ?? i}
            className={`transition-colors ${isOpen ? 'bg-[#FBFDFC]' : ''}`}
          >
            <button
              type="button"
              onClick={() => setExpanded(hasExtra ? (isOpen ? null : i) : null)}
              disabled={!hasExtra}
              className={`w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 text-left transition-colors ${
                hasExtra ? 'cursor-pointer hover:bg-[#F7FAF8]' : 'cursor-default'
              }`}
            >
              <span className="w-8 h-8 rounded-lg bg-[#E9F4EE] text-[#14532D] flex items-center justify-center text-xs font-bold flex-shrink-0">
                {chicken.tracking_id ?? i + 1}
              </span>

              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[#10231A]">
                    Chicken {chicken.tracking_id ?? '—'}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                    chicken.healthy ? 'text-[#059669]' : 'text-[#B91C1C]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${chicken.healthy ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                    {chicken.disease}
                  </span>
                </span>
                <span className="flex items-center gap-2 mt-0.5 text-xs text-[#718279]">
                  <span>{chicken.estimated_weight} kg</span>
                  <span className="w-1 h-1 rounded-full bg-[#C5D6CC]" />
                  <span>~{Math.round(chicken.estimated_oil_ml ?? 0)} mL</span>
                  <span className="w-1 h-1 rounded-full bg-[#C5D6CC]" />
                  <span>{chicken.confidence}% confidence</span>
                </span>
              </span>

              <span className={`badge ${sev.bg} ${sev.text} hidden sm:inline-flex`}>{sev.label}</span>

              {chicken.market_ready ? (
                <span className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-[#14532D] bg-[#E9F4EE] border border-[#C7E2D2] rounded-full px-2.5 py-1">
                  <MdCheck className="text-sm" /> Ready
                </span>
              ) : (
                <span className="hidden md:inline-flex text-xs font-medium text-[#718279] whitespace-nowrap">
                  Not ready
                </span>
              )}

              {hasExtra && (
                <MdChevronRight
                  className={`text-[#718279] text-lg flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                />
              )}
            </button>

            {isOpen && (
              <div className="px-4 sm:px-5 pb-4 -mt-1 flex flex-col gap-2.5">
                {isUncertain && chicken.reasoning && (
                  <p className="text-xs text-[#D97706] bg-[#FEF3C7] border border-[#FDE68A] rounded-lg px-3 py-2 leading-relaxed">
                    {chicken.reasoning}
                  </p>
                )}
                {chicken.breed && (
                  <p className="flex items-center gap-2 text-sm text-[#4B6357]">
                    <MdOutlinePets className="text-base text-[#718279]" />
                    {chicken.breed}
                  </p>
                )}
                {chicken.recommendation && (
                  <div className="p-3 rounded-xl bg-white border border-[#E4ECE7]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MdOutlineMedicalServices className="text-[#14532D] text-sm" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#14532D]">Recommendation</span>
                    </div>
                    <p className="text-xs text-[#3D5949] leading-relaxed">{chicken.recommendation}</p>
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}