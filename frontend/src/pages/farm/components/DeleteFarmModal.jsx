import {
  MdClose,
  MdErrorOutline,
} from 'react-icons/md';

export default function DeleteFarmModal({ farmName, onClose, onConfirm, deleting, error }) {
  return (
    <div className="fixed inset-0 z-[60] bg-[#10231A]/50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-modal overflow-hidden border border-[#E4ECE7]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4ECE7]">
          <h3 className="text-[15px] font-bold text-[#10231A]">Delete Farm</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-[#F7FAF8] text-[#4B6357] transition-colors"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
            <MdErrorOutline className="text-[#EF4444] text-lg flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#EF4444] leading-relaxed">
              Are you sure you want to delete <span className="font-bold">{farmName}</span>? This cannot be undone,
              and all scan history tied to this farm will no longer be accessible.
            </p>
          </div>

          {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E4ECE7] text-sm font-semibold text-[#10231A] hover:bg-[#F7FAF8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#EF4444] text-white text-sm font-semibold hover:bg-[#DC2626] transition-colors disabled:opacity-50 shadow-md shadow-[#EF4444]/25"
            >
              {deleting ? 'Deleting...' : 'Delete Farm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}