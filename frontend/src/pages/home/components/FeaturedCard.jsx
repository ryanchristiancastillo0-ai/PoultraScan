import {Reveal,ScanCorners} from './index'

export default function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <Reveal delay={delay} className="group relative bg-[#F7FAF8] rounded-xl border border-[#E4ECE7] p-6 overflow-hidden hover:border-[#FACC15]/40 transition-colors">
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <ScanCorners color="#FACC15" />
      </div>
      <span className="w-10 h-10 rounded-lg bg-[#E9F4EE] flex items-center justify-center text-[#14532D] text-lg">
        <Icon />
      </span>
      <h3 className="text-base font-bold text-[#10231A] mt-4">{title}</h3>
      <p className="text-sm text-[#10231A]/65 mt-2 leading-relaxed">{description}</p>
    </Reveal>
  );
}