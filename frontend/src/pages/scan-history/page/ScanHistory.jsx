import React, { useState,useEffect } from 'react';
import { getPredictionsBySession } from '../api/aiPredictionApi';
import {
  MdClose,
  MdAdd,
  MdSearch,
  MdCalendarMonth,
  MdAgriculture,
  MdVisibility,
  MdDelete,
  MdHourglassEmpty,
  MdSync,
  MdChevronLeft,
  MdChevronRight,
  MdHealthAndSafety,
  MdErrorOutline,
  MdScale,
  MdOpacity,
  MdCheckCircle,
  MdOutlineNotes,
  MdOutlinePets,
} from 'react-icons/md';
import { useScanHistory } from '../hooks/useScanHistory';

import {useNavigate} from 'react-router-dom'
import {TopNav,BottomNav,PoultraScanLoader} from '../../../components/index'

import {FilterBar,ScanCard,ScanDetailModal,Pagination,ScanRow} from '../components/index'


// ---------- Scan History (default export) ----------
export default function ScanHistory() {
  const navigate = useNavigate()

  const [selectedScan, setSelectedScan] = useState(null);
  const { scans, page, hasMore, loading, error, filters, updateFilters, nextPage, prevPage, removeScan } = useScanHistory();

  return (
    <div className="bg-[#F7FAF8] text-[#10231A] antialiased min-h-dvh flex flex-col font-sans">
      <TopNav />
<div className="md:hidden">
  <BottomNav />
</div>

      <main className="flex-grow pt-[calc(env(safe-area-inset-top)+5rem)] sm:pt-24 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] md:pb-10 px-4 md:px-8 max-w-[1280px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E9F4EE] text-[#14532D] text-[11px] font-bold uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
              Records
            </span>
            <h1 className="text-xl sm:text-2xl md:text-[28px] font-bold text-[#10231A] tracking-tight text-balance">Scan History</h1>
            <p className="text-[#4B6357] text-xs sm:text-sm mt-1 text-pretty">Review and manage past AI diagnostic scans across all facilities.</p>
          </div>
          <button
            onClick={() => navigate('/scan')}
            className="bg-gradient-to-br from-[#14532D] to-[#166534] text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:from-[#166534] hover:to-[#052E16] transition-all shadow-md shadow-[#14532D]/25 active:scale-95 w-full sm:w-auto justify-center"
          >
            <MdAdd className="text-lg" />
            New Scan
          </button>
        </div>

         <FilterBar filters={filters} onChange={updateFilters} />

        {error && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
            <MdErrorOutline className="text-[#EF4444] text-base flex-shrink-0" />
            <p className="text-xs text-[#EF4444] font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#E4ECE7] p-3 sm:p-4 md:p-6 shadow-card">
          {loading ? (
            <div className="py-16">
              <PoultraScanLoader size={48} label="Loading scan history..." />
            </div>
          ) : scans.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <span className="w-14 h-14 rounded-2xl bg-[#E9F4EE] flex items-center justify-center">
                <MdHealthAndSafety className="text-2xl text-[#14532D]" />
              </span>
              <p className="text-sm text-[#4B6357] text-center px-4">No scans yet. Run your first scan to see it here.</p>
              <button
                onClick={() => navigate('/scan')}
                className="text-sm font-semibold text-[#14532D] hover:underline"
              >
                Run a scan
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[720px]">
                  <thead>
                    <tr className="border-b border-[#E4ECE7]">
                      <th className="pb-3 pl-2 text-[11px] text-[#4B6357] uppercase font-semibold">Image</th>
                      <th className="pb-3 px-3 text-[11px] text-[#4B6357] uppercase font-semibold">Date &amp; Time</th>
                      <th className="pb-3 px-3 text-[11px] text-[#4B6357] uppercase font-semibold">Farm / Location</th>
                      <th className="pb-3 px-3 text-[11px] text-[#4B6357] uppercase font-semibold">Health</th>
                      <th className="pb-3 px-3 text-[11px] text-[#4B6357] uppercase font-semibold">Market Ready</th>
                      <th className="pb-3 px-3 text-[11px] text-[#4B6357] uppercase font-semibold">Status</th>
                      <th className="pb-3 pr-2 text-[11px] text-[#4B6357] uppercase font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4ECE7]">
                    {scans.map((scan) => (
                      <ScanRow key={scan.summary_id} scan={scan} onDelete={removeScan} onView={setSelectedScan} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden flex flex-col gap-3">
                {scans.map((scan) => (
                  <ScanCard key={scan.summary_id} scan={scan} onDelete={removeScan} onView={setSelectedScan} />
                ))}
              </div>

              <Pagination page={page} hasMore={hasMore} onPrev={prevPage} onNext={nextPage} count={scans.length} />
            </>
          )}
        </div>
      </main>

      <ScanDetailModal scan={selectedScan} onClose={() => setSelectedScan(null)} />
    </div>
  );
}
