export default  function ScanReadoutCard() {
  return (
    <div className="ps-float absolute -bottom-6 -left-6 md:-left-10 bg-white rounded-xl shadow-[0_16px_40px_rgba(16, 40, 31,0.18)] p-4 w-56">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] font-semibold text-[#10231A]/50 uppercase tracking-wider">
          Batch 04 Â· Coop B
        </span>
        <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-2xl font-semibold text-[#10231A] leading-none">96%</p>
          <p className="text-xs text-[#10231A]/60 mt-1">Flock healthy</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-semibold text-[#EF4444] leading-none">3</p>
          <p className="text-xs text-[#10231A]/60 mt-1">flagged</p>
        </div>
      </div>
    </div>
  );
}