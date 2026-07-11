import {ScanStatusBadge} from './index'
import { useRecentScans } from '../hooks/useRecentScan';

export default function RecentScansTable({ farmId }) {
  const { scans, loading, error } = useRecentScans(farmId);

  const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="lg:col-span-12 bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="p-5 md:p-6 border-b border-[#E5E7EB] flex justify-between items-center">
        <h3 className="text-[15px] font-semibold text-[#111827]">Recent Scans</h3>
        {!loading && !error && scans.length > 0 && (
          <span className="text-xs font-semibold text-[#2F5D3A] bg-[#EEF3EF] px-2.5 py-1 rounded-full">
            {scans.length} total
          </span>
        )}
      </div>

      {loading && (
        <div className="p-10 text-center">
          <p className="text-sm text-[#6B7280]">Loading scans...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-10 text-center">
          <p className="text-sm text-[#DC2626] font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && scans.length === 0 && (
        <div className="p-10 text-center">
          <p className="text-sm text-[#6B7280]">No scans recorded yet.</p>
        </div>
      )}

      {!loading && !error && scans.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[#E5E7EB] bg-[#F7F8F5]">
                <th className="px-5 py-3 text-[11px] text-[#6B7280] uppercase tracking-wide font-semibold">ID</th>
                <th className="px-5 py-3 text-[11px] text-[#6B7280] uppercase tracking-wide font-semibold">Type</th>
                <th className="px-5 py-3 text-[11px] text-[#6B7280] uppercase tracking-wide font-semibold">Status</th>
                <th className="px-5 py-3 text-[11px] text-[#6B7280] uppercase tracking-wide font-semibold">Started</th>
                <th className="px-5 py-3 text-[11px] text-[#6B7280] uppercase tracking-wide font-semibold">Finished</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr
                  key={scan.id}
                  className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F7F8F5] transition-colors"
                >
                  <td className="px-5 py-3 font-semibold text-[#111827]">#{scan.id}</td>
                  <td className="px-5 py-3 text-[#6B7280]">{scan.scan_type}</td>
                  <td className="px-5 py-3"><ScanStatusBadge status={scan.status} /></td>
                  <td className="px-5 py-3 text-[#6B7280]">{formatDate(scan.started_at)}</td>
                  <td className="px-5 py-3 text-[#6B7280]">{formatDate(scan.finished_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
