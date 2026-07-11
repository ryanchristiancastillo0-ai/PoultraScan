import {
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';

export default function Pagination({ page, hasMore, onPrev, onNext, count }) {
  return (
    <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
      <span className="text-[#9CA3AF] text-xs">Page {page} • {count} results</span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F7F8F5] transition-colors disabled:opacity-40"
        >
          <MdChevronLeft className="text-lg" />
        </button>
        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2F5D3A] text-white text-xs font-semibold">
          {page}
        </span>
        <button
          onClick={onNext}
          disabled={!hasMore}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F7F8F5] transition-colors disabled:opacity-40"
        >
          <MdChevronRight className="text-lg" />
        </button>
      </div>
    </div>
  );
}