import {useState} from 'react'
import {thumbnailSrc} from '../../../utils/thumbnailSrc'
import {SeverityBadge,DetailStat} from './index'
import {MdChevronRight,MdHealthAndSafety,MdScale,MdOpacity,MdOutlinePets,} from 'react-icons/md';

export default function ChickenPredictionCard({ chicken }) {
  const [expanded, setExpanded] = useState(false);
  const src = thumbnailSrc(chicken.image_url);

  return (
    <div className="border border-[#E4ECE7] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 p-3 hover:bg-[#F7FAF8] transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E4ECE7] bg-[#F7FAF8] flex items-center justify-center flex-shrink-0">
          {src ? (
            <img src={src} alt="" className="w-full h-full object-cover" />
          ) : (
            <MdOutlinePets className="text-[#718279] text-lg" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[#10231A]">
              Chicken #{chicken.tracking_id ?? chicken.detected_chicken_id}
            </p>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              chicken.healthy ? 'bg-[#E9F4EE] text-[#14532D]' : 'bg-[#FEF2F2] text-[#EF4444]'
            }`}>
              {chicken.disease}
            </span>
            <SeverityBadge severity={chicken.severity} />
          </div>
          <p className="text-xs text-[#4B6357] mt-0.5">
            {chicken.breed || 'Unknown breed'} • {chicken.confidence != null ? `${chicken.confidence}% confidence` : '--'}
          </p>
        </div>
        <MdChevronRight className={`text-[#718279] text-lg flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="p-3 sm:p-4 pt-0 sm:pt-0 flex flex-col gap-3 border-t border-[#E4ECE7] mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-3">
            <DetailStat icon={MdScale} label="Weight" value={chicken.estimated_weight != null ? `${chicken.estimated_weight} kg` : '--'} />
            <DetailStat icon={MdOpacity} label="Estimated Oil Yield" value={chicken.estimated_oil_ml != null ? `~${Math.round(chicken.estimated_oil_ml)} mL` : '--'} />
            <DetailStat
              icon={MdHealthAndSafety}
              label="Market Ready"
              value={chicken.market_ready ? 'Yes' : 'No'}
              tone={chicken.market_ready ? 'good' : 'default'}
            />
          </div>

          {chicken.care_tips && (
            <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#E4ECE7]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#4B6357] mb-1">Care Tips</p>
              <p className="text-sm text-[#2C4238] leading-relaxed">{chicken.care_tips}</p>
            </div>
          )}

          {chicken.recommendation && (
            <div className="p-3 rounded-lg bg-[#E9F4EE] border border-[#E9F4EE]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#14532D] mb-1">Recommendation</p>
              <p className="text-sm text-[#2C4238] leading-relaxed">{chicken.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}