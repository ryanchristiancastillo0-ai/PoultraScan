import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { useActiveFarm } from '../context/activeFarmContext';
import { QuickScanModal } from './index';
import { navLinks, navLinksRight } from '../constant/navList';

const ACTIVE_BOTTOM_NAV_KEY = 'poultrascan_active_bottom_nav';

const allLinks = [...navLinks, ...navLinksRight];

function getStoredActive() {
  try {
    const stored = localStorage.getItem(ACTIVE_BOTTOM_NAV_KEY);
    return allLinks.some((l) => l.key === stored) ? stored : null;
  } catch (err) {
    console.error('Failed to read active bottom nav:', err);
    return null;
  }
}

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeFarmId } = useActiveFarm();
  const [quickScanOpen, setQuickScanOpen] = useState(false);
  const [storedActive, setStoredActive] = useState(getStoredActive);

  const isActive = (link) => {
    if (location.pathname.startsWith(link.path)) return true;
    if (storedActive === link.key && !allLinks.some((l) => location.pathname.startsWith(l.path))) {
      return true;
    }
    return false;
  };

  const handleNavClick = (link) => {
    setStoredActive(link.key);
    try {
      localStorage.setItem(ACTIVE_BOTTOM_NAV_KEY, link.key);
    } catch (err) {
      console.error('Failed to save active bottom nav:', err);
    }
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
            active ? 'bg-[#EAF2EC]' : 'bg-transparent group-active:bg-[#F5F6F4]'
          }`}
        >
          <Icon
            className={`text-[20px] transition-colors duration-200 ${
              active ? 'text-[#2F5D3A]' : 'text-[#9CA3AF] group-active:text-[#6B7280]'
            }`}
          />
        </span>
        <span
          className={`h-[3px] w-[3px] rounded-full transition-opacity duration-200 ${
            active ? 'bg-[#2F5D3A] opacity-100' : 'opacity-0'
          }`}
        />
      </button>
    );
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-[#E5E7EB] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_10px_rgba(0,0,0,0.05)] backdrop-blur-md">
        <div className="relative mx-auto flex max-w-[480px] items-center px-1">
          {/* left links */}
          <div className="flex flex-1 items-center justify-around">
            {navLinks.map(renderLink)}
          </div>

          {/* center FAB — reserved slot keeps left/right links from crowding it */}
          <div className="flex w-16 shrink-0 justify-center">
            <button
              onClick={() => setQuickScanOpen(true)}
              aria-label="Quick scan"
              className="relative -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2F5D3A] text-white shadow-md shadow-[#2F5D3A]/20 ring-[3px] ring-white transition-transform duration-150 hover:bg-[#254A2E] active:scale-90"
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