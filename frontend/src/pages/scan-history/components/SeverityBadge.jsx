export default function SeverityBadge({ severity }) {
  const styles = {
    LOW: 'bg-[#E9F4EE] text-[#14532D]',
    MEDIUM: 'bg-[#FEF3C7] text-[#D97706]',
    HIGH: 'bg-[#FEF2F2] text-[#EF4444]',
  };
  if (!severity) return null;
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${styles[severity] || 'bg-[#F7FAF8] text-[#4B6357]'}`}>
      {severity}
    </span>
  );
}