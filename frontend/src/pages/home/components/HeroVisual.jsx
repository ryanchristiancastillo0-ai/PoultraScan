import {Reveal,ScanCorners,ScanReadoutCard} from './index'

export default function HeroVisual() {
  return (
    <Reveal delay={150} className="relative w-full max-w-sm mx-auto lg:mx-0">
      <div className="relative aspect-[4/5] rounded-2xl bg-[#10231A] overflow-hidden ring-1 ring-white/10 shadow-[0_24px_60px_-18px_rgba(20, 83, 45,0.55)]">
        {/* Detection grid */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Depth glows */}
        <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-[#14532D]/40 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#FACC15]/15 blur-3xl" />

        {/* Detection region 1 */}
        <div className="absolute left-[11%] top-[26%] w-[46%] h-[40%] rounded-lg border-2 border-[#FACC15]">
          <span className="absolute -top-[22px] left-0 whitespace-nowrap text-[9px] font-semibold text-[#10231A] bg-[#FACC15] px-1.5 py-0.5 rounded">
            Chicken 01 Â· Healthy
          </span>
        </div>

        {/* Detection region 2 */}
        <div className="absolute right-[9%] bottom-[24%] w-[40%] h-[34%] rounded-lg border-2 border-[#10B981]">
          <span className="absolute -top-[22px] left-0 whitespace-nowrap text-[9px] font-semibold text-white bg-[#10B981] px-1.5 py-0.5 rounded">
            Chicken 02 Â· Healthy
          </span>
        </div>

        {/* Scan sweep */}
        <div className="ps-scan-line absolute left-0 right-0 h-[2px] bg-[#FACC15]/70 shadow-[0_0_16px_4px_rgba(250, 204, 21,0.30)]" />

        <ScanCorners color="#F7FAF8" />

        {/* Live readout strip */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-wider uppercase text-white/50">
            Analyzing frameâ€¦
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#FACC15]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
            CV model
          </span>
        </div>
      </div>

      <ScanReadoutCard />
    </Reveal>
  )
}
