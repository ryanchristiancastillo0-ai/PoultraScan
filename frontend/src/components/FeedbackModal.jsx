import {useState} from 'react'
import { MdClose, MdEmail, MdCheckCircle } from 'react-icons/md';
import { FeedbackAPI } from '../api/feedbackApi';
export default function FeedbackModal({ isOpen, onClose }) {
  const [message, setMessage] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setMessage('');
    setSenderEmail('');
    setError(null);
    setIsSent(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await FeedbackAPI.send({
        senderEmail: senderEmail,
        message: message,
      });
      setIsSent(true);
    } catch (err) {
      setError('Something went wrong sending your feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#10231A]/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto no-scrollbar bg-white rounded-2xl shadow-xl border border-[#E4ECE7] p-6 sm:p-8 animate-[fadeIn_0.2s_ease-out]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#4B6357] hover:bg-[#F7FAF8] hover:text-[#10231A] transition-colors"
          aria-label="Close feedback form"
        >
          <MdClose className="text-xl" />
        </button>

        {isSent ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-14 h-14 bg-[#E9F4EE] text-[#14532D] rounded-full flex items-center justify-center mb-4">
              <MdCheckCircle className="text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-[#10231A] mb-1.5">Feedback Sent</h3>
            <p className="text-sm text-[#4B6357] mb-6">
              Thanks for helping us improve PoultraScan AI.
            </p>
            <button
              onClick={handleClose}
              className="w-full h-11 bg-gradient-to-r from-[#14532D] to-[#166534] hover:from-[#166534] hover:to-[#052E16] text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-9 h-9 rounded-lg bg-[#E9F4EE] text-[#14532D] flex items-center justify-center flex-shrink-0">
                <MdEmail className="text-lg" />
              </span>
              <h3 className="text-lg font-bold text-[#10231A]">Send Feedback</h3>
            </div>
            <p className="text-sm text-[#4B6357] mb-6">
              Found a bug or have a suggestion? Let us know below.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="text-sm text-[#EF4444] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-4 py-2">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#4B6357] uppercase tracking-wide mb-1.5 block">
                  Your Email <span className="normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 rounded-lg border border-[#E4ECE7] px-3.5 text-sm text-[#10231A] outline-none focus:border-[#14532D] focus:ring-4 focus:ring-[#14532D]/10 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4B6357] uppercase tracking-wide mb-1.5 block">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  className="w-full rounded-lg border border-[#E4ECE7] px-3.5 py-3 text-sm text-[#10231A] outline-none focus:border-[#14532D] focus:ring-4 focus:ring-[#14532D]/10 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-[#14532D] to-[#166534] hover:from-[#166534] hover:to-[#052E16] active:scale-[0.98] text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50 mt-1"
              >
                {loading ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}