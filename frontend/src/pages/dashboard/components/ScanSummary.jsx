import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCenterFocusStrong, MdAgriculture, MdChevronRight,  MdArrowForward,} from 'react-icons/md';

import { thumbnailSrc } from '../../../utils/thumbnailSrc';

export default function ScanSummary({ recentScans }) {
  const navigate = useNavigate();

  const statusStyles = {
    COMPLETED: { bg: '#E8F5E9', text: '#2E7D32', label: 'Completed' },
    PROCESSING: { bg: '#FFF6E0', text: '#B45309', label: 'Processing' },
    FAILED: { bg: '#FFEBEE', text: '#D32F2F', label: 'Failed' },
  };


  const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="md:col-span-12 lg:col-span-8 bg-white rounded-xl border border-[#E5E7EB] overflow-hidden flex flex-col shadow-sm">
      <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center">
        <h3 className="text-[15px] font-semibold text-[#1B1D1B]">Recent Scans</h3>
        <button
          onClick={() => navigate('/scan/history')}
          className="text-[#2E7D32] text-sm font-semibold hover:text-[#276C2A] transition-colors flex items-center gap-0.5"
        >
          View all <MdChevronRight className="text-base" />
        </button>
      </div>

      {recentScans.length === 0 ? (
        <div className="p-8 flex-1 min-h-[320px] flex items-center justify-center bg-[#F8FAF7]">
          <div className="text-center">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#E5E7EB] text-[#2E7D32]">
              <MdCenterFocusStrong className="text-2xl" />
            </div>
            <p className="text-[#1B1D1B] font-semibold text-[15px]">No scans yet</p>
            <p className="text-[#6B7280] text-sm mt-1">Run your first scan to see results here.</p>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-[#E5E7EB] max-h-[400px] overflow-y-auto">
          {recentScans.map((scan) => {
            const s = statusStyles[scan.status] || statusStyles.PROCESSING;
            return (
              <li key={scan.summary_id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#F8FAF7] transition-colors">
                <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-[#F8FAF7] border border-[#E5E7EB] flex items-center justify-center">
                  {scan.thumbnail_url ? (
                    <img onClick={()=> console.log(scan)} src={thumbnailSrc(scan.thumbnail_url)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <MdAgriculture className="text-[#6B7280] text-lg" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#1B1D1B] truncate">{scan.farm_name}</p>
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.bg, color: s.text }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {formatDate(scan.started_at)} • {scan.total_detected ?? 0} Chickens
                    {scan.diseased_count > 0 && (
                      <span className="text-[#D32F2F] font-medium"> • {scan.diseased_count} flagged</span>
                    )}
                  </p>
                </div>
                <MdArrowForward className="text-[#9CA3AF] text-lg flex-shrink-0" 
                  onClick={() => navigate(`/farm/${scan.farm_id}`)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}