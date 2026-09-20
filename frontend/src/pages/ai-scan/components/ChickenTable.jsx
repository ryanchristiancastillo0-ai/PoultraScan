import { Fragment, useState } from 'react';
import {
  MdChevronRight,
  MdCheck,
  MdOutlinePets,
  MdOutlineMedicalServices,
} from 'react-icons/md';
import { SEVERITY_STYLES } from '../../../constant/severity';

export default function ChickenTable({ chickens }) {
  const [expanded, setExpanded] = useState(null);

  const th = 'px-4 py-3 text-[11px] text-[#4B6357] uppercase tracking-wide font-semibold whitespace-nowrap';
  const td = 'px-4 py-3.5 text-sm';

  return (
    <div className="bg-white rounded-2xl border border-[#E4ECE7] shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[760px]">
          <thead>
            <tr className="border-b border-[#E4ECE7] bg-[#F7FAF8]">
              <th className={th}>Chicken</th>
              <th className={th}>Health</th>
              <th className={th}>Severity</th>
              <th className={th}>Weight</th>
              <th className={th}>Estimated Oil Yield</th>
              <th className={th}>Confidence</th>
              <th className={th}>Market Ready</th>
              <th className={`${th} text-right`}>Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4ECE7]">
            {chickens.map((chicken, i) => {
              const sev = SEVERITY_STYLES[chicken.severity?.toUpperCase()] || SEVERITY_STYLES.UNKNOWN;
              const isOpen = expanded === i;
              const isUncertain = chicken.disease === 'UNKNOWN';
              const hasExtra = Boolean(
                chicken.breed || chicken.recommendation || (isUncertain && chicken.reasoning)
              );

              return (
                <Fragment key={chicken.tracking_id ?? i}>
                  <tr className={`transition-colors ${isOpen ? 'bg-[#FBFDFC]' : 'hover:bg-[#FBFDFC]'}`}>
                    <td className={`${td} font-semibold text-[#10231A] whitespace-nowrap`}>
                      Chicken {chicken.tracking_id ?? '—'}
                    </td>
                    <td className={td}>
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${chicken.healthy ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                        <span className={`font-medium ${chicken.healthy ? 'text-[#059669]' : 'text-[#B91C1C]'}`}>
                          {chicken.disease}
                        </span>
                      </span>
                    </td>
                    <td className={td}>
                      <span className={`badge ${sev.bg} ${sev.text}`}>{sev.label}</span>
                    </td>
                    <td className={`${td} text-[#4B6357] whitespace-nowrap`}>{chicken.estimated_weight} kg</td>
                    <td className={`${td} text-[#4B6357] whitespace-nowrap`}>~{Math.round(chicken.estimated_oil_ml ?? 0)} mL</td>
                    <td className={td}>
                      <span className="inline-flex items-center gap-2">
                        <span className="w-16 h-1.5 bg-[#E4ECE7] rounded-full overflow-hidden">
                          <span className="block h-full bg-[#14532D] rounded-full" style={{ width: `${chicken.confidence}%` }} />
                        </span>
                        <span className="text-xs font-bold text-[#14532D]">{chicken.confidence}%</span>
                      </span>
                    </td>
                    <td className={td}>
                      {chicken.market_ready ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#14532D]">
                          <MdCheck className="text-sm" /> Market Ready
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-[#718279]">Not ready</span>
                      )}
                    </td>
                    <td className={`${td} text-right`}>
                      <button
                        type="button"
                        onClick={() => setExpanded(hasExtra ? (isOpen ? null : i) : null)}
                        disabled={!hasExtra}
                        aria-label={isOpen ? 'Hide details' : 'View details'}
                        className={`w-8 h-8 inline-flex items-center justify-center rounded-lg transition-colors ${
                          hasExtra
                            ? 'text-[#718279] hover:bg-[#E9F4EE] hover:text-[#14532D]'
                            : 'text-[#D3DEDA] cursor-default'
                        }`}
                      >
                        <MdChevronRight className={`text-lg transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                      </button>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr className="bg-[#FBFDFC] border-b border-[#E4ECE7] last:border-b-0">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="flex flex-col gap-2.5 max-w-3xl">
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
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}