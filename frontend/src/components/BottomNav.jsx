import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { useActiveFarm } from '../context/activeFarmContext';
import { QuickScanModal } from './index';
import { HiPlus } from 'react-icons/hi2';
import { navLinks, navLinksRight } from '../constant/navList';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeFarmId } = useActiveFarm();
  const [quickScanOpen, setQuickScanOpen] = useState(false);

  const isActive = (link) => location.pathname.startsWith(link.path);

  const handleNavClick = (link) => {
    navigate(link.path);
  };

  const renderLink = (link) => {
    const { key, label, icon: Icon } = link;
    const active = isActive(link);

    return (
      <button
        key={key}
        onClick={() => handleNavClick(link)}
        aria-label={label}
        aria-current={active ? 'page' : undefined}
        className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2 group"
      >
        {/* active indicator — thin bar, not a dot/badge */}
        <span
          className={`absolute top-0 h-[2.5px] w-6 rounded-full transition-all duration-200 ${
            active ? 'bg-[#14532D] opacity-100' : 'opacity-0'
          }`}
        />

        <Icon
          className={`text-[21px] transition-colors duration-200 ${
            active ? 'text-[#14532D]' : 'text-[#9AA9A0] group-active:text-[#4B6357]'
          }`}
        />

        <span
          className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
            active ? 'text-[#14532D]' : 'text-[#9AA9A0]'
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 z-50 w-full bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#E4ECE7]" />

        <div className="relative mx-auto flex max-w-[480px] items-center px-1">
          {/* left links */}
          <div className="flex flex-1 items-center justify-around">
            {navLinks.map(renderLink)}
          </div>

          {/* center FAB */}
          <div className="flex w-16 shrink-0 justify-center">
            <button
              onClick={() => setQuickScanOpen(true)}
              aria-label="Quick scan"
              className="group relative -top-4 flex h-13 w-13 items-center justify-center rounded-full bg-[#166534] text-white shadow-[0_8px_20px_-4px_rgba(16,185,129,0.4)] transition-all duration-200 hover:bg-[#10B981] hover:shadow-[0_10px_24px_-4px_rgba(16,185,129,0.55)] hover:scale-105 active:scale-90"
              style={{ height: '3.25rem', width: '3.25rem' }}
            >
             <HiPlus className="text-2xl transition-transform duration-300 ease-out group-hover:rotate-90 group-active:rotate-90" />
            </button>
          </div>

          {/* right links */}
          <div className="flex flex-1 items-center justify-around">
            {navLinksRight.map(renderLink)}
          </div>
        </div>
      </nav>

      <QuickScanModal
        isOpen={quickScanOpen}
        onClose={() => setQuickScanOpen(false)}
        farmId={activeFarmId}
      />
    </>
  );
}