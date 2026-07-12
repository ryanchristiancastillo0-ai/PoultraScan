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
import {TopNav,Footer,BottomNav} from '../../../components/index'




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
      navigate('/farms');
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete farm. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-[#F7F8F5] text-[#111827] antialiased min-h-screen flex flex-col font-['Manrope','Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
     
  <TopNav />

<div className="md:hidden">
  <BottomNav />
</div>

      <main className="flex-grow pt-10 lg:pt-24 pb-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-4">
          <button onClick={() => navigate('/farm')} className="hover:text-[#2F5D3A] transition-colors">
            Farms
          </button>
          <span>/</span>
          <span className="text-[#2F5D3A] font-semibold">
            {farm?.farm_name || 'Details'}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate('/farm')}
              aria-label="Back to farms"
              className="mt-0.5 w-9 h-9 rounded-lg border border-[#E5E7EB] bg-white flex items-center justify-center text-[#6B7280] hover:text-[#2F5D3A] hover:border-[#D1D5DB] transition-colors flex-shrink-0"
            >
              <MdArrowBack className="text-lg" />
            </button>
            <div>
              <h1 className="text-2xl md:text-[28px] font-bold text-[#111827] tracking-tight">Farm Details</h1>
              <p className="text-[#6B7280] text-sm mt-1.5">Manage operations and monitor flock health metrics.</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleOpenModal}
              className="flex-1 sm:flex-none bg-[#2F5D3A] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#274d31] transition-colors active:scale-[0.98] justify-center"
            >
              <MdEdit className="text-lg" />
              {farm ? 'Edit Farm' : 'Add Farm'}
            </button>
            {farm && (
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex-1 sm:flex-none bg-white border border-[#E5E7EB] text-[#DC2626] px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#FEE2E2] hover:border-[#FECACA] transition-colors active:scale-[0.98] justify-center"
              >
                <MdDelete className="text-lg" />
                Delete
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-[#E5E7EB] shadow-sm">
            <p className="text-sm text-[#6B7280]">Loading farm details...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-[#FECACA]">
            <p className="text-sm text-[#DC2626] font-medium">{error}</p>
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
              <div className="text-center py-8 bg-white rounded-xl border border-dashed border-[#E5E7EB] shadow-sm">
                <p className="text-sm text-[#6B7280]">Flock stats will appear once scan data is available.</p>
              </div>
            </div>

            <RecentScansTable farmId={farm.id} />
          </div>
        )}

        {!loading && !error && !farm && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[#E5E7EB] shadow-sm flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#EEF3EF] flex items-center justify-center text-[#2F5D3A]">
              <MdGridView className="text-3xl" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#111827]">No farm added yet</h3>
              <p className="text-sm text-[#6B7280] mt-1">Add a farm to start tracking its flock health.</p>
            </div>
            <button
              onClick={handleOpenModal}
              className="bg-[#2F5D3A] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#274d31] transition-colors active:scale-[0.98] mt-2"
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