
import {MdClose,} from 'react-icons/md';

export default function AvatarModal({ previewUrl, onSave, onCancel, saving, error }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#111827]/50" onClick={saving ? undefined : onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center">
        <button
          onClick={onCancel}
          disabled={saving}
          className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827] disabled:opacity-40 transition-colors"
          aria-label="Close"
        >
          <MdClose className="text-xl" />
        </button>

        <h3 className="text-base font-semibold text-[#111827] mb-4 self-start">Update Profile Photo</h3>

        <div className="w-40 h-40 rounded-full overflow-hidden ring-1 ring-[#E5E7EB] bg-[#F7F8F5] flex items-center justify-center">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>

        {error && (
          <p className="text-xs text-[#DC2626] mt-3 text-center">{error}</p>
        )}

        <div className="flex gap-3 mt-6 w-full">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 bg-white text-[#374151] border border-[#D1D5DB] px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#F9FAFB] transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex-1 bg-[#2F5D3A] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#254A2E] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}