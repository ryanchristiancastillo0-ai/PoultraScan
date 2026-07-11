import { useState } from 'react';
import { HealthBreakdown, StatusBadge, MarketReadyBar, ConfirmDeleteModal } from './index';
import {
  MdVisibility,
  MdDelete,
  MdHourglassEmpty,
} from 'react-icons/md';
import { formatDateTime } from '../../../utils/formatDateTime';
import { thumbnailSrc } from '../../../utils/thumbnailSrc';



export default function ScanCard({ scan, onDelete, onView }) {
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
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 sm:p-4 flex flex-col xs:flex-row gap-3">
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E5E7EB] bg-[#F7F8F5] flex items-center justify-center flex-shrink-0">
          {src ? (
            <img className="w-full h-full object-cover" src={src} alt="Scan thumbnail" />
          ) : (
            <MdHourglassEmpty className="text-[#9CA3AF] text-xl animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-1.5">
            <div className="min-w-0 max-w-full">
              <p className="font-semibold text-[#111827] text-sm truncate">{scan.farm_name}</p>
              <p className="text-xs text-[#9CA3AF] truncate">{scan.location} • {date}, {time}</p>
            </div>
            <div className="flex-shrink-0">
              <StatusBadge status={scan.status} />
            </div>
          </div>

          <HealthBreakdown healthy={scan.healthy_count} diseased={scan.diseased_count} total={scan.total_detected} />

          <div className="mt-2">
            <MarketReadyBar ready={scan.market_ready_count} total={scan.total_detected} />
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => onView(scan)}
              disabled={scan.status === 'PROCESSING'}
              className="flex-1 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#2F5D3A] hover:bg-[#EAF2EC] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <MdVisibility className="text-sm" /> View
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="flex-1 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#DC2626] hover:bg-[#FBEBEB] transition-colors flex items-center justify-center gap-1"
            >
              <MdDelete className="text-sm" /> Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </>
  );
}