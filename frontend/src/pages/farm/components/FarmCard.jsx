import { MdLocationOn, MdArrowForward, MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';

import { thumbnailSrc } from '../../../utils/thumbnailSrc';

export default function FarmCard({ farm, isActive, onSelectActive, onOpenDetails }) {
  return (
    <div
      className={`group relative bg-white rounded-2xl border overflow-hidden flex flex-col
                  transition-all duration-300 ease-out
                  ${
                    isActive
                      ? 'border-[#14532D] shadow-[0_8px_24px_-8px_rgba(20, 83, 45,0.35)]'
                      : 'border-[#E4ECE7] shadow-card hover:border-[#C9E8D9] hover:shadow-card-hover hover:-translate-y-0.5'
                  }`}
    >
      <button
        onClick={onOpenDetails}
        className="w-full aspect-[16/10] overflow-hidden relative text-left bg-[#E9F4EE]"
        aria-label={`View details for ${farm.farm_name}`}
      >
        {farm.image_url ? (
          <img
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            src={thumbnailSrc(farm.image_url)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E9F4EE] to-[#DCF0E5]">
           <svg viewBox="0 0 64 64" className="w-16 h-16 transition-transform duration-500 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
  {/* backdrop circle */}
  <circle cx="32" cy="32" r="30" fill="#E9F4EE" stroke="#14532D" strokeWidth="1.5" />

  {/* placeholder image frame */}
  <rect x="18" y="20" width="28" height="24" rx="4" stroke="#14532D" strokeWidth="2" fill="none" />

  {/* sun / focus accent */}
  <circle cx="25" cy="27" r="2.5" fill="#14532D" />

  {/* mountain / landscape graphic */}
  <path
    d="M20 39l7.5-8 5.5 6 4-4 7 6"
    stroke="#14532D"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
          </div>
        )}

        {/* subtle bottom gradient for legibility of badges */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#14532D] text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#14532D]" />
          Active
        </div>
        {isActive && (
          <div className="absolute top-3 right-3 bg-[#14532D] text-white text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <MdCheckCircle className="text-xs" />
            Selected
          </div>
        )}
      </button>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-[#10231A] line-clamp-1 tracking-tight">{farm.farm_name}</h3>
          <button
            onClick={onOpenDetails}
            className="text-[#4B6357] hover:text-[#14532D] p-0.5 rounded-md transition-all duration-200 hover:translate-x-0.5"
            aria-label="View farm details"
          >
            <MdArrowForward className="text-lg" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-[#4B6357] mt-1.5">
          <MdLocationOn className="text-base text-[#718279] flex-shrink-0" />
          <span className="line-clamp-1">{farm.location || 'No location specified'}</span>
        </div>

        <div className="mt-5 pt-4 border-t border-[#E4ECE7] flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#4B6357] uppercase tracking-wide font-semibold">Capacity</span>
            <span className="text-sm font-bold text-[#10231A] tabular-nums">
              {Number(farm.capacity)?.toLocaleString() || '0'}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectActive();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-[#E9F4EE] text-[#14532D]'
                : 'bg-[#F7FAF8] text-[#4B6357] hover:text-[#10231A] hover:bg-[#E4ECE7]'
            }`}
          >
            {isActive ? (
              <>
                <MdCheckCircle className="text-sm" />
                Active Farm
              </>
            ) : (
              <>
                <MdRadioButtonUnchecked className="text-sm" />
                Select Farm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}