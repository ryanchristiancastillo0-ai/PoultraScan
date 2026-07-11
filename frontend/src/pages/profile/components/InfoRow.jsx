export default function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-[#F0F1F3] last:border-b-0">
      <span className="w-9 h-9 rounded-lg bg-[#F7F8F5] flex items-center justify-center text-[#6B7280] flex-shrink-0">
        <Icon className="text-lg" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[#6B7280]">{label}</p>
        <p className="text-sm font-medium text-[#111827] mt-0.5 truncate">{value || '—'}</p>
      </div>
    </div>
  );
}