import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearchOff, MdArrowBack, MdCenterFocusStrong } from 'react-icons/md';

import { TopNav, Footer, BottomNav } from '../../../components/index';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F7FAF8] text-[#10231A] antialiased min-h-screen flex flex-col font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
      <TopNav />
      <div className="md:hidden">
        <BottomNav />
      </div>

      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E4ECE7] shadow-card p-8 sm:p-10 flex flex-col items-center text-center">
          <span className="text-[64px] leading-none font-bold tracking-tight bg-gradient-to-br from-[#14532D] to-[#166534] bg-clip-text text-transparent">
            404
          </span>

          <div className="w-14 h-14 rounded-2xl bg-[#E9F4EE] flex items-center justify-center mt-1 mb-5">
            <MdSearchOff className="text-2xl text-[#14532D]" />
          </div>

          <h1 className="text-xl font-bold text-[#10231A] tracking-tight">Page not found</h1>
          <p className="text-[#4B6357] text-sm mt-2 mb-7 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 h-11 bg-white text-[#10231A] border border-[#E4ECE7] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#F7FAF8] transition-colors active:scale-[0.98]"
            >
              <MdArrowBack className="text-lg" />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/scan')}
              className="flex-1 h-11 bg-gradient-to-br from-[#14532D] to-[#166534] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:from-[#166534] hover:to-[#052E16] transition-all active:scale-[0.98] shadow-md shadow-[#14532D]/25"
            >
              <MdCenterFocusStrong className="text-lg" />
              Scan Poultry
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
