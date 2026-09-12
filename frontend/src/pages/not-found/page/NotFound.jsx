import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearchOff, MdArrowBack } from 'react-icons/md';

import { TopNav, Footer,BottomNav } from '../../../components/index';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F8FAF7] text-[#1B1D1B] antialiased min-h-screen flex flex-col font-['Manrope','Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
      <TopNav />
      <div className="md:hidden">
  <BottomNav />
</div>

      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#F8FAF7] flex items-center justify-center mb-6">
            <MdSearchOff className="text-3xl text-[#2E7D32]" />
          </div>

          <h1 className="text-2xl md:text-[28px] font-bold text-[#1B1D1B] tracking-tight">
            404 — Page Not Found
          </h1>
          <p className="text-[#6B7280] text-sm mt-2.5 mb-8">
            The page you're looking for doesn't exist or may have been moved.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[#2E7D32] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#276C2A] transition-colors active:scale-[0.98]"
          >
            <MdArrowBack className="text-lg" />
            Back to Dashboard
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}