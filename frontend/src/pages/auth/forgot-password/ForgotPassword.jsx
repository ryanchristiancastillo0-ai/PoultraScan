import React, { useState } from 'react';
import { FiMail, FiArrowLeft, FiCheckCircle, FiFeather, FiLock, FiHash } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { forgotPassword, resetPassword } from '../api/auth';

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Step control: 'request' -> enter email, 'verify' -> enter code + new password
  const [step, setStep] = useState('request');

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailFocused, setEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await forgotPassword(email);

      if (result.reset_token) {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          { to_email: email, reset_code: result.reset_token },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      }

      // Always move to the code-entry step, even if the email didn't match a user,
      // so we don't reveal whether the account exists.
      setStep('verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await resetPassword({ token: code, newPassword });
      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const emailFloated = emailFocused || email.length > 0;

  return (
    <div className="bg-[#f8f9ff] min-h-screen flex items-center justify-center p-4 md:p-6 font-sans antialiased text-[#0b1c30] w-full">
      <main className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,105,72,0.12)] border border-[#e5eeff] flex flex-col items-center text-center">

          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006948] to-[#00855d] flex items-center justify-center shadow-[0_8px_20px_rgba(0,105,72,0.35)] mb-4">
            <FiFeather className="text-white text-3xl" />
          </div>

          {isSuccess ? (
            /* Final Success State */
            <div className="w-full flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 bg-[#e6f4ea] text-[#006948] rounded-full flex items-center justify-center mb-6">
                <FiCheckCircle className="text-3xl" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#0b1c30] mb-3">
                Password Reset Successfully
              </h1>
              <p className="text-base text-[#565e74] mb-8 leading-relaxed">
                You can now log back in with your new password.
              </p>
              <button
                className="w-full h-[56px] bg-[#006948] hover:bg-[#00855d] active:scale-[0.98] text-white rounded-lg font-bold text-base transition-all"
                onClick={() => navigate('/login')}
              >
                Go to Sign In
              </button>
            </div>

          ) : step === 'request' ? (
            /* Step 1: Enter Email */
            <>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#0b1c30] mb-3">
                Reset Your Password
              </h1>
              <p className="text-base text-[#565e74] mb-8 leading-relaxed">
                Enter your email address and we'll send you a 6-character reset code.
              </p>

              <form onSubmit={handleRequestCode} className="w-full flex flex-col gap-6">
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center">
                    {error}
                  </div>
                )}

                <div className="relative w-full">
                  <div className="relative flex items-center h-[58px] rounded-xl border border-[#bccac0] bg-white focus-within:border-[#006948] focus-within:ring-4 focus-within:ring-[#006948]/10 transition-all duration-300 px-5">
                    <FiMail className={`text-xl mr-3 flex-shrink-0 transition-colors duration-200 ${emailFocused ? 'text-[#006948]' : 'text-[#565e74]'}`} />
                    <input
                      className="w-full h-full bg-transparent border-0 p-0 pt-3.5 focus:ring-0 text-[#0b1c30] text-base outline-none peer"
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
                          ? 'top-1.5 scale-[0.82] font-semibold text-[#006948]'
                          : 'top-1/2 -translate-y-1/2 scale-100 text-[#8a958e]'
                      }`}
                    >
                      Email address
                    </label>
                  </div>
                </div>

                <button
                  className="w-full h-[56px] bg-[#006948] hover:bg-[#00855d] active:scale-[0.98] text-white rounded-lg font-bold text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all mt-2 flex justify-center items-center disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>
            </>

          ) : (
            /* Step 2: Enter Code + New Password */
            <>
              <div className="w-16 h-16 bg-[#e6f4ea] text-[#006948] rounded-full flex items-center justify-center mb-6">
                <FiCheckCircle className="text-3xl" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#0b1c30] mb-3">
                Check Your Email
              </h1>
              <p className="text-base text-[#565e74] mb-8 leading-relaxed">
                We've sent a 6-character code to <span className="font-semibold text-[#0b1c30]">{email}</span>. Enter it below with your new password.
              </p>

              <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-5">
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center">
                    {error}
                  </div>
                )}

                {/* Code Field */}
                <div className="relative w-full">
                  <div className="relative flex items-center h-[58px] rounded-xl border border-[#bccac0] bg-white focus-within:border-[#006948] focus-within:ring-4 focus-within:ring-[#006948]/10 transition-all duration-300 px-5">
                    <FiHash className="text-xl mr-3 flex-shrink-0 text-[#565e74]" />
                    <input
                      className="w-full h-full bg-transparent border-0 p-0 text-[#0b1c30] text-base outline-none tracking-[0.3em] uppercase font-semibold"
                      placeholder="XXXXXX"
                      maxLength={6}
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="relative w-full">
                  <div className="relative flex items-center h-[58px] rounded-xl border border-[#bccac0] bg-white focus-within:border-[#006948] focus-within:ring-4 focus-within:ring-[#006948]/10 transition-all duration-300 px-5">
                    <FiLock className="text-xl mr-3 flex-shrink-0 text-[#565e74]" />
                    <input
                      className="w-full h-full bg-transparent border-0 p-0 text-[#0b1c30] text-base outline-none"
                      type="password"
                      placeholder="New password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative w-full">
                  <div className="relative flex items-center h-[58px] rounded-xl border border-[#bccac0] bg-white focus-within:border-[#006948] focus-within:ring-4 focus-within:ring-[#006948]/10 transition-all duration-300 px-5">
                    <FiLock className="text-xl mr-3 flex-shrink-0 text-[#565e74]" />
                    <input
                      className="w-full h-full bg-transparent border-0 p-0 text-[#0b1c30] text-base outline-none"
                      type="password"
                      placeholder="Confirm new password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  className="w-full h-[56px] bg-[#006948] hover:bg-[#00855d] active:scale-[0.98] text-white rounded-lg font-bold text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all mt-2 flex justify-center items-center disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  className="text-sm text-[#565e74] hover:text-[#006948] transition-colors"
                  onClick={() => setStep('request')}
                >
                  Didn't get a code? Try again
                </button>
              </form>
            </>
          )}

          {/* Back to Login Anchor */}
          <div className="mt-8">
            
             <a className="text-sm font-semibold text-[#006948] hover:text-[#00855d] transition-colors flex items-center gap-2"
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