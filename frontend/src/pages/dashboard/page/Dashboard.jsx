import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdCenterFocusStrong,
  MdCheckCircle,
  MdWarning,
   MdHomeWork,
} from 'react-icons/md';

import { useDashboardStats } from '../hooks/useDashboard';

import {TopNav,Footer,BottomNav} from  '../../../components/index'
import {AlertFeed,AnomalyChart,FarmHealthChart,MetricCard,ScanSummary} from '../components/index'

// ---------- Dashboard (default export) ----------
export default function Dashboard() {
  
  const navigate = useNavigate();
  const { stats, loading, error } = useDashboardStats();

  const handleNewScan = () => {
    navigate('/scan');
  };

  return (
    <div className="bg-[#F7F8F5] text-[#111827] antialiased min-h-screen flex flex-col font-['Manrope','Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
  
  <TopNav />

<div className="md:hidden">
  <BottomNav />
</div>
  

      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-[28px] font-bold text-[#111827] tracking-tight">Overview</h1>
            <p className="text-[#6B7280] text-sm mt-1.5">Today's system metrics and diagnostics.</p>
          </div>
          <button
            onClick={handleNewScan}
            className="bg-[#2F5D3A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#274d31] transition-colors active:scale-[0.98] w-full sm:w-auto justify-center"
          >
            <MdAdd className="text-lg" />
            New Scan
          </button>
        </div>

        {loading && (
         <div className="flex flex-col items-center justify-center py-20 gap-3">
  <div className="w-8 h-8 border-4 border-[#E5E7EB] border-t-[#6B7280] rounded-full animate-spin" />
  <p className="text-sm text-[#6B7280] animate-pulse">Loading dashboard...</p>
</div>
        )}

        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-[#FECACA]">
            <p className="text-sm text-[#DC2626] font-medium">Couldn't load dashboard — {error}</p>
          </div>
        )}

        {!loading && !error && stats && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
           <div className="md:col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <MetricCard
                icon={MdHomeWork}
                label="Total Farms"
                value={stats.total_farms.toLocaleString()}
                caption="Farms under your account"
                accent="farm"
              />
              <MetricCard
                icon={MdCenterFocusStrong}
                label="Total Scans"
                value={stats.total_scans.toLocaleString()}
                caption="All-time, across all farms"
                accent="teal"
              />
              <MetricCard
                icon={MdCheckCircle}
                label="Healthy Chickens"
                value={`${stats.healthy_percentage}%`}
                caption={`${stats.total_birds_detected.toLocaleString()} chickens scanned total`}
                accent="green"
              />
              <MetricCard
                icon={MdWarning}
                label="Anomalies Detected"
                value={stats.anomalies_detected.toLocaleString()}
                caption="Across all completed scans"
                accent="red"
              />
            </div>

            <ScanSummary recentScans={stats.recent_scans} />
            <AlertFeed recentEvents={stats.recent_events} />

            <AnomalyChart diseaseBreakdown={stats.disease_breakdown} totalAnomalies={stats.anomalies_detected} />
            <FarmHealthChart farmHealthIndex={stats.farm_health_index} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}