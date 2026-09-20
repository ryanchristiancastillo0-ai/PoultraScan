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
    <div className="bg-[#F7FAF8] text-[#10231A] antialiased min-h-dvh mb-10 lg:mb-0 flex flex-col font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
          
  <TopNav />

<div className="md:hidden">
  <BottomNav />
</div>
  

      <main className="flex-grow pt-[calc(env(safe-area-inset-top)+6rem)] md:pt-24 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] md:pb-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#718279] mb-4">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-[#14532D] font-semibold">Farms</span>
        </div>

        {/* Header */}
     <div className="relative overflow-hidden rounded-2xl mb-6 bg-gradient-to-br from-[#14532D] to-[#166534] shadow-lg shadow-[#14532D]/20">
        {/* background photo */}
        <img
          src="/img/hero.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, transparent 35%, black 80%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 35%, black 80%)',
          }}
        />
     
        {/* decorative glows */}
        <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-24 h-44 w-44 rounded-full bg-[#FACC15]/20 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] font-bold uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
              Farm Management
            </span>
            <h1 className="text-2xl md:text-[28px] font-bold text-white tracking-tight">My Farms</h1>
            <p className="text-white/80 text-sm mt-1.5">
              {activeFarm ? (
                <>
                  Scans will be saved to{' '}
                  <span className="font-semibold text-white">{activeFarm.farm_name}</span>.
                </>
              ) : (
                'Select a farm below to start saving scans to it.'
              )}
            </p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="bg-white text-[#14532D] px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#E9F4EE] transition-colors active:scale-[0.98] w-full sm:w-auto justify-center shadow-sm"
          >
            <MdAdd className="text-lg" />
            Add New Farm
          </button>
        </div>
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
              <h2 className="text-[15px] font-semibold text-[#10231A]">All Farms</h2>
              <span className="text-xs font-semibold text-[#14532D] bg-[#E9F4EE] px-2.5 py-1 rounded-full">
                {farms.length} total
              </span>
            </div>
            <div className="relative w-full sm:w-72">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718279] text-lg pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search farms..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#E4ECE7] text-sm text-[#10231A] placeholder-[#718279] focus:outline-none focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/20 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E4ECE7] overflow-hidden shadow-card">
                <div className="aspect-[16/10] skeleton rounded-none" />
                <div className="p-5 space-y-3">
                  <div className="h-4 skeleton w-2/3" />
                  <div className="h-3 skeleton w-1/2" />
                  <div className="h-10 skeleton mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#FECACA] shadow-card">
            <p className="text-sm text-[#EF4444] font-medium">{error}</p>
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
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E4ECE7] shadow-card">
            <p className="text-sm text-[#4B6357]">
              No farms match <span className="font-semibold text-[#10231A]">"{query}"</span>.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && farms?.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#E4ECE7] flex flex-col items-center gap-4 shadow-card">
            <div className="w-16 h-16 rounded-2xl bg-[#E9F4EE] flex items-center justify-center text-[#14532D]">
              <MdGridView className="text-3xl" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#10231A]">No farms yet</h3>
              <p className="text-sm text-[#4B6357] mt-1">Get started by adding your first farm location.</p>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="bg-gradient-to-br from-[#14532D] to-[#166534] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-[#166534] hover:to-[#052E16] transition-all active:scale-[0.98] flex items-center gap-2 mt-2 shadow-md shadow-[#14532D]/25"
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