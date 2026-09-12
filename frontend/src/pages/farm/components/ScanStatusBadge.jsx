import {
  MdCheckCircle,
  MdError,
  MdHourglassEmpty,

} from 'react-icons/md';

export default function ScanStatusBadge({ status }) {
  const config = {
    COMPLETED: { icon: MdCheckCircle, bg: '#E8F5E9', color: '#2E7D32', label: 'Completed' },
    PROCESSING: { icon: MdHourglassEmpty, bg: '#FFF0D9', color: '#B45309', label: 'Processing' },
    FAILED: { icon: MdError, bg: '#FFEBEE', color: '#D32F2F', label: 'Failed' },
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
