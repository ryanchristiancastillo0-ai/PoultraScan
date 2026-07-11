import {
  MdInfoOutline,
} from 'react-icons/md';

export default function NoActiveFarmNotice() {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-2xl border border-dashed border-[#E5E7EB]">
      <span className="w-12 h-12 rounded-full bg-[#EAF2EC] flex items-center justify-center mx-auto mb-4">
        <MdInfoOutline className="text-2xl text-[#2F5D3A]" />
      </span>
      <h2 className="text-lg font-bold text-[#111827]">No farm selected</h2>
      <p className="text-sm text-[#6B7280] mt-1 max-w-sm mx-auto leading-relaxed">
        Choose which farm this scan belongs to before continuing.
      </p>
      <button
        onClick={() => navigate('/farm')}
        className="mt-5 bg-[#2F5D3A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#254A2E] transition-colors"
      >
        Go to My Farms
      </button>
    </div>
  );
}