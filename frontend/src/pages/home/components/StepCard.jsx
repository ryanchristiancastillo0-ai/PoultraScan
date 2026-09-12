import {Reveal} from './index'

export default function StepCard({ index, title, description, delay }) {
  return (
    <Reveal delay={delay} className="relative bg-white rounded-xl border border-[#E5E7EB] p-6">
      <span className="font-mono text-xs font-semibold text-[#66BB6A]">{index}</span>
      <h3 className="text-lg font-bold text-[#1B1D1B] mt-3">{title}</h3>
      <p className="text-sm text-[#1B1D1B]/65 mt-2 leading-relaxed">{description}</p>
    </Reveal>
  );
}