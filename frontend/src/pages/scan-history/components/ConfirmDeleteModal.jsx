import { MdWarning, MdClose } from 'react-icons/md';

export default function ConfirmDeleteModal({ open, onCancel, onConfirm, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1.5 text-[#9CA3AF] hover:text-[#1B1D1B] hover:bg-[#F8FAF7] rounded-md transition-colors"
        >
          <MdClose className="text-lg" />
        </button>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#FFEBEE] flex items-center justify-center">
            <MdWarning className="text-2xl text-[#D32F2F]" />
          </div>
          <h2 className="text-base font-semibold text-[#1B1D1B]">Delete this scan?</h2>
          <p className="text-sm text-[#6B7280]">
            This will permanently remove the scan and its results. This action can't be undone.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-[#E5E7EB] text-sm font-semibold text-[#1B1D1B] hover:bg-[#F8FAF7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-[#D32F2F] text-sm font-semibold text-white hover:bg-[#D32F2F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}