export default function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-[#E4ECE7] last:border-b-0">
      <span className="w-10 h-10 rounded-xl bg-[#E9F4EE] flex items-center justify-center text-[#14532D] flex-shrink-0">
        <Icon className="text-lg" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[#4B6357]">{label}</p>
        <p className="text-sm font-medium text-[#10231A] mt-0.5 truncate">{value || '—'}</p>
      </div>
    </div>
  );
}