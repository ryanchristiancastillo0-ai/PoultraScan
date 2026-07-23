import {Reveal,ScanCorners} from './index'

export default function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <Reveal delay={delay} className="group relative bg-[#e4e3df] rounded-xl border border-[#D8D7D2] p-6 overflow-hidden hover:border-[#00A86B]/40 transition-colors">
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <ScanCorners color="#00A86B" />
      </div>
      <span className="w-10 h-10 rounded-lg bg-[#E8F5EE] flex items-center justify-center text-[#006F4E] text-lg">
        <Icon />
      </span>
      <h3 className="text-base font-bold text-[#2C3E50] mt-4">{title}</h3>
      <p className="text-sm text-[#2C3E50]/65 mt-2 leading-relaxed">{description}</p>
    </Reveal>
  );
}