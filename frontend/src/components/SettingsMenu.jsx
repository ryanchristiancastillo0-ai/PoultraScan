import { useState, useRef, useEffect } from 'react';
import {
  
  MdSettings,
  
  MdHelpOutline,
  MdDarkMode,
  MdLanguage,

} from 'react-icons/md';

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const settingsItems = [
    { id: 'theme', label: 'Dark Mode', icon: MdDarkMode },
    { id: 'language', label: 'Language', icon: MdLanguage },
    { id: 'help', label: 'Help & Support', icon: MdHelpOutline },
  ];

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
          aria-label="Settings"
          aria-expanded={open}
          className="p-2 rounded-full text-[#4B6357] hover:bg-[#F7FAF8] hover:text-[#10231A] transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]/40"
        >
          <MdSettings className="text-xl" />
        </button>

        {open && (
          <div className="fixed top-[72px] left-4 right-4 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-64 bg-white rounded-xl border border-[#E9F4EE] shadow-[0_12px_32px_rgba(16, 35, 26,0.12)] overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-[#E9F4EE]">
              <span className="text-sm font-bold text-[#10231A]">Settings</span>
            </div>
            <div className="py-1">
              {settingsItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    console.log(`Settings option clicked: ${label}`);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-[#F7FAF8] transition-all"
                >
                  <Icon className="text-[#4B6357] text-base" />
                  <span className="text-xs font-medium text-[#10231A]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}