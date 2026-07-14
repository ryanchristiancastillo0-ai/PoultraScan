import { MdLocationOn, MdArrowForward, MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';

import { thumbnailSrc } from '../../../utils/thumbnailSrc';

export default function FarmCard({ farm, isActive, onSelectActive, onOpenDetails }) {
  return (
    <div
      className={`group relative bg-white rounded-xl border overflow-hidden flex flex-col
                  transition-all duration-300 ease-out
                  ${
                    isActive
                      ? 'border-[#2F5D3A] shadow-[0_4px_20px_rgba(47,93,58,0.12)]'
                      : 'border-[#E5E7EB] shadow-sm hover:border-[#D1D5DB] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5'
                  }`}
    >
      <button
        onClick={onOpenDetails}
        className="w-full aspect-[16/10] overflow-hidden relative text-left bg-[#EEF3EF]"
        aria-label={`View details for ${farm.farm_name}`}
      >
        {farm.image_url ? (
          <img
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            src={thumbnailSrc(farm.image_url)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EEF3EF] to-[#E4ECE6]">
            <svg viewBox="0 0 64 64" className="w-16 h-16 transition-transform duration-500 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* backdrop circle */}
              <circle cx="32" cy="32" r="30" fill="#EEF3EF" stroke="#2F5D3A" strokeWidth="1.5" />

              {/* tail feather */}
              <path d="M16 34c-4-2-6-6-5-10 3 1 6 4 7 8z" fill="#2F5D3A" />

              {/* body */}
              <ellipse cx="30" cy="38" rx="14" ry="11" fill="#2F5D3A" />

              {/* wing */}
              <path d="M22 33c3-1 7-1 9 2-3 3-7 3-10 1z" fill="#274d31" />

              {/* head */}
              <circle cx="41" cy="24" r="8" fill="#2F5D3A" />

              {/* comb */}
              <path
                d="M36 17c1-3 2-3 2-1-1-3 1-4 2-1 0-3 2-3 2 0-1-2 1-3 1 0"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />

              {/* beak */}
              <path d="M48 24c2-1 4-1 5 1-1 2-3 2-5 1z" fill="#F59E0B" />

              {/* wattle */}
              <path d="M43 29c1 2 1 4-0.5 5-1.5-1-1.5-3-0.5-5z" fill="#DC2626" />

              {/* eye */}
              <circle cx="43" cy="22" r="1.2" fill="#fff" />

              {/* legs */}
              <path d="M26 48v6M34 48v6" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              <path d="M23 54h6M31 54h6" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* subtle bottom gradient for legibility of badges */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#2F5D3A] text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          Active
        </div>
        {isActive && (
          <div className="absolute top-3 right-3 bg-[#2F5D3A] text-white text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <MdCheckCircle className="text-xs" />
            Selected
          </div>
        )}
      </button>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-[#111827] line-clamp-1 tracking-tight">{farm.farm_name}</h3>
          <button
            onClick={onOpenDetails}
            className="text-[#6B7280] hover:text-[#2F5D3A] p-0.5 rounded-md transition-all duration-200 hover:translate-x-0.5"
            aria-label="View farm details"
          >
            <MdArrowForward className="text-lg" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-[#6B7280] mt-1.5">
          <MdLocationOn className="text-base text-[#9CA3AF] flex-shrink-0" />
          <span className="line-clamp-1">{farm.location || 'No location specified'}</span>
        </div>

        <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#6B7280] uppercase tracking-wide font-semibold">Capacity</span>
            <span className="text-sm font-bold text-[#111827] tabular-nums">
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
                ? 'bg-[#EEF3EF] text-[#2F5D3A]'
                : 'bg-[#F7F8F5] text-[#6B7280] hover:text-[#111827] hover:bg-[#E5E7EB]'
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