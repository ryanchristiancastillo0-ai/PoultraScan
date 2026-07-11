import {
  MdClose,
  MdErrorOutline,
} from 'react-icons/md';

export default function DeleteFarmModal({ farmName, onClose, onConfirm, deleting, error }) {
  return (
    <div className="fixed inset-0 z-[60] bg-[#111827]/50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden border border-[#E5E7EB]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-[15px] font-bold text-[#111827]">Delete Farm</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-[#F7F8F5] text-[#6B7280] transition-colors"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#FEE2E2] border border-[#FECACA]">
            <MdErrorOutline className="text-[#DC2626] text-lg flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#991B1B] leading-relaxed">
              Are you sure you want to delete <span className="font-bold">{farmName}</span>? This cannot be undone,
              and all scan history tied to this farm will no longer be accessible.
            </p>
          </div>

          {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm font-semibold text-[#111827] hover:bg-[#F7F8F5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#DC2626] text-white text-sm font-semibold hover:bg-[#B91C1C] transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Farm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}