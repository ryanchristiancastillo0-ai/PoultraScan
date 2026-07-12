import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MdCheckCircle,
  MdRefresh,
  MdHistory
} from 'react-icons/md';
import { TotalsFooter, ChickenCard } from './index'
import {useNavigate} from 'react-router-dom'

export default function ResultsView({ onScanAgain, onSave, detectionData, predictionData, previewUrl }) {
  const navigate = useNavigate()
  const detections = detectionData?.detections ?? [];
  const chickens = predictionData?.chickens ?? [];
  const totalWeight = predictionData?.total_weight ?? 0;
  const totalOilMl = predictionData?.total_oil_ml ?? 0;
  const marketReadyCount = predictionData?.market_ready_count ?? 0;

  const containerRef = useRef(null);
  const imgRef = useRef(null);
  // Rendered rect of the actual picture content inside the img element
  // (accounting for object-contain letterboxing), plus the scale factor
  // from the image's natural pixel size to its displayed size.
  const [renderInfo, setRenderInfo] = useState(null);

  const recalcRenderInfo = useCallback(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img || !img.naturalWidth || !img.naturalHeight) return;

    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const imgAspect = naturalW / naturalH;
    const containerAspect = containerW / containerH;

    let renderW, renderH, offsetX, offsetY;

    if (imgAspect > containerAspect) {
      // Image is wider than container -> letterboxed top/bottom
      renderW = containerW;
      renderH = containerW / imgAspect;
      offsetX = 0;
      offsetY = (containerH - renderH) / 2;
    } else {
      // Image is taller than container -> letterboxed left/right
      renderH = containerH;
      renderW = containerH * imgAspect;
      offsetY = 0;
      offsetX = (containerW - renderW) / 2;
    }

    setRenderInfo({
      offsetX,
      offsetY,
      // How much to multiply original-image pixel coords by to get
      // displayed pixel coords.
      scaleX: renderW / naturalW,
      scaleY: renderH / naturalH,
    });
  }, []);

  useEffect(() => {
    recalcRenderInfo();
    window.addEventListener('resize', recalcRenderInfo);
    return () => window.removeEventListener('resize', recalcRenderInfo);
  }, [recalcRenderInfo, previewUrl]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Preview with detection boxes */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm bg-[#111827] h-[400px]"
      >
        {previewUrl && (
          <img
            ref={imgRef}
            src={previewUrl}
            alt="Scan result"
            className="w-full h-full object-contain"
            onLoad={recalcRenderInfo}
          />
        )}
        {renderInfo && detections.map((d, i) => {
          const box = d.bounding_box ?? d;
          // Backend sends x/y as the CENTER point and width/height, all
          // in the ORIGINAL image's pixel space (not normalized, not
          // top-left). Convert to top-left, then scale to displayed size.
          const boxWidth = (box.width ?? 0) * renderInfo.scaleX;
          const boxHeight = (box.height ?? 0) * renderInfo.scaleY;
          const centerX = (box.x ?? 0) * renderInfo.scaleX;
          const centerY = (box.y ?? 0) * renderInfo.scaleY;

          const left = renderInfo.offsetX + centerX - boxWidth / 2;
          const top = renderInfo.offsetY + centerY - boxHeight / 2;

          return (
            <div
              key={d.tracking_id ?? i}
              className="absolute border-2 border-[#4ADE80] rounded pointer-events-none"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${boxWidth}px`,
                height: `${boxHeight}px`,
              }}
            >
              <span className="absolute -top-5 left-0 bg-[#4ADE80] text-[#111827] text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                #{d.tracking_id ?? i + 1}
              </span>
            </div>
          );
        })}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2F5D3A] text-white">
          <MdCheckCircle className="text-sm" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {chickens.length} {chickens.length === 1 ? 'Chicken' : 'Chickens'} Analyzed
          </span>
        </div>
      </div>

      {/* Horizontal scroll cards */}
      <div className="mt-6 flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
        {chickens.map((chicken, i) => (
          <div key={chicken.tracking_id ?? i} className="snap-start">
            <ChickenCard chicken={chicken} />
          </div>
        ))}
      </div>

      <TotalsFooter
        chickens={chickens}
        totalWeight={totalWeight}
        totalOilMl={totalOilMl}
        marketReadyCount={marketReadyCount}
      />

      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6">
        <button
          onClick={onScanAgain}
          className="group flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 rounded-full sm:rounded-lg bg-white border border-[#E5E7EB] text-[#111827] font-semibold shadow-sm hover:bg-[#F7F8F5] hover:border-[#D1D5DB] hover:shadow-md active:scale-[0.97] transition-all duration-150"
        >
          <MdRefresh className="text-lg text-[#2F5D3A] transition-transform duration-300 group-hover:rotate-180" />
          <span>Scan Again</span>
        </button>

        <button
          onClick={() => navigate('/scan/history')}
          className="group flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 rounded-full sm:rounded-lg bg-gradient-to-r from-[#2F5D3A] to-[#3d7a4c] text-white font-semibold shadow-[0_8px_20px_-6px_rgba(47,93,58,0.4)] hover:shadow-[0_10px_24px_-6px_rgba(47,93,58,0.5)] active:scale-[0.97] transition-all duration-150"
        >
          <MdHistory className="text-lg transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Go to History</span>
        </button>
      </div>
    </div>
  );
}