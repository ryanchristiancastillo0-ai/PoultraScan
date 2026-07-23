import {
  MdLocationOn,
  MdGridView,
} from 'react-icons/md';

import { thumbnailSrc } from '../../../utils/thumbnailSrc'

export default function FarmInfoCard({ farmName, location, capacity, imageUrl }) {
  const details = [
    { icon: MdLocationOn, label: 'Location', value: location || '—' },
    {
      icon: MdGridView,
      label: 'Capacity',
      value: capacity != null ? `${Number(capacity).toLocaleString()} Chickens` : '—',
    },
  ];

  return (
    <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col sm:flex-row">
      <div className="w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto relative flex-shrink-0 bg-[#EEF3EF] overflow-hidden group">
        {imageUrl ? (
          <img
            alt={farmName || 'Farm'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={thumbnailSrc(imageUrl)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EEF3EF] to-[#E2ECE4]">
            <svg viewBox="0 0 64 64" className="w-16 h-16 text-[#2F5D3A]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" fill="#E2ECE4" stroke="#2F5D3A" strokeWidth="1.5" />
              <path
                d="M22 40c0-7 4-11 10-11s10 4 10 11"
                stroke="#2F5D3A"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="32" cy="24" r="8" fill="#2F5D3A" />
              <path
                d="M38 21c2-2 5-2 6 0-1 2-4 2-6 0z"
                fill="#F59E0B"
              />
              <circle cx="35" cy="22" r="1.2" fill="#fff" />
            </svg>
          </div>
        )}

        {/* subtle gradient so the badge always reads clearly over any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#2F5D3A] text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm ring-1 ring-black/5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]" />
          </span>
          Active
        </div>
      </div>

      <div className="flex flex-col justify-center w-full p-5 md:p-7">
        <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-bold mb-1.5">Farm</span>
        <h2 className="text-2xl font-bold text-[#111827] mb-5 tracking-tight leading-snug">
          {farmName || 'Unnamed Farm'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {details.map(({ icon: Icon, label, value }, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl p-2.5 -m-2.5 transition-colors hover:bg-[#F7F8F5]"
            >
              <span className="w-10 h-10 rounded-xl bg-[#EEF3EF] text-[#2F5D3A] flex items-center justify-center flex-shrink-0 ring-1 ring-[#2F5D3A]/10">
                <Icon className="text-lg" />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-[11px] text-[#6B7280] uppercase tracking-wide font-semibold">{label}</p>
                <p className="text-[15px] text-[#111827] font-bold mt-0.5 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}