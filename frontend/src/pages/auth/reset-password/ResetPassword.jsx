import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiLock, FiShield, FiEye, FiEyeOff, FiCheckCircle, FiArrowLeft, FiFeather } from 'react-icons/fi';
import { resetPassword } from '../api/auth';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  // Input Form State Hooks
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Focus & Presentation State Hooks
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Form Label float calculation
  const passwordFloated = passwordFocused || password.length > 0;
  const confirmPasswordFloated = confirmPasswordFocused || confirmPassword.length > 0;

  // Real-time password strength evaluator
  const evaluatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: 'Very Weak', color: 'bg-gray-200' };

    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, text: 'Weak', color: 'bg-[#ba1a1a]' };
      case 2:
        return { score: 2, text: 'Fair', color: 'bg-[#ffb95f]' };
      case 3:
        return { score: 3, text: 'Good', color: 'bg-[#00855d]' };
      case 4:
        return { score: 4, text: 'Strong', color: 'bg-[#006c4a]' };
      default:
        return { score: 0, text: 'Very Weak', color: 'bg-[#ba1a1a]' };
    }
  };

  const strength = evaluatePasswordStrength(password);
  const passwordsMatch = password && confirmPassword ? password === confirmPassword : true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      alert("Passwords do not match!");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    if (!token) {
      setApiError('Reset link is invalid or missing a token.');
      return;
    }

    setLoading(true);
    setApiError(null);
    try {
      await resetPassword({ token, newPassword: password });
      setIsSuccess(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] antialiased min-h-[100dvh] flex flex-col justify-between w-full">

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-[440px] bg-white rounded-2xl sm:rounded-[32px] p-6 sm:p-10 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,105,72,0.12)] border border-[#bccac0]/20 flex flex-col gap-6 sm:gap-9 my-auto">

          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006948] to-[#00855d] flex items-center justify-center shadow-[0_8px_20px_rgba(0,105,72,0.35)] mb-4">
              <FiFeather className="text-white text-3xl" />
            </div>
          </div>

          {!isSuccess ? (
            <>
              {/* Header Details */}
              <div className="flex flex-col items-center text-center gap-2 -mt-3">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0b1c30]">
                  Set a New Password
                </h1>
                <p className="text-sm sm:text-base text-[#3d4a42]">
                  Your new password must be different from previously used passwords.
                </p>
              </div>

              {/* Reset Password Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">

                {apiError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center">
                    {apiError}
                  </div>
                )}

                {/* New Password Field */}
                <div className="relative">
                  <div className="relative flex items-center h-[52px] sm:h-[58px] bg-[#f8f9ff]/60 border-2 border-[#bccac0]/60 rounded-xl sm:rounded-2xl focus-within:border-[#006948] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#006948]/10 transition-all duration-300 overflow-hidden px-4 sm:px-5">
                    <FiLock className={`text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0 transition-colors duration-200 ${passwordFocused ? 'text-[#006948]' : 'text-[#6d7a72]'}`} />
                    <input
                      className="w-full h-full bg-transparent border-0 p-0 pt-3 sm:pt-3.5 focus:ring-0 text-[#0b1c30] text-sm sm:text-base outline-none peer"
                      id="new-password"
                      name="new-password"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label
                      htmlFor="new-password"
                      className={`absolute left-11 sm:left-14 origin-left pointer-events-none transition-all duration-250 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                        passwordFloated
                          ? 'top-1.5 scale-[0.8] font-semibold text-[#006948]'
                          : 'top-1/2 -translate-y-1/2 scale-100 text-sm sm:text-base text-[#8a958e]'
                      }`}
                    >
                      New Password
                    </label>
                    <button
                      aria-label="Toggle password visibility"
                      className="ml-2 sm:ml-3 text-[#6d7a72] hover:text-[#006948] transition-colors focus:outline-none flex-shrink-0"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff className="text-lg sm:text-xl" /> : <FiEye className="text-lg sm:text-xl" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <div className="relative flex items-center h-[52px] sm:h-[58px] bg-[#f8f9ff]/60 border-2 border-[#bccac0]/60 rounded-xl sm:rounded-2xl focus-within:border-[#006948] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#006948]/10 transition-all duration-300 overflow-hidden px-4 sm:px-5">
                    <FiShield className={`text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0 transition-colors duration-200 ${confirmPasswordFocused ? 'text-[#006948]' : 'text-[#6d7a72]'}`} />
                    <input
                      className="w-full h-full bg-transparent border-0 p-0 pt-3 sm:pt-3.5 focus:ring-0 text-[#0b1c30] text-sm sm:text-base outline-none peer"
                      id="confirm-password"
                      name="confirm-password"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onFocus={() => setConfirmPasswordFocused(true)}
                      onBlur={() => setConfirmPasswordFocused(false)}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <label
                      htmlFor="confirm-password"
                      className={`absolute left-11 sm:left-14 origin-left pointer-events-none transition-all duration-250 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                        confirmPasswordFloated
                          ? 'top-1.5 scale-[0.8] font-semibold text-[#006948]'
                          : 'top-1/2 -translate-y-1/2 scale-100 text-sm sm:text-base text-[#8a958e]'
                      }`}
                    >
                      Confirm Password
                    </label>
                    <button
                      aria-label="Toggle confirm password visibility"
                      className="ml-2 sm:ml-3 text-[#6d7a72] hover:text-[#006948] transition-colors focus:outline-none flex-shrink-0"
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FiEyeOff className="text-lg sm:text-xl" /> : <FiEye className="text-lg sm:text-xl" />}
                    </button>
                  </div>
                </div>

                {/* Live Password Match Validation Notice */}
                {!passwordsMatch && (
                  <p className="text-xs text-[#ba1a1a] font-semibold -mt-2 text-left px-1 animate-[fadeIn_0.2s_ease-out]">
                    Passwords do not match.
                  </p>
                )}

                {/* Password Strength Indicator */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] tracking-wider uppercase font-semibold text-[#3d4a42]">
                      Password Strength
                    </span>
                    <span className={`text-[11px] font-bold ${password.length > 0 ? 'opacity-100' : 'opacity-40'} transition-opacity`} style={{ color: strength.score > 0 ? '' : '#3d4a42' }}>
                      {password.length > 0 ? strength.text : 'Empty'}
                    </span>
                  </div>

                  {/* Dynamic Progress Indicator Bars */}
                  <div className="flex gap-1.5 h-1.5 w-full">
                    {[1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${
                          password.length > 0 && strength.score >= index
                            ? strength.color
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-[#565e74] text-left px-1 mt-0.5">
                    Must be at least 8 characters with a mix of letters, numbers & symbols.
                  </p>
                </div>

                {/* Submit Reset Action */}
                <button
                  className="w-full h-[52px] sm:h-[58px] bg-gradient-to-r from-[#006948] to-[#00855d] text-white text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-[0_10px_24px_-6px_rgba(0,105,72,0.3)] hover:shadow-[0_14px_28px_-6px_rgba(0,105,72,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            /* Successful Reset State Panel */
            <div className="w-full flex flex-col items-center animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 bg-[#e6f4ea] text-[#006948] rounded-full flex items-center justify-center mb-6">
                <FiCheckCircle className="text-3xl animate-[scaleUp_0.3s_ease-out]" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#0b1c30] mb-3">
                Password Reset Successfully
              </h1>
              <p className="text-base text-[#565e74] mb-8 leading-relaxed">
                Your credentials have been securely updated. You can now log back into the system with your new password.
              </p>
              <button
                className="w-full h-[56px] bg-[#006948] hover:bg-[#00855d] active:scale-[0.98] text-white rounded-lg font-bold text-base transition-all"
                onClick={() => {
                  setIsSuccess(false);
                  setPassword('');
                  setConfirmPassword('');
                  navigate('/login');
                }}
              >
                Go to Sign In
              </button>
            </div>
          )}

          {/* Back to Login Anchor link */}
          <div className="text-center -mt-2">
            <a
              className="text-xs sm:text-sm font-semibold text-[#006948] hover:text-[#00855d] transition-colors inline-flex items-center gap-2"
              href="/login"
            >
              <FiArrowLeft className="text-lg" />
              Back to Login
            </a>
          </div>

        </div>
      </main>

      {/* Footer Details */}
      <footer className="w-full py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-3 bg-[#f8f9ff] border-t border-[#bccac0]/20 text-center md:text-left">
        <div className="text-xs font-bold text-[#0b1c30]/80">
          © {new Date().getFullYear()} PoultraScan AI. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a className="text-xs text-[#565e74] hover:text-[#006948] transition-colors" href="#">Privacy Policy</a>
          <a className="text-xs text-[#565e74] hover:text-[#006948] transition-colors" href="#">Terms of Service</a>
          <a className="text-xs text-[#565e74] hover:text-[#006948] transition-colors" href="#">Contact Support</a>
        </div>
      </footer>

    </div>
  );
}