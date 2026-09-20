import {Reveal} from './index'

export default function StepCard({ index, title, description, delay }) {
  return (
    <Reveal delay={delay} className="relative bg-white rounded-xl border border-[#E4ECE7] p-6">
      <span className="font-mono text-xs font-semibold text-[#FACC15]">{index}</span>
      <h3 className="text-lg font-bold text-[#10231A] mt-3">{title}</h3>
      <p className="text-sm text-[#10231A]/65 mt-2 leading-relaxed">{description}</p>
    </Reveal>
  );
}