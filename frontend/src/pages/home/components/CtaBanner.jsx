import { useNavigate } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import { Reveal, ScanCorners } from './index';

export default function CtaBanner() {
  const navigate = useNavigate();
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20 md:pb-28">
      <Reveal className="relative rounded-2xl px-6 py-14 md:px-16 md:py-16 text-center overflow-hidden bg-gradient-to-r from-[#14532D] via-[#166534] to-[#10B981] shadow-lg shadow-[#14532D]/20">
        <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#FACC15]/20 blur-3xl" />
        <ScanCorners color="#F7FAF8" className="opacity-30" />

        <span className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
          Get started
        </span>

        <h2 className="relative text-3xl md:text-4xl font-bold text-white tracking-tight text-balance">
          Give every bird a checkup, every day.
        </h2>
        <p className="relative text-white/85 mt-3 max-w-md mx-auto">
          Set up your first farm and run a scan in under five minutes.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="relative mt-7 bg-white text-[#14532D] font-semibold px-7 py-3.5 rounded-xl inline-flex items-center gap-2 hover:bg-[#E9F4EE] active:scale-95 transition-all duration-150 shadow-sm"
        >
          Get started free
          <MdArrowForward />
        </button>
      </Reveal>
    </section>
  );
}
