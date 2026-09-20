import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCenterFocusStrong, MdAgriculture, MdChevronRight,  MdArrowForward,} from 'react-icons/md';

import { thumbnailSrc } from '../../../utils/thumbnailSrc';

export default function ScanSummary({ recentScans }) {
  const navigate = useNavigate();

  const statusStyles = {
    COMPLETED: { bg: '#D1FAE5', text: '#059669', label: 'Completed' },
    PROCESSING: { bg: '#FEF3C7', text: '#D97706', label: 'Processing' },
    FAILED: { bg: '#FEF2F2', text: '#EF4444', label: 'Failed' },
  };


  const formatDate = (value) => {
    if (!value) return 'â€”';
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="md:col-span-12 lg:col-span-8 bg-white rounded-2xl border border-[#E4ECE7] overflow-hidden flex flex-col shadow-card">
      <div className="px-6 py-4 border-b border-[#E4ECE7] flex justify-between items-center">
        <h3 className="text-[15px] font-semibold text-[#10231A]">Recent Scans</h3>
        <button
          onClick={() => navigate('/scan/history')}
          className="text-[#14532D] text-sm font-semibold hover:text-[#166534] transition-colors flex items-center gap-0.5"
        >
          View all <MdChevronRight className="text-base" />
        </button>
      </div>

      {recentScans.length === 0 ? (
        <div className="p-8 flex-1 min-h-[320px] flex items-center justify-center bg-[#F7FAF8]">
          <div className="text-center">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#E4ECE7] text-[#14532D]">
              <MdCenterFocusStrong className="text-2xl" />
            </div>
            <p className="text-[#10231A] font-semibold text-[15px]">No scans yet</p>
            <p className="text-[#4B6357] text-sm mt-1">Run your first scan to see results here.</p>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-[#E4ECE7] max-h-[400px] overflow-y-auto">
          {recentScans.map((scan) => {
            const s = statusStyles[scan.status] || statusStyles.PROCESSING;
            return (
              <li key={scan.summary_id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#F7FAF8] transition-colors">
                <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-[#F7FAF8] border border-[#E4ECE7] flex items-center justify-center">
                  {scan.thumbnail_url ? (
                    <img src={thumbnailSrc(scan.thumbnail_url)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <MdAgriculture className="text-[#4B6357] text-lg" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#10231A] truncate">{scan.farm_name}</p>
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.bg, color: s.text }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#4B6357] mt-1">
                    {formatDate(scan.started_at)} â€¢ {scan.total_detected ?? 0} Chickens
                    {scan.diseased_count > 0 && (
                      <span className="text-[#EF4444] font-medium"> â€¢ {scan.diseased_count} flagged</span>
                    )}
                  </p>
                </div>
                <span
                  onClick={() => navigate(`/farm/${scan.farm_id}`)}
                  className="w-8 h-8 rounded-full bg-[#E9F4EE] text-[#14532D] flex items-center justify-center cursor-pointer hover:bg-[#14532D] hover:text-white transition-colors flex-shrink-0"
                >
                  <MdArrowForward className="text-base" />
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}