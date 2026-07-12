import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../middleware/AuthContext'; 

import { useScanCache, getCachedScan, fileToBase64 } from '../hooks/useScanCache';
import { useDetection } from '../hooks/useDetection';
import { useAiPrediction } from '../hooks/useAiPrediction';
import { createScanSession } from '../api/scanSession';
import { useActiveFarm } from '../../../context/activeFarmContext';
import { CameraCaptureModal,NoActiveFarmNotice,ScanningView,ResultsView,FarmRequiredModal, } from '../components/index';
import { TopNav,Footer,BottomNav} from '../../../components/index';
import {isFarmMissingError} from '../../../utils/farmMissingHandler'
import { MdInfoOutline } from 'react-icons/md';

const DEFAULT_IMAGE_TYPE = 'FRONT';



export default function AiScan() {
  const navigate = useNavigate();
  const { activeFarmId } = useActiveFarm();
  const { user } = useAuth();
  const farmId = activeFarmId;
  const userId = user?.id;

  const initialCache = (farmId && userId) ? getCachedScan(userId, farmId) : null;

  const [scanState, setScanState] = useState(initialCache ? 'results' : 'scanning');
  const [previewUrl, setPreviewUrl] = useState(initialCache?.previewUrl ?? null);
  const [resultData, setResultData] = useState(
    initialCache
      ? { detectionData: initialCache.detectionData, predictionData: initialCache.predictionData }
      : null
  );
  const [errorMsg, setErrorMsg] = useState(null);
  const [showFarmModal, setShowFarmModal] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const uploadInputRef = useRef(null);

  const { runDetection, loading: detectionLoading } = useDetection();
  const { runPrediction, loading: predictionLoading } = useAiPrediction();
  const { saveCache, clearCache } = useScanCache(farmId);

  const isProcessing = detectionLoading || predictionLoading;

  const runFullScan = async (file, scanType) => {
    if (!farmId) {
      setShowFarmModal(true);
      return;
    }

    setErrorMsg(null);
    const blobPreview = URL.createObjectURL(file);
    setPreviewUrl(blobPreview);

    try {
      const sessionResult = await createScanSession({ farmId, scanType });
      const newScanSessionId = sessionResult.session.id;

      const detectionResult = await runDetection({ scanSessionId: newScanSessionId, imageFile: file });
      const predictionResult = await runPrediction({ scanSessionId: newScanSessionId, imageType: DEFAULT_IMAGE_TYPE, file });

      setResultData({ detectionData: detectionResult, predictionData: predictionResult });
      setScanState('results');

      const base64Preview = await fileToBase64(file);
      setPreviewUrl(base64Preview);
      saveCache({
        previewUrl: base64Preview,
        detectionData: detectionResult,
        predictionData: predictionResult,
      });
    } catch (err) {
      const message = err.message || 'Scan failed. Please try again.';

      if (isFarmMissingError(message)) {
        setPreviewUrl(null);
        setShowFarmModal(true);
        return;
      }

      setErrorMsg(message);
    }
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (file) runFullScan(file, 'UPLOAD');
    e.target.value = '';
  };

  const handleUpload = () => {
    if (!farmId) {
      setShowFarmModal(true);
      return;
    }
    uploadInputRef.current?.click();
  };

  const handleCapture = () => {
    if (!farmId) {
      setShowFarmModal(true);
      return;
    }
    setCameraOpen(true);
  };

  const handleCameraCapture = (file) => {
    setCameraOpen(false);
    runFullScan(file, 'WEBCAM');
  };

  const handleScanAgain = () => {
    clearCache();
    setResultData(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    setScanState('scanning');
  };



  return (
    <div className="min-h-screen bg-[#F7F8F5] font-sans">
      <TopNav onMenuClick={() => setMobileNavOpen(true)} />

        <div className="md:hidden">
  <BottomNav />
</div>

      <main className="px-4 py-8 md:py-12 mt-16 max-w-[1200px] mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-[#EAF2EC] text-[#2F5D3A] text-[10px] font-bold uppercase tracking-widest mb-3">
            AI-Powered
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight text-balance">AI Diagnostic Scanner</h1>
          <p className="mt-2 text-sm text-[#6B7280] max-w-xl mx-auto leading-relaxed text-pretty">
            Position the camera to clearly capture the flock. The AI will automatically detect chickens and analyze their health status.
          </p>

          {farmId && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF2EC] border border-[#CFE2D4]">
              <MdInfoOutline className="text-[#2F5D3A] text-sm flex-shrink-0" />
              <span className="text-xs text-[#2F5D3A] font-medium">
                Make sure you've created or selected a farm — results are saved to that farm in your account.
              </span>
            </div>
          )}
        </div>

        {!farmId ? (
          <NoActiveFarmNotice />
        ) : scanState === 'scanning' ? (
          <ScanningView
            onCapture={handleCapture}
            onUpload={handleUpload}
            uploadInputRef={uploadInputRef}
            onFileSelected={handleFileSelected}
            isProcessing={isProcessing}
            previewUrl={previewUrl}
            errorMsg={errorMsg}
          />
        ) : (
          <ResultsView
            onScanAgain={handleScanAgain}
            
            detectionData={resultData?.detectionData}
            predictionData={resultData?.predictionData}
            previewUrl={previewUrl}
          />
        )}

        <Footer />
      </main>

      {cameraOpen && (
        <CameraCaptureModal
          onCapture={handleCameraCapture}
          onClose={() => setCameraOpen(false)}
        />
      )}

      {showFarmModal && (
        <FarmRequiredModal
          onClose={() => setShowFarmModal(false)}
          onNavigate={() => navigate('/farm')}
        />
      )}
    </div>
  );
}