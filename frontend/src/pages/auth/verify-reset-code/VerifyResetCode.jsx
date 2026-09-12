import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiHash, FiArrowLeft, FiCheckCircle, FiFeather } from 'react-icons/fi';
import { verifyResetCode } from '../api/auth';

export default function VerifyResetCode() {
  const location = useLocation();
  const navigate = useNavigate();
  // Email is carried via navigation state (not the URL) so it never leaks
  // into the address bar, browser history, or server logs.
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length < 6) {
      setError('Please enter the 6-character code.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Validate the code against the backend before moving to the reset page.
      await verifyResetCode(code);
      navigate('/reset-password', { state: { token: code }, replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAF7] min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans antialiased text-[#1B1D1B] w-full">
      <main className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-[24px] sm:rounded-[28px] p-7 sm:p-10 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,105,72,0.12)] border border-[#E8F5E9] flex flex-col items-center text-center">

          {/* Brand Mark */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2E7D32] to-[#43A047] flex items-center justify-center shadow-[0_6px_16px_rgba(0,105,72,0.30)] mb-6">
            <FiFeather className="text-white text-xl" />
          </div>

          {/* Primary Icon */}
          <div className="w-16 h-16 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center mb-5">
            <FiCheckCircle className="text-3xl" />
          </div>

          {/* Heading + Subtext */}
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-[#1B1D1B] mb-3">
            Enter Reset Code
          </h1>
          <p className="text-sm sm:text-base text-[#6B7280] mb-8 leading-relaxed max-w-[340px]">
            We've sent a 6-character code
            {email ? (
              <> to <span className="font-semibold text-[#1B1D1B] break-all">{email}</span></>
            ) : (
              <> to your email</>
            )}
            . Enter it below to continue.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            {error && (
              <div className="text-sm text-[#D32F2F] bg-[#FFEBEE] border border-[#F3C9C9] rounded-lg px-4 py-2.5 text-center">
                {error}
              </div>
            )}

            {/* Code Input — focus ring removed, only subtle border shift */}
            <div className="relative w-full">
              <div className="relative flex items-center h-[60px] rounded-xl border-2 border-[#D8E3DA]/70 bg-[#F8FAF7]/60 focus-within:border-[#2E7D32] focus-within:bg-white transition-all duration-300 px-5">
                <FiHash className="text-xl mr-3 flex-shrink-0 text-[#6B7280]" />
                <input
                  className="w-full h-full bg-transparent border-0 p-0 text-[#1B1D1B] text-lg outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 shadow-none tracking-[0.3em] uppercase font-semibold placeholder:text-[#9CA3AF]/60 placeholder:tracking-[0.3em] placeholder:font-semibold"
                  placeholder="XXXXXX"
                  maxLength={6}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              className="w-full h-[56px] bg-[#2E7D32] hover:bg-[#276C2A] active:scale-[0.98] text-white rounded-xl font-bold text-base shadow-[0_10px_24px_-8px_rgba(0,105,72,0.5)] transition-all mt-1 flex justify-center items-center disabled:opacity-50 focus:outline-none"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>

          {/* Resend Hint */}
          <div className="mt-6 text-sm text-[#6B7280]">
            Didn't get a code?{' '}
            <Link
              to="/forgot-password"
              className="font-semibold text-[#2E7D32] hover:text-[#43A047] transition-colors"
            >
              Try again
            </Link>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-[#E8F5E9]" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9CA3AF]">or</span>
            <div className="flex-1 h-px bg-[#E8F5E9]" />
          </div>

          {/* Back to Login */}
          <Link
            className="text-sm font-semibold text-[#2E7D32] hover:text-[#43A047] transition-colors flex items-center gap-2"
            to="/login"
          >
            <FiArrowLeft className="text-lg" />
            Back to Login
          </Link>

        </div>
      </main>
    </div>
  );
}