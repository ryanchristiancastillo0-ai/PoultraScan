import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdCenterFocusStrong,
  MdCheckCircle,
  MdWarning,
  MdHomeWork,
  MdArrowForward,
  MdRadar,
} from 'react-icons/md';

import { useDashboardStats } from '../hooks/useDashboard';
import { useAuth } from '../../../middleware/AuthContext';

import { TopNav, Footer, BottomNav, PoultraScanLoader } from '../../../components/index';
import { AlertFeed, AnomalyChart, FarmHealthChart, MetricCard, ScanSummary } from '../components/index';

function getFirstName(name) {
  if (!name) return '';
  return String(name).trim().split(' ')[0];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading, error } = useDashboardStats();

  const handleNewScan = () => {
    navigate('/scan');
  };

  const firstName = getFirstName(user?.fullname);

  return (
    <div className="bg-[#F7FAF8] text-[#10231A] antialiased min-h-dvh flex flex-col font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">

      <TopNav />

      <div className="md:hidden">
        <BottomNav />
      </div>

      <main className="flex-grow pt-[calc(env(safe-area-inset-top)+6rem)] md:pt-24 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] md:pb-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        {/* ---------- Hero ---------- */}
                <section className="relative isolate overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#052E16] via-[#14532D] to-[#166534] shadow-card-hover mb-8">
          {/* background photo — faded out on the left so text stays clean, visible toward the right */}
          <img
            src="/img/hero.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, transparent 35%, black 80%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 35%, black 80%)',
            }}
          />
        
          {/* subtle texture + glows */}
          <div className="ps-grid-overlay absolute inset-0 opacity-30" />
          <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-[#10B981]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-[#FACC15]/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="relative px-6 py-8 md:px-10 md:py-10 flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/15 text-white text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
                AI Flock Diagnostics
              </span>

              <h1 className="mt-4 text-[26px] md:text-[34px] font-bold text-white tracking-tight text-balance">
                {firstName ? (
                  <>Welcome back, <span className="text-[#FACC15]">{firstName}</span>.</>
                ) : (
                  'Welcome to PoultraScan.'
                )}
              </h1>
              <p className="mt-2 text-white/75 text-sm md:text-[15px] max-w-lg leading-relaxed">
                Monitor flock health with computer vision — scan, detect, and track
                every bird from one dashboard.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleNewScan}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FACC15] to-[#EAB308] text-[#052E16] px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#FACC15]/25 hover:shadow-[#FACC15]/40 hover:brightness-105 active:scale-[0.98] transition-all"
                >
                  <MdAdd className="text-lg" />
                  Scan Poultry
                  <MdArrowForward className="text-base" />
                </button>
                <button
                  onClick={() => navigate('/scan/history')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-white/10 ring-1 ring-white/20 backdrop-blur-sm hover:bg-white/20 active:scale-[0.98] transition-all"
                >
                  <MdRadar className="text-base text-[#FACC15]" />
                  View Scan History
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ---------- Loading ---------- */}
        {loading && (
          <div className="py-20">
            <PoultraScanLoader label="Loading dashboard..." />
          </div>
        )}

        {/* ---------- Error ---------- */}
        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#FECACA] shadow-card">
            <p className="text-sm text-[#EF4444] font-medium">Couldn't load dashboard — {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm font-semibold text-[#14532D] hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* ---------- Content ---------- */}
        {!loading && !error && stats && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
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