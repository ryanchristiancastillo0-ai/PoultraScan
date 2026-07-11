import { MdEdit, MdDelete, MdOutlineNotes,} from 'react-icons/md';
import {formatDateTime} from '../../../utils/formatDateTime'

export default function EntryCard({ entry, onEdit, onDelete }) {
  const { date, time } = formatDateTime(entry.created_at);
  const wasEdited = entry.updated_at && entry.updated_at !== entry.created_at;

  return (
    <div className="group bg-white rounded-2xl border border-[#eef1fa] hover:border-[#006948]/25 hover:shadow-[0_8px_24px_-8px_rgba(0,105,72,0.15)] transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006948]/10 to-[#00855d]/5 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:from-[#006948]/15 group-hover:to-[#00855d]/10 transition-colors">
              <MdOutlineNotes className="text-[#006948] text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[#0b1c30] leading-tight truncate">{entry.title}</h3>
              <p className="text-xs text-[#8a958e] mt-1 font-medium">
                {date} <span className="text-[#c4cdd8]">·</span> {time}
                {wasEdited && <span className="text-[#c4cdd8]"> · edited</span>}
              </p>
            </div>
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
        <p className="text-sm text-[#3d4a42] leading-relaxed mt-3.5 whitespace-pre-wrap line-clamp-3 pl-[52px]">
          {entry.content}
        </p>
      </div>
    </div>
  );
}