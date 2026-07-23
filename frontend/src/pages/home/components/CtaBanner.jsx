
import { useNavigate } from 'react-router-dom';
import {
  MdArrowForward,
} from 'react-icons/md';
import {Reveal,ScanCorners} from './index'
export default function CtaBanner() {
  const navigate = useNavigate();
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-20 md:pb-28">
      <Reveal className="relative  rounded-2xl px-6 py-14 md:px-16 md:py-16 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-md opacity-40"
          style={{ backgroundImage: "url('/img/get_started_logo.png')" }}
        />
        <div className="absolute inset-0 " />
        <ScanCorners color="#e4e3df" className="opacity-30" />
        <h2 className="relative text-3xl md:text-4xl font-bold text-white tracking-tight text-balance">
          Give every bird a checkup, every day.
        </h2>
        <p className="relative text-white/85 mt-3 max-w-md mx-auto">
          Set up your first farm and run a scan in under five minutes.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="relative mt-7 bg-white text-[#006F4E] font-semibold px-7 py-3.5 rounded-lg inline-flex items-center gap-2 hover:bg-[#e4e3df] active:scale-95 transition-all duration-150"
        >
          Get started free
          <MdArrowForward />
        </button>
      </Reveal>
    </section>
  );
}