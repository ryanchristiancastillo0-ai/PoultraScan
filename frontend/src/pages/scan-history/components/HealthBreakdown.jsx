export default function HealthBreakdown({ healthy, diseased, total }) {
  if (total == null) {
    return <span className="text-[#718279] italic text-sm">--</span>;
  }
  const allHealthy = diseased === 0;
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: allHealthy ? '#14532D' : '#EF4444' }}
      />
      <span className="font-medium text-[#10231A] text-sm">
        {healthy ?? 0} Healthy / {diseased ?? 0} Diseased
      </span>
    </div>
  );
}