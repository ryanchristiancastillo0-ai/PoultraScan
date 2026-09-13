import { MdClose, MdInfo, MdCheckCircle, MdWarning, MdError } from 'react-icons/md';

const variantConfig = {
  info: { Icon: MdInfo, iconBg: 'bg-[#E3F2FD]', iconColor: 'text-[#1976D2]' },
  success: { Icon: MdCheckCircle, iconBg: 'bg-[#E8F5E9]', iconColor: 'text-[#2E7D32]' },
  warning: { Icon: MdWarning, iconBg: 'bg-[#FFF8E1]', iconColor: 'text-[#F9A825]' },
  error: { Icon: MdError, iconBg: 'bg-[#FFEBEE]', iconColor: 'text-[#D32F2F]' },
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
        className={`relative w-full ${sizeConfig[size] || sizeConfig.sm} bg-white rounded-2xl shadow-xl animate-modal-in overflow-hidden`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full text-[#9CA3AF] hover:bg-[#F8FAF7] hover:text-[#1B1D1B] transition-colors"
        >
          <MdClose className="text-lg" />
        </button>

        <div className="p-6 flex flex-col items-center text-center gap-3">
          <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center`}>
            <Icon className={`text-2xl ${config.iconColor}`} />
          </div>

          <h2 className="text-base font-bold text-[#1B1D1B]">{title}</h2>

          {(message || children) && (
            <div className="text-sm text-[#6B7280] leading-relaxed">
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
                  className="flex-1 py-2.5 rounded-lg border border-[#E5E7EB] text-sm font-semibold text-[#1B1D1B] hover:bg-[#F8FAF7] transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                    confirmClassName || 'bg-[#2E7D32] hover:bg-[#276C2A]'
                  }`}
                >
                  {loading ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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