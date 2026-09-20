import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MdCheckCircle,
  MdRefresh,
  MdHistory,
  MdPhotoCamera
} from 'react-icons/md';
import { TotalsFooter, ChickenCard, ChickenTable, ChickenList, ViewModeToggle } from './index'
import {useNavigate} from 'react-router-dom'

const VIEW_STORAGE_KEY = 'ai_scan_results_view';

export default function ResultsView({ onScanAgain, onSave, detectionData, predictionData, previewUrl }) {
  const navigate = useNavigate()
  const detections = detectionData?.detections ?? [];
  const chickens = predictionData?.chickens ?? [];
  const totalWeight = predictionData?.total_weight ?? 0;
  const totalOilMl = predictionData?.total_oil_ml ?? 0;
  const marketReadyCount = predictionData?.market_ready_count ?? 0;

  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem(VIEW_STORAGE_KEY) || 'card';
    } catch {
      return 'card';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch {
      // localStorage unavailable (private mode, etc.) — view still works in-session
    }
  }, [view]);

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
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
      {/* Preview with detection boxes */}
      <section className="bg-white rounded-2xl border border-[#E4ECE7] shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E4ECE7] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-[#E9F4EE] flex items-center justify-center">
              <MdPhotoCamera className="text-lg text-[#14532D]" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-[#10231A]">Scan Preview</h2>
              <p className="text-xs text-[#4B6357] mt-0.5">Captured flock with AI-detected birds</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F4EE] text-[#14532D] text-[11px] font-bold">
            <MdCheckCircle className="text-sm" />
            {chickens.length} {chickens.length === 1 ? 'Chicken' : 'Chickens'} Analyzed
          </span>
        </div>

        <div
          ref={containerRef}
          className="relative h-[400px] md:h-[460px] bg-[#0B2416]"
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
                className="absolute border-2 border-[#FACC15] rounded pointer-events-none"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${boxWidth}px`,
                  height: `${boxHeight}px`,
                }}
              >
                <span className="absolute -top-5 left-0 bg-[#FACC15] text-[#0B2416] text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  #{d.tracking_id ?? i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Individual results */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#10231A]">Individual Results</h2>
            <p className="text-xs text-[#4B6357] mt-0.5">Detailed analysis for each detected chicken</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-[#4B6357] font-medium">
              {marketReadyCount} of {chickens.length} market ready
            </span>
            <ViewModeToggle value={view} onChange={setView} />
          </div>
        </div>

        {view === 'table' && <ChickenTable chickens={chickens} />}

        {view === 'card' && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {chickens.map((chicken, i) => (
              <ChickenCard key={chicken.tracking_id ?? i} chicken={chicken} />
            ))}
          </div>
        )}

        {view === 'list' && <ChickenList chickens={chickens} />}

        {view === 'carousel' && (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            {chickens.map((chicken, i) => (
              <div key={chicken.tracking_id ?? i} className="snap-start flex-shrink-0 w-80">
                <ChickenCard chicken={chicken} />
              </div>
            ))}
          </div>
        )}
      </section>

      <TotalsFooter
        chickens={chickens}
        totalWeight={totalWeight}
        totalOilMl={totalOilMl}
        marketReadyCount={marketReadyCount}
      />

      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-2">
        <button
          onClick={onScanAgain}
          className="group flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-[#E4ECE7] text-[#10231A] text-sm font-semibold shadow-card hover:bg-[#F7FAF8] hover:border-[#9CCFB0] hover:text-[#14532D] active:scale-[0.98] transition-all duration-150"
        >
          <MdRefresh className="text-lg text-[#14532D] transition-transform duration-300 group-hover:rotate-180" />
          <span>Scan Again</span>
        </button>

        <button
          onClick={() => navigate('/scan/history')}
          className="group flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#14532D] to-[#166534] text-white text-sm font-semibold shadow-md shadow-[#14532D]/25 hover:from-[#166534] hover:to-[#052E16] hover:shadow-lg hover:shadow-[#14532D]/30 active:scale-[0.98] transition-all duration-150"
        >
          <MdHistory className="text-lg transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Go to History</span>
        </button>
      </div>
    </div>
  );
}