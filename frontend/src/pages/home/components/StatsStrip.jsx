import {Reveal} from './index'

export default function StatsStrip() {
  const stats = [
    { value: '12,400+', label: 'birds scanned this month' },
    { value: '94.2%', label: 'detection accuracy' },
    { value: '3.8s', label: 'average scan time' },
    { value: '500+', label: 'farms onboarded' },
  ];

  return (
    <section className="bg-[#006F4E]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="text-center md:text-left">
            <p className="font-mono text-2xl md:text-3xl font-semibold text-white">{s.value}</p>
            <p className="text-xs md:text-sm text-white/70 mt-1">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}