import {MdClose} from 'react-icons/md'
export default function InfoModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <style>{`
        @keyframes info-backdrop { from { opacity: 0; } to { opacity: 1; } }
        @keyframes info-pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .info-backdrop { animation: info-backdrop 0.2s ease-out; }
        .info-pop { animation: info-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>

      <div className="info-backdrop absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="info-pop relative w-full max-w-lg max-h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] flex-shrink-0">
          <h2 className="text-base font-bold text-[#111827]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full text-[#9CA3AF] hover:bg-[#F7F8F5] hover:text-[#111827] transition-colors"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto text-sm text-[#4B5563] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
