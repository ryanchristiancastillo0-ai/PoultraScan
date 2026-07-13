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
        <div className="w-11 sm:w-14 rounded-xl bg-white border border-[#eef1fa] shadow-[0_2px_8px_rgba(11,28,48,0.06)] flex flex-col items-center py-1.5 sm:py-2">
          <span className="font-journal text-lg sm:text-xl font-semibold text-[#0b1c30] leading-none">
            {day}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#006948] mt-0.5">
            {month}
          </span>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#006948] ring-4 ring-[#f8f9ff] mt-2" />
      </div>

      <div className="group bg-white rounded-2xl border border-[#eef1fa] hover:border-[#006948]/25 hover:shadow-[0_8px_24px_-8px_rgba(0,105,72,0.15)] transition-all duration-200">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-journal text-base font-semibold text-[#0b1c30] leading-snug truncate">
                {entry.title}
              </h3>
              <p className="text-[11px] text-[#8a958e] mt-1 font-medium uppercase tracking-wide">
                {time}
                {wasEdited && <span className="text-[#c4cdd8] normal-case"> · edited</span>}
              </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={() => onEdit(entry)}
                aria-label="Edit entry"
                className="p-2 text-[#8a958e] hover:text-[#006948] hover:bg-[#006948]/8 rounded-lg transition-colors"
              >
                <MdEdit className="text-base" />
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                aria-label="Delete entry"
                className="p-2 text-[#8a958e] hover:text-[#EF4444] hover:bg-[#EF4444]/8 rounded-lg transition-colors"
              >
                <MdDelete className="text-base" />
              </button>
            </div>
          </div>
          <p className="text-sm text-[#3d4a42] leading-relaxed mt-3 whitespace-pre-wrap line-clamp-3">
            {entry.content}
          </p>
        </div>
      </div>
    </>
  );
}