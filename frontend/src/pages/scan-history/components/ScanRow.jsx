import { useState } from 'react';
import { thumbnailSrc } from '../../../utils/thumbnailSrc';
import {
  MdVisibility,
  MdDelete,
  MdHourglassEmpty,
} from 'react-icons/md';
import { formatDateTime } from '../../../utils/formatDateTime';
import { HealthBreakdown, MarketReadyBar, StatusBadge, ConfirmDeleteModal } from './index';

export default function ScanRow({ scan, onDelete, onView }) {
  const { date, time } = formatDateTime(scan.started_at);
  const src = thumbnailSrc(scan.thumbnail_url);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await onDelete(scan.summary_id);
    setDeleting(false);
    setConfirmOpen(false);
  };

  return (
    <>
      <tr className="hover:bg-[#F7F8F5] transition-colors group">
        <td className="py-4 pl-2">
          <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#E5E7EB] bg-[#F7F8F5] flex items-center justify-center flex-shrink-0">
            {src ? (
              <img className="w-full h-full object-cover" src={src} alt="Scan thumbnail" />
            ) : (
              <MdHourglassEmpty className="text-[#9CA3AF] text-lg animate-pulse" />
            )}
          </div>
        </td>
        <td className="py-4 px-3 whitespace-nowrap">
          <p className="font-medium text-[#111827] text-sm">{date}</p>
          <p className="text-xs text-[#9CA3AF]">{time}</p>
        </td>
        <td className="py-4 px-3 max-w-[160px]">
          <p className="font-medium text-[#111827] text-sm truncate">{scan.farm_name}</p>
          <p className="text-xs text-[#9CA3AF] truncate">{scan.location}</p>
        </td>
        <td className="py-4 px-3">
          <HealthBreakdown healthy={scan.healthy_count} diseased={scan.diseased_count} total={scan.total_detected} />
        </td>
        <td className="py-4 px-3">
          <MarketReadyBar ready={scan.market_ready_count} total={scan.total_detected} />
        </td>
        <td className="py-4 px-3 whitespace-nowrap">
          <StatusBadge status={scan.status} />
        </td>
        <td className="py-4 pr-2 text-right">
          <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onView(scan)}
              disabled={scan.status === 'PROCESSING'}
              className="p-1.5 text-[#6B7280] hover:text-[#2F5D3A] hover:bg-[#EAF2EC] rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MdVisibility className="text-lg" />
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="p-1.5 text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FBEBEB] rounded-md transition-colors"
            >
              <MdDelete className="text-lg" />
            </button>
          </div>
        </td>
      </tr>

      <ConfirmDeleteModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </>
  );
}