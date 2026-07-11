export default function SeverityBadge({ severity }) {
  const styles = {
    LOW: 'bg-[#EAF2EC] text-[#2F5D3A]',
    MEDIUM: 'bg-[#FBF4E6] text-[#B45309]',
    HIGH: 'bg-[#FBEBEB] text-[#B91C1C]',
  };
  if (!severity) return null;
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${styles[severity] || 'bg-[#F7F8F5] text-[#6B7280]'}`}>
      {severity}
    </span>
  );
}