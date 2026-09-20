import {
  MdUpload,
  MdPhotoCamera,
  MdInfoOutline,
} from 'react-icons/md';

import {AccuracyNotice} from './index'
import {PoultraScanLoader} from '../../../components/ui'

export default function ScanningView({ onCapture, onUpload, uploadInputRef, onFileSelected, isProcessing, previewUrl, errorMsg }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        className="hidden"
      />

      <AccuracyNotice />

      {/* Main scan console */}
      <div className="relative rounded-2xl md:rounded-3xl p-1.5 bg-gradient-to-br from-[#052E16] via-[#14532D] to-[#166534] shadow-card-hover">
        <div className="relative rounded-xl md:rounded-2xl bg-[#052E16] aspect-video overflow-hidden ring-1 ring-white/10">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          {previewUrl ? (
            <img src={previewUrl} alt="Scan preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/60">
              <span className="w-16 h-16 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center backdrop-blur-sm">
                <MdPhotoCamera className="text-3xl text-[#FACC15]/80" />
              </span>
              <span className="text-sm text-white/50">No image yet — capture or upload a photo</span>
            </div>
          )}

          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-[10px] font-bold uppercase tracking-wider shadow-md shadow-black/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
            Live Preview
          </div>

          {/* Gold target corners */}
          <div className="pointer-events-none absolute inset-4 z-[5]">
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FACC15]/90 rounded-tl-lg" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FACC15]/90 rounded-tr-lg" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#FACC15]/90 rounded-bl-lg" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#FACC15]/90 rounded-br-lg" />
          </div>

          {!previewUrl && (
            <span className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FACC15] to-transparent shadow-[0_0_14px_2px_rgba(250,204,21,0.5)] animate-scan-line" />
          )}

          {isProcessing && (
            <div className="absolute inset-0 z-10 bg-[#052E16]/70 backdrop-blur-sm flex items-center justify-center">
              <PoultraScanLoader
                size={56}
                label={previewUrl ? 'Processing results...' : 'Analyzing poultry...'}
                labelClassName="text-white"
              />
            </div>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 flex items-start gap-2 bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3">
          <MdInfoOutline className="text-[#EF4444] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#EF4444]">{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-5">
        <button
          onClick={onUpload}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-[#E4ECE7] text-[#10231A] font-semibold hover:bg-[#F7FAF8] hover:border-[#9CCFB0] hover:text-[#14532D] active:scale-[0.98] disabled:opacity-50 transition-all shadow-card"
        >
          <MdUpload className="text-lg text-[#166534]" />
          <span className="hidden sm:inline">Upload Image</span>
        </button>
        <button
          onClick={onCapture}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#14532D] via-[#166534] to-[#10B981] text-white font-semibold hover:from-[#14532D] hover:via-[#166534] hover:to-[#052E16] active:scale-[0.98] disabled:opacity-50 transition-all shadow-md shadow-[#14532D]/25"
        >
          <MdPhotoCamera className="text-lg" />
          <span className="hidden sm:inline">Capture</span>
        </button>
      </div>
    </div>
  );
}