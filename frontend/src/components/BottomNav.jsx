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
        className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 group"
      >
        <span
          className={`flex items-center justify-center w-10 h-8 rounded-full transition-all duration-200 ${
            active ? 'bg-[#EAF2EC]' : 'bg-transparent group-active:bg-[#F7F8F5]'
          }`}
        >
          <Icon
            className={`text-[19px] transition-colors duration-200 ${
              active ? 'text-[#2F5D3A]' : 'text-[#9CA3AF] group-active:text-[#6B7280]'
            }`}
          />
        </span>
        <span
          className={`w-1 h-1 rounded-full transition-opacity duration-200 ${
            active ? 'bg-[#2F5D3A] opacity-100' : 'opacity-0'
          }`}
        />
      </button>
    );
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full z-50  bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between px-2 max-w-[520px] mx-auto relative">
          {navLinks.map(renderLink)}

          <div className="flex-1 flex justify-center">
            <button
              onClick={() => setQuickScanOpen(true)}
              aria-label="Quick scan"
              className="relative -top-5 w-14 h-14 rounded-full bg-[#2F5D3A] text-white flex items-center justify-center shadow-lg shadow-[#2F5D3A]/25 ring-4 ring-white hover:bg-[#254A2E] active:scale-90 transition-all duration-150"
            >
              <MdAdd className="text-2xl" />
            </button>
          </div>

          {navLinksRight.map(renderLink)}
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