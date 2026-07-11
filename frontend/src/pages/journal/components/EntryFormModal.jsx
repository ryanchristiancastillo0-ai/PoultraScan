import {useState} from 'react'
import { MdClose, MdAdd,MdEdit,MdErrorOutline,} from 'react-icons/md';
export default function EntryFormModal({ initialData, onClose, onSubmit, saving }) {
  const isEdit = Boolean(initialData);
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [formError, setFormError] = useState(null);

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
      <div className="absolute inset-0 bg-[#0b1c30]/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-[0_24px_64px_-12px_rgba(11,28,48,0.35)] overflow-hidden animate-[fadeIn_0.15s_ease-out]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eef1fa] bg-gradient-to-r from-[#f8f9ff] to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#006948]/10 flex items-center justify-center flex-shrink-0">
              {isEdit ? (
                <MdEdit className="text-[#006948] text-lg" />
              ) : (
                <MdAdd className="text-[#006948] text-lg" />
              )}
            </div>
            <h2 className="text-base font-bold text-[#0b1c30]">
              {isEdit ? 'Edit Entry' : 'New Entry'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8a958e] hover:text-[#0b1c30] hover:bg-[#f0f2fa] transition-colors"
            aria-label="Close"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#565e74] uppercase tracking-wide mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What did you observe?"
              className="w-full h-11 px-3.5 rounded-xl border-2 border-[#e5eeff] bg-[#f8f9ff]/60 text-sm text-[#0b1c30] placeholder-[#8a958e] outline-none focus:border-[#006948] focus:bg-white focus:ring-4 focus:ring-[#006948]/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#565e74] uppercase tracking-wide mb-2">
              Notes
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your observation, decision, or insight..."
              rows={5}
              className="w-full px-3.5 py-3 rounded-xl border-2 border-[#e5eeff] bg-[#f8f9ff]/60 text-sm text-[#0b1c30] placeholder-[#8a958e] outline-none focus:border-[#006948] focus:bg-white focus:ring-4 focus:ring-[#006948]/10 transition-all resize-none leading-relaxed"
            />
          </div>

          {formError && (
            <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-red-50 border border-red-100">
              <MdErrorOutline className="text-red-500 text-base flex-shrink-0" />
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border-2 border-[#e5eeff] bg-white text-sm font-semibold text-[#0b1c30] hover:bg-[#f8f9ff] active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#006948] to-[#00855d] text-sm font-semibold text-white shadow-[0_8px_20px_-4px_rgba(0,105,72,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(0,105,72,0.5)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}