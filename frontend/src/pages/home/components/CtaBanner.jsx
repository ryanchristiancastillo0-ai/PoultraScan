import { useNavigate } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import { Reveal, ScanCorners } from './index';

export default function CtaBanner() {
  const navigate = useNavigate();
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20 md:pb-28">
      <Reveal className="relative rounded-2xl px-6 py-14 md:px-16 md:py-16 text-center overflow-hidden bg-[#0D2818] shadow-lg shadow-black/20">
        <img
          src="/img/hero.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
        />
   


        <span className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
          Get started
        </span>

        <h2 className="relative text-3xl md:text-4xl font-bold text-white tracking-tight text-balance">
          Give every bird a checkup, every day.
        </h2>
        <p className="relative text-white/80 mt-3 max-w-md mx-auto">
          Set up your first farm and run a scan in under five minutes.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="relative mt-7 bg-white text-[#0D2818] font-semibold px-7 py-3.5 rounded-xl inline-flex items-center gap-2 hover:bg-[#E9F4EE] active:scale-95 transition-all duration-150 shadow-sm"
        >
          Get started free
          <MdArrowForward />
        </button>
      </Reveal>
    </section>
  );
}