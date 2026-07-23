import {Reveal} from './index'

export default function StepCard({ index, title, description, delay }) {
  return (
    <Reveal delay={delay} className="relative bg-white rounded-xl border border-[#E0DFDB] p-6">
      <span className="font-mono text-xs font-semibold text-[#00A86B]">{index}</span>
      <h3 className="text-lg font-bold text-[#2C3E50] mt-3">{title}</h3>
      <p className="text-sm text-[#2C3E50]/65 mt-2 leading-relaxed">{description}</p>
    </Reveal>
  );
}