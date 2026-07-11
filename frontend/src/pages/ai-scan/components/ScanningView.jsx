import {
  MdUpload,
  MdPhotoCamera,
  MdInfoOutline,
} from 'react-icons/md';

import {AccuracyNotice} from './index'

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

      <div className="relative rounded-2xl bg-[#111827] border border-[#1F2937] aspect-video overflow-hidden shadow-sm">
        {previewUrl ? (
          <img src={previewUrl} alt="Scan preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/60 gap-2">
            <MdPhotoCamera className="text-5xl opacity-60" />
            <span className="text-sm">No image yet</span>
          </div>
        )}

        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#2F5D3A] text-white text-[10px] font-bold uppercase tracking-wider">
          Live Preview
        </div>

        {!previewUrl && (
          <div className="absolute left-0 right-0 h-0.5 bg-[#4ADE80] shadow-[0_0_10px_#4ADE80] animate-scan-line" />
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-2 border-white/20 border-t-[#4ADE80] rounded-full animate-spin" />
            <p className="text-white text-sm font-medium">Analyzing image...</p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mt-3 flex items-start gap-2 bg-[#FBEBEB] border border-[#F3C9C9] rounded-xl p-3">
          <MdInfoOutline className="text-[#DC2626] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#B91C1C]">{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-5">
        <button
          onClick={onUpload}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 py-3 rounded-lg bg-white border border-[#E5E7EB] text-[#111827] font-semibold hover:bg-[#F7F8F5] disabled:opacity-50 transition-colors"
        >
          <MdUpload className="text-lg" />
          <span className="hidden sm:inline">Upload Image</span>
        </button>
        <button
          onClick={onCapture}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#2F5D3A] text-white font-semibold hover:bg-[#254A2E] disabled:opacity-50 transition-colors shadow-sm"
        >
          <MdPhotoCamera className="text-lg" />
          <span className="hidden sm:inline">Capture</span>
        </button>
      </div>
    </div>
  );
}