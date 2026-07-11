import {
  MdWarningAmber,
} from 'react-icons/md';
export default function AccuracyNotice() {
  return (
    <div className="flex gap-2.5 items-start bg-[#FBF4E6] border border-[#F0E2C0] rounded-xl p-3.5 mb-5">
      <MdWarningAmber className="text-[#D97706] text-lg flex-shrink-0 mt-0.5" />
      <p className="text-xs text-[#8A6A1E] leading-relaxed">
        <span className="font-semibold text-[#7A5A1E]">AI results are estimates, not diagnoses.</span>{' '}
        This system can occasionally be wrong on disease detection, weight, or count. For sick or high-value flocks,
        please confirm with a licensed poultry veterinarian before acting on these results.
      </p>
    </div>
  );
}