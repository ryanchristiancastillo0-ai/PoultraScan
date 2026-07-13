import {MdEmail} from 'react-icons/md'
export default function ContactSupportContent() {
    const SUPPORT_EMAIL = 'louigiecastillo1009@gmail.com';
  return (
    <div className="flex flex-col gap-4">
      <p>
        Need help with your account, a scan result, or something isn't working as expected? Reach
        out and we'll get back to you as soon as possible.
      </p>

      
       <a href={`mailto:${SUPPORT_EMAIL}`}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#EAF2EC] border border-[#CFE2D4] hover:bg-[#DFEDE3] transition-colors"
      >
        <span className="w-9 h-9 rounded-full bg-[#2F5D3A] flex items-center justify-center flex-shrink-0">
          <MdEmail className="text-white text-lg" />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs text-[#6B7280] font-medium">Email us at</span>
          <span className="text-sm font-bold text-[#2F5D3A] break-all">{SUPPORT_EMAIL}</span>
        </div>
      </a>

      <p className="text-xs text-[#9CA3AF]">
        For faster help, include your account email and a brief description of the issue you're
        experiencing.
      </p>
    </div>
  );
}