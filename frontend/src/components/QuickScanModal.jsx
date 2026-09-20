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
  MdOutlineAgriculture,
} from 'react-icons/md';
import { useQuickScan } from '../hooks/useQuickScan';
import {CameraCaptureModal} from '../pages/ai-scan/components/index'
import {SEVERITY_STYLES} from '../constant/severity'
import {PoultraScanLoader} from './ui'


export default function QuickScanModal({ isOpen, onClose, farmId }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const { status, summary, error, runQuickScan, reset } = useQuickScan(farmId);

  if (!isOpen) return null;

  // Guard: no active/valid farm selected
  const hasFarm = farmId !== null && farmId !== undefined && farmId !== '';

  const handleClose = () => {
    setCameraOpen(false);
    reset();
    onClose();
  };

  const handleUploadClick = () => {
    if (!hasFarm) return;
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!hasFarm) return;
    if (file) runQuickScan(file, 'UPLOAD');
  };

  const handleCaptureClick = () => {
    if (!hasFarm) return;
    setCameraOpen(true);
  };

  const handleCameraCapture = (file) => {
    setCameraOpen(false);
    if (!hasFarm) return;
    runQuickScan(file, 'WEBCAM');
  };

  const handleMoreInfo = () => {
    handleClose();
    navigate('/scan'); // TODO: adjust to your actual scan route
  };

  const handleGoToFarms = () => {
    handleClose();
    navigate('/farm'); // TODO: adjust to your actual farm creation/list route
  };

  const sev = SEVERITY_STYLES[summary?.topSeverity?.toUpperCase()] || SEVERITY_STYLES.UNKNOWN;

  // While the camera is open, render ONLY the camera modal — hide the
  // sheet + backdrop entirely instead of stacking both overlays, which
  // was causing the blur bleed-through and squeezed-camera-view bug.
  if (cameraOpen) {
    return (
      <CameraCaptureModal
        onCapture={handleCameraCapture}
        onClose={() => setCameraOpen(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
      

      <div className="qs-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="qs-sheet relative w-full sm:max-w-sm max-h-[92dvh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:pb-5 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#10231A]">Quick Scan</h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="p-1.5 rounded-full text-[#718279] hover:bg-[#F7FAF8] hover:text-[#10231A] transition-colors"
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

        {/* No farm selected — block scanning entirely */}
        {!hasFarm && (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="flex items-start gap-2 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-3 w-full">
              <MdOutlineAgriculture className="text-[#D97706] flex-shrink-0 mt-0.5 text-lg" />
              <p className="text-sm text-[#D97706]">
                Please create a farm first before running a scan.
              </p>
            </div>
            <button
              onClick={handleGoToFarms}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-[#14532D] to-[#166534] text-white font-semibold hover:from-[#166534] hover:to-[#052E16] active:scale-[0.98] transition-all shadow-sm w-full"
            >
              Create a Farm
              <MdArrowForward className="text-lg" />
            </button>
          </div>
        )}

        {hasFarm && status === 'idle' && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCaptureClick}
              className="flex flex-col items-center gap-2 py-6 rounded-xl bg-gradient-to-br from-[#14532D] via-[#166534] to-[#10B981] text-white font-semibold hover:from-[#052E16] hover:via-[#14532D] hover:to-[#166534] active:scale-[0.97] transition-all shadow-md shadow-[#14532D]/25"
            >
              <MdCameraAlt className="text-2xl" />
              <span className="text-sm">Capture</span>
            </button>
            <button
              onClick={handleUploadClick}
              className="flex flex-col items-center gap-2 py-6 rounded-xl bg-white border border-[#E4ECE7] text-[#10231A] font-semibold hover:bg-[#F7FAF8] hover:border-[#9CCFB0] hover:text-[#14532D] active:scale-[0.97] transition-all"
            >
              <MdUpload className="text-2xl text-[#166534]" />
              <span className="text-sm">Upload</span>
            </button>
          </div>
        )}

        {hasFarm && status === 'processing' && (
          <div className="py-10">
            <PoultraScanLoader size={48} label="Analyzing flock..." />
          </div>
        )}

        {hasFarm && status === 'error' && (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="flex items-start gap-2 bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3 w-full">
              <MdWarningAmber className="text-[#EF4444] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
            <button
              onClick={reset}
              className="text-sm font-semibold text-[#14532D] hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {hasFarm && status === 'done' && summary && (
          <div className="flex flex-col gap-4">
<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#E9F4EE] border border-[#DCF0E5]">
              <MdCheckCircle className="text-[#166534] text-lg flex-shrink-0" />
              <span className="text-sm font-semibold text-[#14532D]">
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
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#14532D] to-[#166534] text-white font-semibold hover:from-[#166534] hover:to-[#052E16] active:scale-[0.98] transition-all shadow-sm"
            >
              More Info
              <MdArrowForward className="text-lg" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}