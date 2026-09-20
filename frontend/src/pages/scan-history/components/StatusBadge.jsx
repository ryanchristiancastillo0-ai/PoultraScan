import {
  MdSync,
  MdErrorOutline,
} from 'react-icons/md';

export default function StatusBadge({ status }) {
  const styles = {
    COMPLETED: 'bg-[#D1FAE5] text-[#059669]',
    PROCESSING: 'bg-[#FEF3C7] text-[#D97706]',
    FAILED: 'bg-[#FEF2F2] text-[#EF4444]',
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