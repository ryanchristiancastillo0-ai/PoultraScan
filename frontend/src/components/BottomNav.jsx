import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { useActiveFarm } from '../context/activeFarmContext';
import { QuickScanModal } from './index';
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
        className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 group"
      >
        <span
          className={`flex h-8 w-11 items-center justify-center rounded-full transition-colors duration-200 ${
            active ? 'bg-[#E9F4EE]' : 'bg-transparent group-active:bg-[#F7FAF8]'
          }`}
        >
          <Icon
            className={`text-[20px] transition-colors duration-200 ${
              active ? 'text-[#14532D]' : 'text-[#718279] group-active:text-[#4B6357]'
            }`}
          />
        </span>
        <span
          className={`h-[3px] w-[3px] rounded-full transition-opacity duration-200 ${
            active ? 'bg-[#14532D] opacity-100' : 'opacity-0'
          }`}
        />
      </button>
    );
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-[#E4ECE7] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_10px_rgba(0,0,0,0.05)] backdrop-blur-md">
        <div className="relative mx-auto flex max-w-[480px] items-center px-1">
          {/* left links */}
          <div className="flex flex-1 items-center justify-around">
            {navLinks.map(renderLink)}
          </div>

          {/* center FAB â€” reserved slot keeps left/right links from crowding it */}
          <div className="flex w-16 shrink-0 justify-center">
            <button
              onClick={() => setQuickScanOpen(true)}
              aria-label="Quick scan"
              className="relative -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#14532D] via-[#166534] to-[#10B981] text-white shadow-lg shadow-[#14532D]/30 ring-[3px] ring-white transition-all duration-150 hover:from-[#14532D] hover:via-[#166534] hover:to-[#052E16] active:scale-90"
            >
              <MdAdd className="text-xl" />
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