import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdPerson,
  MdLogout,
} from 'react-icons/md';
import { useProfile } from '../pages/profile/hooks/useProfile';
import { ProfileAPI } from '../pages/profile/api/profileApi';
import {MiniAvatar} from './index'

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { user, loading } = useProfile();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewProfile = () => {
    setOpen(false);
    navigate('/profile');
  };

  const handleLogout = async () => {
    setOpen(false);
    setLoggingOut(true);
    try {
      await ProfileAPI.logout();
    } catch (err) {
      console.error('Logout failed:', err.message);
      // even if the API call fails, we still clear the client-side session below
    } finally {
      setLoggingOut(false);
      navigate('/login');
    }
  };

  const profileItems = [
    { id: 'profile', label: 'View Profile', icon: MdPerson, onClick: handleViewProfile },
    { id: 'logout', label: 'Log Out', icon: MdLogout, onClick: handleLogout },
  ];

  const displayName = loading ? '...' : user?.fullname || 'Farm Manager';
  const displayEmail = loading ? '' : user?.email || '';

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-[#10231A]/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className={`relative ${open ? 'z-50' : ''}`} ref={containerRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Profile menu"
          aria-expanded={open}
          disabled={loggingOut}
          className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-[#E9F4EE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]/40 disabled:opacity-60"
        >
          <MiniAvatar fullname={user?.fullname} avatarUrl={user?.avatar_url} sizeClass="w-full h-full" />
        </button>

        {open && (
          <div className="fixed top-[calc(env(safe-area-inset-top)+4.25rem)] left-3 right-3 max-h-[calc(100dvh-6rem)] overflow-y-auto sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-56 sm:max-h-none bg-white rounded-xl border border-[#E9F4EE] shadow-[0_12px_32px_rgba(16, 35, 26,0.12)] z-50 animate-menu-pop">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E9F4EE]">
              <MiniAvatar fullname={user?.fullname} avatarUrl={user?.avatar_url} sizeClass="w-9 h-9 border-2 border-white ring-1 ring-[#E9F4EE]" />
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-xs font-bold text-[#10231A] truncate">{displayName}</span>
                <span className="text-[10px] text-[#718279] truncate">{displayEmail}</span>
              </div>
            </div>
            <div className="py-1">
              {profileItems.map(({ id, label, icon: Icon, onClick }) => (
                <button
                  key={id}
                  onClick={onClick}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-[#F7FAF8] transition-all disabled:opacity-60"
                >
                  <Icon className="text-[#4B6357] text-base" />
                  <span className="text-xs font-medium text-[#10231A]">
                    {id === 'logout' && loggingOut ? 'Logging out...' : label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}