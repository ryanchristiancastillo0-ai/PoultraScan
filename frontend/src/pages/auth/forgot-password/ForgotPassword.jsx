import React, { useState } from 'react';
import { FiMail, FiArrowLeft, FiCheckCircle, FiFeather } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/auth';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // The backend emails the 6-character reset code directly via Brevo.
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const emailFloated = emailFocused || email.length > 0;

  return (
    <div className="bg-[#F8FAF7] min-h-screen flex items-center justify-center p-4 md:p-6 font-sans antialiased text-[#1B1D1B] w-full">
      <main className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,105,72,0.12)] border border-[#E8F5E9] flex flex-col items-center text-center">

          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#43A047] flex items-center justify-center shadow-[0_8px_20px_rgba(0,105,72,0.35)] mb-4">
            <FiFeather className="text-white text-3xl" />
          </div>

          {isSuccess ? (
            /* Success: code was emailed — move on to the code page */
            <div className="w-full flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center mb-6">
                <FiCheckCircle className="text-3xl" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1B1D1B] mb-3">
                Check Your Email
              </h1>
              <p className="text-base text-[#6B7280] mb-8 leading-relaxed">
                We've sent a 6-character code to <span className="font-semibold text-[#1B1D1B]">{email}</span>. Enter it on the next page to reset your password.
              </p>
              <button
                className="w-full h-[56px] bg-[#2E7D32] hover:bg-[#276C2A] active:scale-[0.98] text-white rounded-lg font-bold text-base transition-all"
                onClick={() => navigate('/verify-reset-code', { state: { email } })}
              >
                I Have a Code — Continue
              </button>
              <button
                type="button"
                className="mt-4 text-sm text-[#6B7280] hover:text-[#2E7D32] transition-colors"
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    await forgotPassword(email);
                  } catch (err) {
                    setError(err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? 'Sending...' : "Didn't get a code? Resend"}
              </button>
            </div>
          ) : (
            /* Step 1: Enter Email */
            <>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1B1D1B] mb-3">
                Reset Your Password
              </h1>
              <p className="text-base text-[#6B7280] mb-8 leading-relaxed">
                Enter your email address and we'll send you a 6-character reset code.
              </p>

              <form onSubmit={handleRequestCode} className="w-full flex flex-col gap-6">
                {error && (
                  <div className="text-sm text-[#D32F2F] bg-[#FFEBEE] border border-[#F3C9C9] rounded-lg px-4 py-2 text-center">
                    {error}
                  </div>
                )}

                <div className="relative w-full">
                  <div className="relative flex items-center h-[58px] rounded-xl border border-[#D8E3DA] bg-white focus-within:border-[#2E7D32] focus-within:ring-4 focus-within:ring-[#2E7D32]/10 transition-all duration-300 px-5">
                    <FiMail className={`text-xl mr-3 flex-shrink-0 transition-colors duration-200 ${emailFocused ? 'text-[#2E7D32]' : 'text-[#6B7280]'}`} />
                    <input
                      className="w-full h-full bg-transparent border-0 p-0 pt-3.5 focus:ring-0 text-[#1B1D1B] text-base outline-none peer"
                      id="email"
                      name="email"
                      required
                      type="email"
                      value={email}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label
                      htmlFor="email"
                      className={`absolute left-14 origin-left pointer-events-none transition-all duration-250 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                        emailFloated
                          ? 'top-1.5 scale-[0.82] font-semibold text-[#2E7D32]'
                          : 'top-1/2 -translate-y-1/2 scale-100 text-[#9CA3AF]'
                      }`}
                    >
                      Email address
                    </label>
                  </div>
                </div>

                <button
                  className="w-full h-[56px] bg-[#2E7D32] hover:bg-[#276C2A] active:scale-[0.98] text-white rounded-lg font-bold text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all mt-2 flex justify-center items-center disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>
            </>
          )}

          {/* Back to Login Anchor */}
          <div className="mt-8">
            <a className="text-sm font-semibold text-[#2E7D32] hover:text-[#43A047] transition-colors flex items-center gap-2"
              href="/login"
            >
              <FiArrowLeft className="text-lg" />
              Back to Login
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}