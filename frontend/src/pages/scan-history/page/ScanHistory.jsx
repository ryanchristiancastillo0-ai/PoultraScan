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
import {TopNav,BottomNav} from '../../../components/index'

import {FilterBar,ScanCard,ScanDetailModal,Pagination,ScanRow} from '../components/index'


// ---------- Scan History (default export) ----------
export default function ScanHistory() {
  const navigate = useNavigate()

  const [selectedScan, setSelectedScan] = useState(null);
  const { scans, page, hasMore, loading, error, filters, updateFilters, nextPage, prevPage, removeScan } = useScanHistory();

  return (
    <div className="bg-[#F7F8F5] text-[#111827] antialiased min-h-screen flex flex-col font-sans">
      <TopNav />
<div className="lg:hidden">
  <BottomNav />
</div>

      <main className="flex-grow pt-20 sm:pt-24 pb-10 px-4 md:px-8 max-w-[1280px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-[28px] font-bold text-[#111827] tracking-tight text-balance">Scan History</h1>
            <p className="text-[#6B7280] text-xs sm:text-sm mt-1 text-pretty">Review and manage past AI diagnostic scans across all facilities.</p>
          </div>
          <button
            onClick={() => navigate('/scan')}
            className="bg-[#2F5D3A] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#254B2E] transition-colors shadow-sm active:scale-95 w-full sm:w-auto justify-center"
          >
            <MdAdd className="text-lg" />
            New Scan
          </button>
        </div>

         <FilterBar filters={filters} onChange={updateFilters} />

        {error && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FBEBEB] border border-[#F3D3D3]">
            <MdErrorOutline className="text-[#DC2626] text-base flex-shrink-0" />
            <p className="text-xs text-[#B91C1C] font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3 sm:p-4 md:p-6 shadow-sm">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-[#2F5D3A]/20 border-l-[#2F5D3A] animate-spin" />
              <p className="text-sm text-[#6B7280]">Loading scan history...</p>
            </div>
          ) : scans.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-2">
              <MdHealthAndSafety className="text-4xl text-[#9CA3AF]" />
              <p className="text-sm text-[#6B7280] text-center px-4">No scans yet. Run your first scan to see it here.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[720px]">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="pb-3 pl-2 text-[11px] text-[#6B7280] uppercase font-semibold">Image</th>
                      <th className="pb-3 px-3 text-[11px] text-[#6B7280] uppercase font-semibold">Date &amp; Time</th>
                      <th className="pb-3 px-3 text-[11px] text-[#6B7280] uppercase font-semibold">Farm / Location</th>
                      <th className="pb-3 px-3 text-[11px] text-[#6B7280] uppercase font-semibold">Health</th>
                      <th className="pb-3 px-3 text-[11px] text-[#6B7280] uppercase font-semibold">Market Ready</th>
                      <th className="pb-3 px-3 text-[11px] text-[#6B7280] uppercase font-semibold">Status</th>
                      <th className="pb-3 pr-2 text-[11px] text-[#6B7280] uppercase font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
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
