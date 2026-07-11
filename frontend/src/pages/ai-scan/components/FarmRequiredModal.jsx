import {
  MdClose,
  MdOutlineAgriculture,
} from 'react-icons/md';

export default function FarmRequiredModal({ onClose, onNavigate }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-xl max-w-sm w-full p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-[#9CA3AF] hover:bg-[#F7F8F5] hover:text-[#111827] transition-colors"
          aria-label="Close"
        >
          <MdClose className="text-lg" />
        </button>

        <span className="w-14 h-14 rounded-full bg-[#EAF2EC] flex items-center justify-center mx-auto mb-4">
          <MdOutlineAgriculture className="text-2xl text-[#2F5D3A]" />
        </span>

        <h2 className="text-lg font-bold text-[#111827]">Please select a farm</h2>
        <p className="text-sm text-[#6B7280] mt-1.5 leading-relaxed">
          This farm couldn't be found — it may have been removed. Please select an existing farm
          or create a new one before scanning.
        </p>

        <div className="grid grid-cols-1 gap-2.5 mt-6">
          <button
            onClick={onNavigate}
            className="w-full py-3 rounded-lg bg-[#2F5D3A] text-white font-semibold hover:bg-[#254A2E] transition-colors shadow-sm"
          >
            Go to My Farms
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-white border border-[#E5E7EB] text-[#111827] font-semibold hover:bg-[#F7F8F5] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}