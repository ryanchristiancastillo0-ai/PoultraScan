import { useState } from 'react';
import { MdClose, MdErrorOutline } from 'react-icons/md';

export default function EntryFormModal({ initialData, onClose, onSubmit, saving }) {
  const isEdit = Boolean(initialData);
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [formError, setFormError] = useState(null);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setFormError('Title and content are both required.');
      return;
    }
    setFormError(null);
    try {
      await onSubmit({ title: title.trim(), content: content.trim() });
      onClose();
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
        .font-journal { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }
        @keyframes modalRise {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-rise { animation: modalRise 0.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .ruled-paper {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 27px,
            #E5E7EB 28px
          );
          background-position: 0 4px;
        }
      `}</style>

      <div className="absolute inset-0 bg-[#1B1D1B]/60 backdrop-blur-sm" onClick={onClose} />

      <div className="modal-rise relative w-full max-w-xl bg-white rounded-2xl shadow-[0_24px_64px_-12px_rgba(27,29,27,0.2)] overflow-hidden border border-[#E5E7EB]">
        <div className="flex items-center justify-between px-6 pt-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
            {isEdit ? 'Editing entry' : today}
          </span>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-[#9CA3AF] hover:text-[#1B1D1B] hover:bg-[#F8FAF7] transition-colors"
            aria-label="Close"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="px-6 pt-2 pb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled entry"
            autoFocus
            className="font-journal w-full text-2xl font-semibold text-[#1B1D1B] placeholder-[#9CA3AF] outline-none bg-transparent border-b-2 border-transparent focus:border-[#2E7D32]/40 pb-2 mb-4 transition-colors"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your observation, decision, or insight..."
            rows={7}
            className="ruled-paper w-full px-0 text-sm text-[#1B1D1B] placeholder-[#9CA3AF] outline-none bg-transparent resize-none leading-[28px]"
          />

          {formError && (
            <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-[#FFEBEE] border border-[#F3C9C9] mt-2">
              <MdErrorOutline className="text-[#D32F2F] text-base flex-shrink-0" />
              <p className="text-sm text-[#D32F2F]">{formError}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6 pt-2 border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border-2 border-[#E5E7EB] bg-white text-sm font-semibold text-[#1B1D1B] hover:bg-[#F8FAF7] active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-11 rounded-xl bg-[#2E7D32] text-sm font-semibold text-white shadow-[0_8px_20px_-4px_rgba(46,125,50,0.35)] hover:bg-[#276C2A] hover:shadow-[0_12px_24px_-4px_rgba(46,125,50,0.45)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}