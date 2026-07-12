import  { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdGridView, MdSearch,MdTrendingUp,} from 'react-icons/md';

import { useFarms } from '../hooks/useFarms';
import { useSaveFarm } from '../hooks/useCreateFarm';
import { useActiveFarm } from '../../../context/activeFarmContext';
import {TopNav,BottomNav} from '../../../components/index'

import {EditFarmModal,FarmCard,StatPill} from '../components/index'



export default function FarmsList() {
  const navigate = useNavigate();

  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState('');

  const { farms, loading, error, refetch } = useFarms();
  const { save, loading: saving, error: saveError } = useSaveFarm();
  const { activeFarmId, setActiveFarmId } = useActiveFarm();

  const totalCapacity = farms?.reduce((sum, f) => sum + (Number(f.capacity) || 0), 0) ?? 0;
  const activeFarm = farms?.find((f) => f.id === activeFarmId);

  const filteredFarms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return farms;
    return farms?.filter(
      (f) =>
        f.farm_name?.toLowerCase().includes(q) ||
        f.location?.toLowerCase().includes(q)
    );
  }, [farms, query]);

  const handleAddFarm = async (data) => {
    try {
      await save(data, null);
      setAddOpen(false);
      refetch();
    } catch (err) {
      // saveError already set by the hook; modal stays open so user sees it
    }
  };

  return (
    <div className="bg-[#F7F8F5] text-[#111827] antialiased min-h-screen mb-10 lg:mb-0 flex flex-col font-['Manrope','Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
          
  <TopNav />

<div className="md:hidden">
  <BottomNav />
</div>
  

      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-4">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-[#2F5D3A] font-semibold">Farms</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-[28px] font-bold text-[#111827] tracking-tight">My Farms</h1>
            <p className="text-[#6B7280] text-sm mt-1.5">
              {activeFarm ? (
                <>
                  Scans will be saved to{' '}
                  <span className="font-semibold text-[#111827]">{activeFarm.farm_name}</span>.
                </>
              ) : (
                'Select a farm below to start saving scans to it.'
              )}
            </p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="bg-[#2F5D3A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#274d31] transition-colors active:scale-[0.98] w-full sm:w-auto justify-center"
          >
            <MdAdd className="text-lg" />
            Add New Farm
          </button>
        </div>

        {/* Metric pills */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 mb-8">
          <StatPill label="Farms" value={farms?.length ?? 0} icon={MdGridView} />
          <StatPill label="Total Capacity" value={totalCapacity.toLocaleString()} icon={MdTrendingUp} />
        </div>

        {/* Toolbar */}
        {!loading && !error && farms?.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-semibold text-[#111827]">All Farms</h2>
              <span className="text-xs font-semibold text-[#2F5D3A] bg-[#EEF3EF] px-2.5 py-1 rounded-full">
                {farms.length} total
              </span>
            </div>
            <div className="relative w-full sm:w-72">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search farms..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2F5D3A] focus:ring-2 focus:ring-[#2F5D3A]/20 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[16/10] bg-[#F7F8F5]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-[#E5E7EB] rounded w-2/3" />
                  <div className="h-3 bg-[#E5E7EB] rounded w-1/2" />
                  <div className="h-10 bg-[#F7F8F5] rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-[#FECACA]">
            <p className="text-sm text-[#DC2626] font-medium">{error}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && farms?.length > 0 && filteredFarms?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFarms.map((farm) => (
              <FarmCard
                key={farm.id}
                farm={farm}
                isActive={farm.id === activeFarmId}
                onSelectActive={() => setActiveFarmId(farm.id)}
                onOpenDetails={() => navigate(`/farm/${farm.id}`)}
              />
            ))}
          </div>
        )}

        {/* No search matches */}
        {!loading && !error && farms?.length > 0 && filteredFarms?.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-[#E5E7EB] shadow-sm">
            <p className="text-sm text-[#6B7280]">
              No farms match <span className="font-semibold text-[#111827]">"{query}"</span>.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && farms?.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[#E5E7EB] flex flex-col items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-xl bg-[#EEF3EF] flex items-center justify-center text-[#2F5D3A]">
              <MdGridView className="text-3xl" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#111827]">No farms yet</h3>
              <p className="text-sm text-[#6B7280] mt-1">Get started by adding your first farm location.</p>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="bg-[#2F5D3A] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#274d31] transition-colors active:scale-[0.98] flex items-center gap-2 mt-2"
            >
              <MdAdd className="text-lg" />
              Add Your First Farm
            </button>
          </div>
        )}
      </main>

      {addOpen && (
        <EditFarmModal
          farm={null}
          onClose={() => setAddOpen(false)}
          onSave={handleAddFarm}
          saving={saving}
          error={saveError}
        />
      )}
    </div>
  );
}