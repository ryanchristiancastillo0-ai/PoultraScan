import { MdEdit, MdDelete } from 'react-icons/md';
import { formatDateTime } from '../../../utils/formatDateTime';

export default function EntryCard({ entry, onEdit, onDelete }) {
  const { date, time } = formatDateTime(entry.created_at);
  const wasEdited = entry.updated_at && entry.updated_at !== entry.created_at;

  const created = new Date(entry.created_at);
  const day = created.getDate();
  const month = created.toLocaleDateString(undefined, { month: 'short' });

  return (
    <>
      {/* Date tab — sits on the timeline, to the left of the card */}
      <div className="absolute -left-14 sm:-left-[72px] top-3 w-11 sm:w-14 flex flex-col items-center">
        <div className="w-11 sm:w-14 rounded-xl bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(27,29,27,0.05)] flex flex-col items-center py-1.5 sm:py-2">
          <span className="font-journal text-lg sm:text-xl font-semibold text-[#1B1D1B] leading-none">
            {day}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] mt-0.5">
            {month}
          </span>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#2E7D32] ring-4 ring-[#F8FAF7] mt-2" />
      </div>

      <div className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#2E7D32]/40 hover:shadow-[0_8px_24px_-8px_rgba(46,125,50,0.15)] transition-all duration-200">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-journal text-base font-semibold text-[#1B1D1B] leading-snug truncate">
                {entry.title}
              </h3>
              <p className="text-[11px] text-[#9CA3AF] mt-1 font-medium uppercase tracking-wide">
                {time}
                {wasEdited && <span className="text-[#9CA3AF] normal-case"> · edited</span>}
              </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={() => onEdit(entry)}
                aria-label="Edit entry"
                className="p-2 text-[#9CA3AF] hover:text-[#2E7D32] hover:bg-[#2E7D32]/10 rounded-lg transition-colors"
              >
                <MdEdit className="text-base" />
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                aria-label="Delete entry"
                className="p-2 text-[#9CA3AF] hover:text-[#D32F2F] hover:bg-[#D32F2F]/10 rounded-lg transition-colors"
              >
                <MdDelete className="text-base" />
              </button>
            </div>
          </div>
          <p className="text-sm text-[#6B7280] leading-relaxed mt-3 whitespace-pre-wrap line-clamp-3">
            {entry.content}
          </p>
        </div>
      </div>
    </>
  );
}