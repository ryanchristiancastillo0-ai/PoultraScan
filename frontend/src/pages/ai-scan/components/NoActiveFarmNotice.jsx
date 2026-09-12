import {
  MdInfoOutline,
} from 'react-icons/md';
import {useNavigate} from 'react-router-dom'
export default function NoActiveFarmNotice() {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-2xl border border-dashed border-[#E5E7EB]">
      <span className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
        <MdInfoOutline className="text-2xl text-[#2E7D32]" />
      </span>
      <h2 className="text-lg font-bold text-[#1B1D1B]">No farm selected</h2>
      <p className="text-sm text-[#6B7280] mt-1 max-w-sm mx-auto leading-relaxed">
        Choose which farm this scan belongs to before continuing.
      </p>
      <button
        onClick={() => navigate('/farm')}
        className="mt-5 bg-[#2E7D32] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#276C2A] transition-colors"
      >
        Go to My Farms
      </button>
    </div>
  );
}