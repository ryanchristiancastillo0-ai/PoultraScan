import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdBiotech,
  MdMenu,
  MdClose,
} from 'react-icons/md';



export default function NavBar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Results', href: '#results' },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F7FAF8]/90 backdrop-blur-sm border-b border-[#E4ECE7]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#14532D] via-[#166534] to-[#10B981] flex items-center justify-center text-white shadow-sm">
            <MdBiotech className="text-lg" />
          </span>
          <span className="text-[17px] font-bold text-[#10231A] tracking-tight">
            PoultraScan
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            
            <a  key={l.label}
              href={l.href}
              className="text-sm font-medium text-[#10231A]/70 hover:text-[#14532D] active:scale-95 transition-all duration-150"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-[#10231A] hover:text-[#14532D] active:scale-95 transition-all duration-150"
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#10B981] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:from-[#052E16] hover:via-[#14532D] hover:to-[#166534] active:scale-95 transition-all duration-150 shadow-sm"
          >
            Get started
          </button>
        </div>

        <button
          className="md:hidden text-[#10231A] text-2xl active:scale-90 transition-transform duration-150"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <MdClose /> : <MdMenu />}
        </button>
      </div>

      {/* Always rendered so max-height/opacity can animate the open/close */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-[#E4ECE7] bg-[#F7FAF8]">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={closeMobile} className="text-sm font-medium text-[#10231A] py-2">
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { closeMobile(); navigate('/login'); }}
              className="flex-1 text-sm font-semibold text-[#10231A] border border-[#E4ECE7] bg-white rounded-xl py-2.5 active:scale-95 transition-transform duration-150"
            >
              Log in
            </button>
            <button
              onClick={() => { closeMobile(); navigate('/register'); }}
              className="flex-1 bg-gradient-to-r from-[#14532D] via-[#166534] to-[#10B981] text-white text-sm font-semibold rounded-xl py-2.5 active:scale-95 transition-transform duration-150"
            >
              Get started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}