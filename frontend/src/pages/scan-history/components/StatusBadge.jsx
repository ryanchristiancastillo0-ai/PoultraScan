import {
  MdSync,
  MdErrorOutline,
} from 'react-icons/md';

export default function StatusBadge({ status }) {
  const styles = {
    COMPLETED: 'bg-[#EAF2EC] text-[#2F5D3A]',
    PROCESSING: 'bg-[#FBF4E6] text-[#B45309]',
    FAILED: 'bg-[#FBEBEB] text-[#B91C1C]',
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