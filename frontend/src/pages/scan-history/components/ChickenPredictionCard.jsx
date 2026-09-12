import {useState} from 'react'
import {thumbnailSrc} from '../../../utils/thumbnailSrc'
import {SeverityBadge,DetailStat} from './index'
import {MdChevronRight,MdHealthAndSafety,MdScale,MdOpacity,MdOutlinePets,} from 'react-icons/md';

export default function ChickenPredictionCard({ chicken }) {
  const [expanded, setExpanded] = useState(false);
  const src = thumbnailSrc(chicken.image_url);

  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 p-3 hover:bg-[#F8FAF7] transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E5E7EB] bg-[#F8FAF7] flex items-center justify-center flex-shrink-0">
          {src ? (
            <img src={src} alt="" className="w-full h-full object-cover" />
          ) : (
            <MdOutlinePets className="text-[#9CA3AF] text-lg" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[#1B1D1B]">
              Chicken #{chicken.tracking_id ?? chicken.detected_chicken_id}
            </p>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              chicken.healthy ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#D32F2F]'
            }`}>
              {chicken.disease}
            </span>
            <SeverityBadge severity={chicken.severity} />
          </div>
          <p className="text-xs text-[#6B7280] mt-0.5">
            {chicken.breed || 'Unknown breed'} • {chicken.confidence != null ? `${chicken.confidence}% confidence` : '--'}
          </p>
        </div>
        <MdChevronRight className={`text-[#9CA3AF] text-lg flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="p-3 sm:p-4 pt-0 sm:pt-0 flex flex-col gap-3 border-t border-[#E5E7EB] mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-3">
            <DetailStat icon={MdScale} label="Weight" value={chicken.estimated_weight != null ? `${chicken.estimated_weight} kg` : '--'} />
            <DetailStat icon={MdOpacity} label="Oil Yield" value={chicken.estimated_oil_ml != null ? `${chicken.estimated_oil_ml} ml` : '--'} />
            <DetailStat
              icon={MdHealthAndSafety}
              label="Market Ready"
              value={chicken.market_ready ? 'Yes' : 'No'}
              tone={chicken.market_ready ? 'good' : 'default'}
            />
          </div>

          {chicken.care_tips && (
            <div className="p-3 rounded-lg bg-[#F8FAF7] border border-[#E5E7EB]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Care Tips</p>
              <p className="text-sm text-[#374151] leading-relaxed">{chicken.care_tips}</p>
            </div>
          )}

          {chicken.recommendation && (
            <div className="p-3 rounded-lg bg-[#E8F5E9] border border-[#E8F5E9]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] mb-1">Recommendation</p>
              <p className="text-sm text-[#374151] leading-relaxed">{chicken.recommendation}</p>
            </div>
          )}

          {chicken.prevention_tips && (
            <div className="p-3 rounded-lg bg-[#FFF6E0] border border-[#F0E2C0]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] mb-1">Prevention Tips</p>
              <p className="text-sm text-[#374151] leading-relaxed">{chicken.prevention_tips}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}