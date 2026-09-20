import {
  MdWarningAmber,
} from 'react-icons/md';
export default function AccuracyNotice() {
  return (
    <div className="flex gap-2.5 items-start bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-3.5 mb-5">
      <MdWarningAmber className="text-[#F59E0B] text-lg flex-shrink-0 mt-0.5" />
      <p className="text-xs text-[#D97706] leading-relaxed">
        <span className="font-semibold text-[#92400E]">AI results are estimates, not diagnoses.</span>{' '}
        This system can occasionally be wrong on disease detection, weight, or count. For sick or high-value flocks,
        please confirm with a licensed poultry veterinarian before acting on these results.
      </p>
    </div>
  );
}