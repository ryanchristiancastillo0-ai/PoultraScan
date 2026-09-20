import {
  MdCheckCircle,
  MdError,
  MdHourglassEmpty,

} from 'react-icons/md';

export default function ScanStatusBadge({ status }) {
  const config = {
    COMPLETED: { icon: MdCheckCircle, bg: '#D1FAE5', color: '#059669', label: 'Completed' },
    PROCESSING: { icon: MdHourglassEmpty, bg: '#FEF3C7', color: '#D97706', label: 'Processing' },
    FAILED: { icon: MdError, bg: '#FEF2F2', color: '#EF4444', label: 'Failed' },
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
