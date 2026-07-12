import React, { useEffect, useRef, useState } from 'react';
import { MdClose, MdCameraAlt, MdStayCurrentPortrait, MdStayCurrentLandscape } from 'react-icons/md';

export default function CameraCaptureModal({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [orientation, setOrientation] = useState('landscape'); // 'landscape' | 'portrait'

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setReady(true);
        }
      } catch (err) {
        setError(err.message || 'Could not access camera');
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleSnap = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      onCapture(file);
    }, 'image/jpeg', 0.92);
  };

  const handleClose = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onClose();
  };

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === 'landscape' ? 'portrait' : 'landscape'));
  };

  const isPortrait = orientation === 'portrait';

  return (
    <div className="fixed inset-0 z-[60] bg-[#0b1c30]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#0b1c30] rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={handleClose}
          aria-label="Close camera"
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
        >
          <MdClose className="text-xl" />
        </button>

        <button
          onClick={toggleOrientation}
          aria-label="Toggle camera orientation"
          className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/40 text-white text-xs font-semibold hover:bg-black/60 transition-all"
        >
          {isPortrait ? (
            <MdStayCurrentLandscape className="text-lg" />
          ) : (
            <MdStayCurrentPortrait className="text-lg" />
          )}
          {isPortrait ? 'Landscape' : 'Portrait'}
        </button>

        {/*
          Only this container changes size/aspect-ratio when toggling —
          everything else (modal shell, button bar, backdrop) stays fixed.
          Using a max-h so portrait mode doesn't blow past the viewport.
        */}
        <div className="flex items-center justify-center bg-black py-6 px-4 sm:px-6">
          <div
            className={`relative bg-black flex items-center justify-center transition-all duration-300 ease-out overflow-hidden rounded-xl ${
              isPortrait
                ? 'aspect-[3/4] h-[65vh] max-h-[600px] w-auto'
                : 'aspect-video w-full max-h-[70vh]'
            }`}
          >
            {error ? (
              <p className="text-red-300 text-sm px-6 text-center">{error}</p>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="flex justify-center py-5 bg-[#0b1c30]">
          <button
            onClick={handleSnap}
            disabled={!ready || !!error}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#006948] text-white text-base font-semibold hover:bg-[#00855d] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdCameraAlt className="text-xl" />
            Take Photo
          </button>
        </div>
      </div>
    </div>
  );
}