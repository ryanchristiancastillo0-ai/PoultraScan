import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdClose,
  MdCameraAlt,
  MdUpload,
  MdCheckCircle,
  MdArrowForward,
  MdWarningAmber,
  MdHealthAndSafety,
} from 'react-icons/md';
import { useQuickScan } from '../hooks/useQuickScan';
import {CameraCaptureModal} from '../pages/ai-scan/components/index'

const SEVERITY_STYLES = {
  NONE:    { bg: 'bg-[#EAF2EC]', text: 'text-[#2F5D3A]', dot: 'bg-[#2F5D3A]' },
  LOW:     { bg: 'bg-[#EAF2EC]', text: 'text-[#2F5D3A]', dot: 'bg-[#2F5D3A]' },
  MEDIUM:  { bg: 'bg-[#FBF4E6]', text: 'text-[#B45309]', dot: 'bg-[#D97706]' },
  HIGH:    { bg: 'bg-[#FBEBEB]', text: 'text-[#B91C1C]', dot: 'bg-[#DC2626]' },
  UNKNOWN: { bg: 'bg-[#F7F8F5]', text: 'text-[#6B7280]', dot: 'bg-[#9CA3AF]' },
};

export default function QuickScanModal({ isOpen, onClose, farmId }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const { status, summary, error, runQuickScan, reset } = useQuickScan(farmId);

  if (!isOpen) return null;

  const handleClose = () => {
    setCameraOpen(false);
    reset();
    onClose();
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) runQuickScan(file, 'UPLOAD');
  };

  const handleCameraCapture = (file) => {
    setCameraOpen(false);
    runQuickScan(file, 'WEBCAM');
  };

  const handleMoreInfo = () => {
    handleClose();
    navigate('/scan'); // TODO: adjust to your actual scan route
  };

  const sev = SEVERITY_STYLES[summary?.topSeverity?.toUpperCase()] || SEVERITY_STYLES.UNKNOWN;

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
        <style>{`
          @keyframes qs-backdrop { from { opacity: 0; } to { opacity: 1; } }
          @keyframes qs-sheet-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          @keyframes qs-pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .qs-backdrop { animation: qs-backdrop 0.2s ease-out; }
          .qs-sheet { animation: qs-sheet-up 0.28s cubic-bezier(0.16, 1, 0.3, 1); }
          @media (min-width: 640px) { .qs-sheet { animation: qs-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1); } }
        `}</style>

        <div className="qs-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

        <div className="qs-sheet relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 pb-8 sm:pb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[#111827]">Quick Scan</h2>
            <button
              onClick={handleClose}
              aria-label="Close"
              className="p-1.5 rounded-full text-[#9CA3AF] hover:bg-[#F7F8F5] hover:text-[#111827] transition-colors"
            >
              <MdClose className="text-lg" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelected}
            className="hidden"
          />

          {status === 'idle' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCameraOpen(true)}
                className="flex flex-col items-center gap-2 py-6 rounded-xl bg-[#2F5D3A] text-white font-semibold hover:bg-[#254A2E] active:scale-[0.97] transition-all shadow-sm"
              >
                <MdCameraAlt className="text-2xl" />
                <span className="text-sm">Capture</span>
              </button>
              <button
                onClick={handleUploadClick}
                className="flex flex-col items-center gap-2 py-6 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] font-semibold hover:bg-[#F7F8F5] active:scale-[0.97] transition-all"
              >
                <MdUpload className="text-2xl text-[#2F5D3A]" />
                <span className="text-sm">Upload</span>
              </button>
            </div>
          )}

          {status === 'processing' && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-10 h-10 border-2 border-[#E5E7EB] border-t-[#2F5D3A] rounded-full animate-spin" />
              <p className="text-sm text-[#6B7280] font-medium">Analyzing flock...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="flex items-start gap-2 bg-[#FBEBEB] border border-[#F3C9C9] rounded-xl p-3 w-full">
                <MdWarningAmber className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#B91C1C]">{error}</p>
              </div>
              <button
                onClick={reset}
                className="text-sm font-semibold text-[#2F5D3A] hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {status === 'done' && summary && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#EAF2EC] border border-[#CFE2D4]">
                <MdCheckCircle className="text-[#2F5D3A] text-lg flex-shrink-0" />
                <span className="text-sm font-semibold text-[#2F5D3A]">
                  {summary.chickenCount} {summary.chickenCount === 1 ? 'chicken' : 'chickens'} scanned · {summary.healthyCount}/{summary.chickenCount} healthy
                </span>
              </div>

              {summary.topDisease && (
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${sev.bg}`}>
                  <div className="flex items-center gap-2">
                    <MdHealthAndSafety className={`text-lg ${sev.text}`} />
                    <span className={`text-sm font-bold ${sev.text}`}>{summary.topDisease}</span>
                  </div>
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${sev.text}`}>
                      {summary.topSeverity}
                    </span>
                  </span>
                </div>
              )}

              <button
                onClick={handleMoreInfo}
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#2F5D3A] text-white font-semibold hover:bg-[#254A2E] active:scale-[0.98] transition-all shadow-sm"
              >
                More Info
                <MdArrowForward className="text-lg" />
              </button>
            </div>
          )}
        </div>
      </div>

      {cameraOpen && (
        <CameraCaptureModal
          onCapture={handleCameraCapture}
          onClose={() => setCameraOpen(false)}
        />
      )}
    </>
  );
}