export default function SeverityBadge({ severity }) {
  const styles = {
    LOW: 'bg-[#E8F5E9] text-[#2E7D32]',
    MEDIUM: 'bg-[#FFF6E0] text-[#B45309]',
    HIGH: 'bg-[#FFEBEE] text-[#D32F2F]',
  };
  if (!severity) return null;
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${styles[severity] || 'bg-[#F8FAF7] text-[#6B7280]'}`}>
      {severity}
    </span>
  );
}