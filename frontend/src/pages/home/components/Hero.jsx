
import {
  MdArrowForward,
  MdCheckCircle,
} from 'react-icons/md';

import {HeroBackground,Reveal,HeroVisual} from './index'

export default function Hero() {
  return (
   <section className="relative isolate overflow-hidden">
      <HeroBackground image={'/img/left-hero.png'} />
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-14 pb-24 md:pt-20 md:pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <span className="font-mono inline-block text-[11px] font-semibold uppercase tracking-widest text-[#14532D] bg-[#E9F4EE] px-3 py-1.5 rounded-full mb-5">
            AI flock diagnostics
          </span>
          <h1 className="text-4xl md:text-[52px] font-bold text-[#10231A] leading-[1.08] tracking-tight text-balance">
            Know your flock's health before symptoms spread.
          </h1>
          <p className="mt-5 text-base md:text-lg text-[#10231A]/70 max-w-lg leading-relaxed text-pretty">
            Point a camera at the coop. PoultraScan AI reads posture, feathering,
            and movement to flag sick birds in seconds — so you catch outbreaks
            while they're still one or two birds, not the whole house.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href='/login'
             className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#10B981] text-white font-semibold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:from-[#052E16] hover:via-[#14532D] hover:to-[#166534] active:scale-95 transition-all duration-150 shadow-md shadow-[#14532D]/25">
              Start scanning
              <MdArrowForward />
            </a>
            
            <a  href="#how-it-works"
              className="text-[#10231A] font-semibold px-6 py-3.5 rounded-xl border border-[#E4ECE7] bg-white text-center hover:border-[#166534]/40 hover:text-[#166534] active:scale-95 transition-all duration-150"
            >
              See how it works
            </a>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-[#10231A]/60">
            <MdCheckCircle className="text-[#FACC15]" />
            No hardware to install — works from any phone camera
          </div>
        </Reveal>

        <HeroVisual />

      </div>
    </section>
  );
}
