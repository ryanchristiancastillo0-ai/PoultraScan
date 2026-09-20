import {useState,useEffect} from 'react'
import {
  MdClose,
  MdAgriculture,
  MdHourglassEmpty,
  MdHealthAndSafety,
  MdErrorOutline,
  MdScale,
  MdOpacity,
  MdCheckCircle,
  MdOutlineNotes,
  MdOutlinePets,
} from 'react-icons/md';
import {formatDateTime} from '../../../utils/formatDateTime'
import {thumbnailSrc} from '../../../utils/thumbnailSrc'
import {StatusBadge,DetailStat,ChickenPredictionCard} from './index'
import {getPredictionsBySession} from '../api/aiPredictionApi'
import {PoultraScanLoader} from '../../../components/ui'

export default function ScanDetailModal({ scan, onClose }) {
  const [chickens, setChickens] = useState([]);
  const [loadingChickens, setLoadingChickens] = useState(false);

  useEffect(() => {
    if (!scan) return;
    setLoadingChickens(true);
    getPredictionsBySession(scan.scan_session_id)
      .then((data) => setChickens(data))
      .catch(() => setChickens([]))
      .finally(() => setLoadingChickens(false));
  }, [scan]);

  if (!scan) return null;

  const { date, time } = formatDateTime(scan.started_at);
  const { date: finishedDate, time: finishedTime } = formatDateTime(scan.finished_at);
  const src = thumbnailSrc(scan.thumbnail_url);
  const diseasedTone = scan.diseased_count > 0 ? 'bad' : 'good';

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[90dvh] overflow-y-auto no-scrollbar bg-white rounded-t-2xl sm:rounded-2xl border border-[#E4ECE7] shadow-xl animate-modal-in">
        {/* Header strip */}
        <div className="sticky top-0 z-10 rounded-t-2xl bg-[#14532D] px-4 py-4 sm:px-6 sm:py-5 flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-white/80 bg-white/15 px-2.5 py-1 rounded-full mb-2">
              Scan #{scan.scan_session_id}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight break-words">{scan.farm_name}</h2>
            <p className="text-white/80 text-xs mt-0.5 break-words">{scan.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-white flex-shrink-0"
            aria-label="Close"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
          {/* Image */}
          <div className="relative w-full aspect-video bg-[#F7FAF8] rounded-xl overflow-hidden border border-[#E4ECE7] flex items-center justify-center">
            {src ? (
              <img src={src} alt="Scan" className="w-full h-full object-cover" />
            ) : (
              <MdHourglassEmpty className="text-[#718279] text-4xl animate-pulse" />
            )}
          </div>

          {/* Status + meta row */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 justify-between">
            <StatusBadge status={scan.status} />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7FAF8] border border-[#E4ECE7]">
              <MdAgriculture className="text-[#4B6357] text-sm" />
              <span className="text-xs font-semibold text-[#10231A]">
                {scan.scan_type === 'WEBCAM' ? 'Live Capture' : 'Uploaded Image'}
              </span>
            </div>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl bg-[#F7FAF8] border border-[#E4ECE7]">
              <p className="text-[10px] text-[#4B6357] uppercase tracking-wider font-semibold mb-1">Started</p>
              <p className="text-sm font-bold text-[#10231A]">{date}</p>
              <p className="text-xs text-[#4B6357]">{time}</p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-[#F7FAF8] border border-[#E4ECE7]">
              <p className="text-[10px] text-[#4B6357] uppercase tracking-wider font-semibold mb-1">Finished</p>
              <p className="text-sm font-bold text-[#10231A]">{scan.finished_at ? finishedDate : '--'}</p>
              <p className="text-xs text-[#4B6357]">{scan.finished_at ? finishedTime : 'In progress'}</p>
            </div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <DetailStat icon={MdOutlinePets} label="Total Detected" value={scan.total_detected ?? '--'} />
            <DetailStat icon={MdCheckCircle} label="Healthy" value={scan.healthy_count ?? '--'} tone="good" />
            <DetailStat icon={MdErrorOutline} label="Diseased" value={scan.diseased_count ?? '--'} tone={diseasedTone} />
            <DetailStat icon={MdScale} label="Avg Weight" value={scan.average_weight != null ? `${scan.average_weight} kg` : '--'} />
            <DetailStat icon={MdOpacity} label="Total Estimated Oil Yield" value={scan.estimated_total_oil_ml != null ? `~${Math.round(scan.estimated_total_oil_ml)} mL` : '--'} />
            <DetailStat
              icon={MdHealthAndSafety}
              label="Market Ready"
              value={scan.total_detected ? `${scan.market_ready_count ?? 0}/${scan.total_detected}` : '--'}
              tone="good"
            />
          </div>

          {/* Remarks */}
          {scan.remarks && (
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#E9F4EE] border border-[#E9F4EE]">
              <div className="flex items-center gap-2">
                <MdOutlineNotes className="text-[#14532D] text-base" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#10231A]">Remarks</span>
              </div>
              <p className="text-sm text-[#2C4238] leading-relaxed">{scan.remarks}</p>
            </div>
          )}

          {/* Per-chicken breakdown */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10231A]">
              Chicken-by-Chicken Results
            </span>
            {loadingChickens ? (
              <div className="py-6 flex justify-center">
                <PoultraScanLoader size={36} label={null} />
              </div>
            ) : chickens.length === 0 ? (
              <p className="text-sm text-[#718279] italic py-2">No per-chicken data available.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {chickens.map((chicken) => (
                  <ChickenPredictionCard key={chicken.detected_chicken_id} chicken={chicken} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-6 sm:pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#14532D] to-[#166534] text-white text-sm font-semibold hover:from-[#166534] hover:to-[#052E16] transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}