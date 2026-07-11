import {
  MdCheckCircle,
  MdError,
  MdHourglassEmpty,

} from 'react-icons/md';

export default function ScanStatusBadge({ status }) {
  const config = {
    COMPLETED: { icon: MdCheckCircle, bg: '#EEF3EF', color: '#2F5D3A', label: 'Completed' },
    PROCESSING: { icon: MdHourglassEmpty, bg: '#FEF3C7', color: '#B45309', label: 'Processing' },
    FAILED: { icon: MdError, bg: '#FEE2E2', color: '#DC2626', label: 'Failed' },
  };
  const { icon: Icon, bg, color, label } = config[status] || config.PROCESSING;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: bg, color }}
    >
      <Icon className="text-sm" />
      {label}
    </span>
  );
}
