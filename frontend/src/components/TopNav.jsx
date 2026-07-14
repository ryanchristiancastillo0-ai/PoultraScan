import { useNavigate, useLocation } from 'react-router-dom';

import { MdBiotech } from 'react-icons/md';
import { NotificationsMenu, ProfileMenu } from './index';

const navLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Scans', path: '/scan' },
  { label: 'Farms', path: '/farm' },
  { label: 'Journal', path: '/journal' },
];

function getActiveFromPath(pathname) {
  // matches '/farm' and also nested routes like '/farm/123'
  const match = navLinks.find(
    (l) => pathname === l.path || pathname.startsWith(`${l.path}/`)
  );
  return match ? match.label : null;
}

function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const active = getActiveFromPath(location.pathname);

  const handleNavClick = (link) => {
    navigate(link.path);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-[#E5E7EB]">
      <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[#2F5D3A] flex items-center justify-center text-white">
            <MdBiotech className="text-lg" />
          </span>
          <span className="hidden lg:inline text-[17px] font-bold text-[#111827] tracking-tight">PoultraScan AI</span>
        </div>

        <nav className="hidden md:flex gap-8 items-center h-full">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className={`text-sm h-full flex items-center border-b-2 transition-colors ${
                active === link.label
                  ? 'text-[#2F5D3A] font-semibold border-[#2F5D3A]'
                  : 'text-[#6B7280] hover:text-[#111827] font-medium border-transparent'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

export default TopNav;