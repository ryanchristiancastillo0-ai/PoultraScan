import { MdClose, MdInfo, MdCheckCircle, MdWarning, MdError } from 'react-icons/md';
import {PoultraScanLoader} from './ui';

const variantConfig = {
  info: { Icon: MdInfo, iconBg: 'bg-[#E9F4EE]', iconColor: 'text-[#14532D]' },
  success: { Icon: MdCheckCircle, iconBg: 'bg-[#D1FAE5]', iconColor: 'text-[#10B981]' },
  warning: { Icon: MdWarning, iconBg: 'bg-[#FEF3C7]', iconColor: 'text-[#F59E0B]' },
  error: { Icon: MdError, iconBg: 'bg-[#FEF2F2]', iconColor: 'text-[#EF4444]' },
};

const sizeConfig = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export default function AppModal({
  isOpen,
  onClose,
  title,
  variant = 'info',
  message,
  children,
  size = 'sm',
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  confirmClassName,
  footer,
}) {
  if (!isOpen) return null;

  const config = variantConfig[variant] || variantConfig.info;
  const Icon = config.Icon;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${sizeConfig[size] || sizeConfig.sm} bg-white rounded-2xl shadow-modal animate-modal-in overflow-hidden`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full text-[#718279] hover:bg-[#F7FAF8] hover:text-[#10231A] transition-colors"
        >
          <MdClose className="text-lg" />
        </button>

        <div className="p-6 flex flex-col items-center text-center gap-3">
          <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center`}>
            <Icon className={`text-2xl ${config.iconColor}`} />
          </div>

          <h2 className="text-base font-bold text-[#10231A]">{title}</h2>

          {(message || children) && (
            <div className="text-sm text-[#4B6357] leading-relaxed">
              {message || children}
            </div>
          )}
        </div>

        {(footer || onConfirm) && (
          <div className="px-6 pb-6 flex gap-3">
            {footer ? (
              footer
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border border-[#E4ECE7] text-sm font-semibold text-[#10231A] hover:bg-[#F7FAF8] transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                    confirmClassName || 'bg-gradient-to-r from-[#14532D] to-[#166534] hover:from-[#166534] hover:to-[#052E16]'
                  }`}
                >
                  {loading ? (
                    <PoultraScanLoader size={18} label={null} className="gap-0" />
                  ) : (
                    confirmText
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}