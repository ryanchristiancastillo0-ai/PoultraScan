import {Reveal,ScanCorners,ScanReadoutCard} from './index'

export default function HeroVisual() {
  return (
    <Reveal delay={150} className="relative w-full max-w-sm mx-auto lg:mx-0">
      <div className="relative aspect-[4/5] rounded-2xl bg-[#006F4E] overflow-hidden shadow-[0_24px_60px_rgba(0,111,78,0.35)]">
        {/* Rooster silhouette, kept simple/graphic rather than photographic */}
        <svg viewBox="0 0 200 240" className="absolute inset-0 w-full h-full opacity-90" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M70 210c0 8 6 14 14 14h32c8 0 14-6 14-14v-18h-60v18z"
            fill="#00A86B"
          />
          <path
            d="M50 130c-4-22 8-44 30-52-2-10 4-20 14-22 6-10 18-16 30-14-2-8 4-16 12-16 10 0 16 8 14 18 10 4 16 14 14 24 12 6 18 20 14 32-2 8-8 14-16 16v6c0 26-20 48-46 48H96c-26 0-46-18-46-40z"
            fill="#00C27F"
          />
          <circle cx="128" cy="70" r="5" fill="#006F4E" />
          <path d="M150 34c10-4 20 2 22 12-10 2-18-2-22-12z" fill="#E2725B" />
          <path d="M96 96l-16 6 12 10 4-16z" fill="#E2725B" />
        </svg>

        {/* Scan sweep */}
        <div className="ps-scan-line absolute left-0 right-0 h-[2px] bg-[#e4e3df]/80 shadow-[0_0_16px_4px_rgba(228,227,223,0.5)]" />

        <ScanCorners color="#e4e3df" />
      </div>

      <ScanReadoutCard />
    </Reveal>
  );
}