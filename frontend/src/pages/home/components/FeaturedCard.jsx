import {Reveal,ScanCorners} from './index'

export default function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <Reveal delay={delay} className="group relative bg-[#F8FAF7] rounded-xl border border-[#E5E7EB] p-6 overflow-hidden hover:border-[#66BB6A]/40 transition-colors">
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <ScanCorners color="#66BB6A" />
      </div>
      <span className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] text-lg">
        <Icon />
      </span>
      <h3 className="text-base font-bold text-[#1B1D1B] mt-4">{title}</h3>
      <p className="text-sm text-[#1B1D1B]/65 mt-2 leading-relaxed">{description}</p>
    </Reveal>
  );
}