import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MdEdit,
  MdGridView,
  MdDelete,
  MdArrowBack,
} from 'react-icons/md';


import { useFarm } from '../hooks/useFarm';
import { useSaveFarm } from '../hooks/useCreateFarm';

import { deleteFarm } from '../api/farmApi';
import {EditFarmModal,DeleteFarmModal,FarmInfoCard,RecentScansTable,} from '../components/index';
import {TopNav,Footer,BottomNav,PoultraScanLoader} from '../../../components/index'




export default function FarmDetails() {
  const { farmId } = useParams();
  const navigate = useNavigate();


  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const { farm, loading, error, refetch } = useFarm(farmId);
  const { save, loading: saving, error: saveError } = useSaveFarm();

  const handleOpenModal = () => {
    setEditOpen(true);
  };

  const handleSaveFarm = async (data) => {
    try {
      await save(data, farm?.id);
      setEditOpen(false);
      refetch();
    } catch (err) {
      // saveError already set by the hook; modal stays open so user sees it
    }
  };

  const handleDeleteFarm = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteFarm(farm.id);
      navigate('/farm');
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete farm. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-[#F7FAF8] text-[#10231A] antialiased min-h-dvh flex flex-col font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
     
  <TopNav />

<div className="md:hidden">
  <BottomNav />
</div>

      <main className="flex-grow pt-[calc(env(safe-area-inset-top)+2.5rem)] lg:pt-24 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] md:pb-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#718279] mb-4">
          <button onClick={() => navigate('/farm')} className="hover:text-[#14532D] transition-colors">
            Farms
          </button>
          <span>/</span>
          <span className="text-[#14532D] font-semibold">
            {farm?.farm_name || 'Details'}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate('/farm')}
              aria-label="Back to farms"
              className="mt-0.5 w-9 h-9 rounded-lg border border-[#E4ECE7] bg-white flex items-center justify-center text-[#4B6357] hover:text-[#14532D] hover:border-[#C5D6CC] transition-colors flex-shrink-0"
            >
              <MdArrowBack className="text-lg" />
            </button>
            <div>
              <h1 className="text-2xl md:text-[28px] font-bold text-[#10231A] tracking-tight">Farm Details</h1>
              <p className="text-[#4B6357] text-sm mt-1.5">Manage operations and monitor flock health metrics.</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleOpenModal}
              className="flex-1 sm:flex-none bg-gradient-to-br from-[#14532D] to-[#166534] text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:from-[#166534] hover:to-[#052E16] transition-all active:scale-[0.98] justify-center shadow-md shadow-[#14532D]/25"
            >
              <MdEdit className="text-lg" />
              {farm ? 'Edit Farm' : 'Add Farm'}
            </button>
            {farm && (
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex-1 sm:flex-none bg-white border border-[#E4ECE7] text-[#EF4444] px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#FEF2F2] hover:border-[#FECACA] transition-colors active:scale-[0.98] justify-center"
              >
                <MdDelete className="text-lg" />
                Delete
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E4ECE7] shadow-card">
            <PoultraScanLoader size={48} label="Loading farm details..." />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#FECACA] shadow-card">
            <p className="text-sm text-[#EF4444] font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && farm && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
           <FarmInfoCard
              farmName={farm.farm_name}
              location={farm.location}
              capacity={farm.capacity}
              imageUrl={farm.image_url}
            />
       

            <div className="lg:col-span-12">
              <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-[#E4ECE7] shadow-card">
                <p className="text-sm text-[#4B6357]">Flock stats will appear once scan data is available.</p>
              </div>
            </div>

            <RecentScansTable farmId={farm.id} />
          </div>
        )}

        {!loading && !error && !farm && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#E4ECE7] shadow-card flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E9F4EE] flex items-center justify-center text-[#14532D]">
              <MdGridView className="text-3xl" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#10231A]">No farm added yet</h3>
              <p className="text-sm text-[#4B6357] mt-1">Add a farm to start tracking its flock health.</p>
            </div>
            <button
              onClick={handleOpenModal}
              className="bg-gradient-to-br from-[#14532D] to-[#166534] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-[#166534] hover:to-[#052E16] transition-all active:scale-[0.98] mt-2 shadow-md shadow-[#14532D]/25"
            >
              Add Your Farm
            </button>
          </div>
        )}
      </main>

      {editOpen && (
        <EditFarmModal
          farm={farm}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveFarm}
          saving={saving}
          error={saveError}
        />
      )}

      {deleteOpen && farm && (
        <DeleteFarmModal
          farmName={farm.farm_name}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteFarm}
          deleting={deleting}
          error={deleteError}
        />
      )}

      <Footer />
    </div>
  );
}