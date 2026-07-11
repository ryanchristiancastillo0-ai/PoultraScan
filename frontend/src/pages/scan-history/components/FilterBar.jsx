import {useState,useEffect} from 'react'
import { MdSearch,MdCalendarMonth} from 'react-icons/md';
import { getMyFarms } from '../../../pages/farm/api/farmApi';
export default function FilterBar({ filters, onChange }) {
  const [search, setSearch] = useState(filters.search);
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    getMyFarms().then(setFarms).catch(() => setFarms([]));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== filters.search) onChange({ search });
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-3 sm:p-4 mb-5 flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-3 sm:items-center shadow-sm">
      <div className="w-full sm:flex-1 sm:min-w-[200px] h-11 border border-[#E5E7EB] rounded-lg flex items-center px-4 bg-[#F7F8F5] focus-within:ring-2 focus-within:ring-[#2F5D3A]/20 focus-within:border-[#2F5D3A]/40 transition-all">
        <MdSearch className="text-[#9CA3AF] mr-2 text-lg flex-shrink-0" />
        <input
          className="w-full bg-transparent border-none outline-none text-[#111827] placeholder:text-[#9CA3AF] text-sm focus:ring-0"
          placeholder="Search by farm name..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

     
     <div className="h-11 border border-[#E5E7EB] rounded-lg flex items-center px-3 bg-[#F7F8F5] w-full sm:min-w-[150px] sm:w-auto text-[#6B7280] text-sm gap-2">
        <MdCalendarMonth className="text-lg flex-shrink-0" />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onChange({ dateTo: e.target.value })}
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-[#111827] text-sm"
        />
      </div>

     <select
        value={filters.farmId}
        onChange={(e) => onChange({ farmId: e.target.value })}
        className="h-11 border border-[#E5E7EB] rounded-lg px-4 bg-[#F7F8F5] w-full sm:w-[180px] text-[#111827] text-sm outline-none cursor-pointer uppercase"
      >
        <option value="">All Farms</option>
        {farms.map((farm) => (
          <option key={farm.id} value={farm.id}>{farm.farm_name}</option>
        ))}
      </select>

      {(filters.search || filters.farmId || filters.dateFrom || filters.dateTo) && (
        <button
          onClick={() => {
            setSearch('');
            onChange({ search: '', farmId: '', dateFrom: '', dateTo: '' });
          }}
          className="h-11 px-4 border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-semibold hover:bg-[#F7F8F5] transition-colors w-full sm:w-auto"
        >
          Clear
        </button>
      )}
    </div>
  );
}