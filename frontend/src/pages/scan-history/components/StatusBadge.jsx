import {
  MdSync,
  MdErrorOutline,
} from 'react-icons/md';

export default function StatusBadge({ status }) {
  const styles = {
    COMPLETED: 'bg-[#E8F5E9] text-[#2E7D32]',
    PROCESSING: 'bg-[#FFF6E0] text-[#B45309]',
    FAILED: 'bg-[#FFEBEE] text-[#D32F2F]',
  };
  const labels = { COMPLETED: 'Completed', PROCESSING: 'Processing', FAILED: 'Failed' };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 w-max ${styles[status] || styles.PROCESSING}`}>
      {status === 'PROCESSING' && <MdSync className="text-xs animate-spin" />}
      {status === 'FAILED' && <MdErrorOutline className="text-xs" />}
      {labels[status] || status}
    </span>
  );
}