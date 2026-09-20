import {
  MdInfoOutline,
} from 'react-icons/md';
import {useNavigate} from 'react-router-dom'
export default function NoActiveFarmNotice() {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-2xl border border-dashed border-[#E4ECE7]">
      <span className="w-12 h-12 rounded-full bg-[#E9F4EE] flex items-center justify-center mx-auto mb-4">
        <MdInfoOutline className="text-2xl text-[#14532D]" />
      </span>
      <h2 className="text-lg font-bold text-[#10231A]">No farm selected</h2>
      <p className="text-sm text-[#4B6357] mt-1 max-w-sm mx-auto leading-relaxed">
        Choose which farm this scan belongs to before continuing.
      </p>
      <button
        onClick={() => navigate('/farm')}
        className="mt-5 bg-gradient-to-r from-[#14532D] to-[#166534] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-[#166534] hover:to-[#052E16] transition-all"
      >
        Go to My Farms
      </button>
    </div>
  );
}