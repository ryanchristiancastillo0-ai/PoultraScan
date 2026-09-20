import {
  MdClose,
  MdOutlineAgriculture,
} from 'react-icons/md';

export default function FarmRequiredModal({ onClose, onNavigate }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-[#E4ECE7] shadow-xl max-w-sm w-full p-6 text-center max-h-[90dvh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-[#718279] hover:bg-[#F7FAF8] hover:text-[#10231A] transition-colors"
          aria-label="Close"
        >
          <MdClose className="text-lg" />
        </button>

        <span className="w-14 h-14 rounded-full bg-[#E9F4EE] flex items-center justify-center mx-auto mb-4">
          <MdOutlineAgriculture className="text-2xl text-[#14532D]" />
        </span>

        <h2 className="text-lg font-bold text-[#10231A]">Please select a farm</h2>
        <p className="text-sm text-[#4B6357] mt-1.5 leading-relaxed">
          This farm couldn't be found — it may have been removed. Please select an existing farm
          or create a new one before scanning.
        </p>

        <div className="grid grid-cols-1 gap-2.5 mt-6">
          <button
            onClick={onNavigate}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#14532D] to-[#166534] text-white font-semibold hover:from-[#166534] hover:to-[#052E16] transition-all shadow-sm"
          >
            Go to My Farms
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-white border border-[#E4ECE7] text-[#10231A] font-semibold hover:bg-[#F7FAF8] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}