import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiShield, FiEye, FiEyeOff, FiFeather, FiCheck } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

function SuccessModal({ onDone }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      onDone();
    }, 3000);

    const tickInterval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(tickInterval);
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0b1c30]/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-[0_24px_64px_-12px_rgba(11,28,48,0.35)] p-8 flex flex-col items-center text-center">
        <div className="relative w-20 h-20 mb-5">
          <svg className="w-20 h-20" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#e5eeff" strokeWidth="4" />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#006948"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="226.19"
              strokeDashoffset="226.19"
              style={{
                animation: 'circleDraw 0.6s ease-out forwards',
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
              }}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: 'checkPop 0.4s ease-out 0.5s both' }}
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#006948] to-[#00855d] flex items-center justify-center shadow-[0_8px_20px_rgba(0,105,72,0.35)]">
              <FiCheck className="text-white text-2xl" strokeWidth={3} />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#0b1c30]">Account Created!</h2>
        <p className="text-sm text-[#565e74] mt-2">
          Your PoultraScan AI account is ready. Redirecting you to login in {countdown}...
        </p>

        <style>{`
          @keyframes circleDraw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes checkPop {
            0% { opacity: 0; transform: scale(0.5); }
            70% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function Register() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formError, setFormError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [fullNameFocused, setFullNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fullNameFloated = fullNameFocused || fullName.length > 0;
  const emailFloated = emailFocused || email.length > 0;
  const passwordFloated = passwordFocused || password.length > 0;
  const confirmPasswordFloated = confirmPasswordFocused || confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match!');
      return;
    }

    const username = email.split('@')[0];

    try {
      await register({
        fullname: fullName,
        username,
        email,
        password,
      });
      setShowSuccess(true);
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="bg-[#f8f9ff] min-h-screen flex text-[#0b1c30] antialiased w-full">
      <div className="flex w-full min-h-screen">

       <div className="hidden md:flex md:w-1/2 h-full min-h-screen bg-[#d3e4fe] relative overflow-hidden">
  {/* Base Image - blurred */}
  <img
    src="/img/left-panel-logo.png"
    alt=""
    className="absolute inset-0 w-full h-full object-cover object-top scale-110 blur-xs opacity-90"
  />

  {/* Decorative blurred blobs for depth */}
  <div className="absolute -top-16 -left-16 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
  <div className="absolute bottom-0 -right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

  {/* Top-left brand mark */}
  <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
      <FiFeather className="text-white text-xl" />
    </div>
    <span className="text-white font-semibold tracking-wide text-lg drop-shadow-sm">
      PoultraScan AI
    </span>
  </div>

  {/* Bottom overlay text */}
  <div className="absolute bottom-0 left-0 right-0 p-10 z-10 bg-gradient-to-t from-[#0b1c30]/70 via-[#0b1c30]/20 to-transparent">
    <h2 className="text-white text-2xl font-semibold tracking-tight mb-2 drop-shadow-sm">
      Smarter poultry health, in real time.
    </h2>
    <p className="text-white/80 text-sm max-w-sm">
      AI-powered scans help you catch issues early and keep your flock thriving.
    </p>
  </div>
</div><div className="hidden md:flex md:w-1/2 h-full min-h-screen bg-[#d3e4fe] relative overflow-hidden">
  {/* Base Image - blurred */}
  <img
    src="/img/left-panel-logo.png"
    alt=""
    className="absolute inset-0 w-full h-full object-cover object-top scale-110 blur-xs opacity-90"
  />

  {/* Decorative blurred blobs for depth */}
  <div className="absolute -top-16 -left-16 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
  <div className="absolute bottom-0 -right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

  {/* Top-left brand mark */}
  <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
      <FiFeather className="text-white text-xl" />
    </div>
    <span className="text-white font-semibold tracking-wide text-lg drop-shadow-sm">
      PoultraScan AI
    </span>
  </div>

  {/* Bottom overlay text */}
  <div className="absolute bottom-0 left-0 right-0 p-10 z-10 bg-gradient-to-t from-[#0b1c30]/70 via-[#0b1c30]/20 to-transparent">
    <h2 className="text-white text-2xl font-semibold tracking-tight mb-2 drop-shadow-sm">
      Smarter poultry health, in real time.
    </h2>
    <p className="text-white/80 text-sm max-w-sm">
      AI-powered scans help you catch issues early and keep your flock thriving.
    </p>
  </div>
</div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16 bg-[#f8f9ff]">
          <div className="w-full max-w-[480px] bg-white rounded-2xl p-6 md:p-10 shadow-[0_4px_12px_rgba(15,23,42,0.04)] border border-[#e5eeff]">

            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006948] to-[#00855d] flex items-center justify-center shadow-[0_8px_20px_rgba(0,105,72,0.35)] mb-4">
                <FiFeather className="text-white text-3xl" />
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#0b1c30]">Create Your Account</h1>
              <p className="text-base text-[#565e74] mt-1 text-center">Join PoultraScan AI to start monitoring your flock.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {(formError || error) && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center">
                  {formError || error}
                </div>
              )}

              <div className="relative">
                <div className="relative flex items-center h-[58px] rounded-xl border border-[#bccac0] bg-white focus-within:border-[#006948] focus-within:ring-4 focus-within:ring-[#006948]/10 transition-all duration-300 px-5">
                  <FiUser className={`text-xl mr-3 flex-shrink-0 transition-colors duration-200 ${fullNameFocused ? 'text-[#006948]' : 'text-[#565e74]'}`} />
                  <input
                    className="w-full h-full bg-transparent border-0 p-0 pt-3.5 focus:ring-0 text-[#0b1c30] text-base outline-none peer"
                    id="fullName"
                    name="fullName"
                    required
                    type="text"
                    value={fullName}
                    onFocus={() => setFullNameFocused(true)}
                    onBlur={() => setFullNameFocused(false)}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <label
                    htmlFor="fullName"
                    className={`absolute left-14 origin-left pointer-events-none transition-all duration-250 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                      fullNameFloated
                        ? 'top-1.5 scale-[0.82] font-semibold text-[#006948]'
                        : 'top-1/2 -translate-y-1/2 scale-100 text-[#8a958e]'
                    }`}
                  >
                    Full Name
                  </label>
                </div>
              </div>

              <div className="relative">
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
                    Email Address
                  </label>
                </div>
              </div>

              <div className="relative">
                <div className="relative flex items-center h-[58px] rounded-xl border border-[#bccac0] bg-white focus-within:border-[#006948] focus-within:ring-4 focus-within:ring-[#006948]/10 transition-all duration-300 px-5">
                  <FiLock className={`text-xl mr-3 flex-shrink-0 transition-colors duration-200 ${passwordFocused ? 'text-[#006948]' : 'text-[#565e74]'}`} />
                  <input
                    className="w-full h-full bg-transparent border-0 p-0 pt-3.5 focus:ring-0 text-[#0b1c30] text-base outline-none peer"
                    id="password"
                    name="password"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    htmlFor="password"
                    className={`absolute left-14 origin-left pointer-events-none transition-all duration-250 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                      passwordFloated
                        ? 'top-1.5 scale-[0.82] font-semibold text-[#006948]'
                        : 'top-1/2 -translate-y-1/2 scale-100 text-[#8a958e]'
                    }`}
                  >
                    Password
                  </label>
                  <button
                    className="text-[#565e74] hover:text-[#006948] transition-colors focus:outline-none flex-shrink-0 ml-2"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="relative flex items-center h-[58px] rounded-xl border border-[#bccac0] bg-white focus-within:border-[#006948] focus-within:ring-4 focus-within:ring-[#006948]/10 transition-all duration-300 px-5">
                  <FiShield className={`text-xl mr-3 flex-shrink-0 transition-colors duration-200 ${confirmPasswordFocused ? 'text-[#006948]' : 'text-[#565e74]'}`} />
                  <input
                    className="w-full h-full bg-transparent border-0 p-0 pt-3.5 focus:ring-0 text-[#0b1c30] text-base outline-none peer"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label
                    htmlFor="confirmPassword"
                    className={`absolute left-14 origin-left pointer-events-none transition-all duration-250 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                      confirmPasswordFloated
                        ? 'top-1.5 scale-[0.82] font-semibold text-[#006948]'
                        : 'top-1/2 -translate-y-1/2 scale-100 text-[#8a958e]'
                    }`}
                  >
                    Confirm Password
                  </label>
                  <button
                    className="text-[#565e74] hover:text-[#006948] transition-colors focus:outline-none flex-shrink-0 ml-2"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start py-2">
                <div className="flex items-center h-5">
                  <input
                    className="w-4 h-4 text-[#006948] bg-white border-[#bccac0] rounded focus:ring-[#006948] focus:ring-2 cursor-pointer"
                    id="terms"
                    name="terms"
                    required
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="text-[#565e74] cursor-pointer" htmlFor="terms">
                    I agree to the <a className="text-[#006948] hover:underline font-bold" href="#">Terms &amp; Conditions</a> and Privacy Policy.
                  </label>
                </div>
              </div>

              <button
                className="w-full h-[56px] bg-[#006948] text-white rounded-lg text-base font-bold hover:bg-[#00855d] active:scale-[0.98] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] mt-6 disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-base text-[#565e74]">
                Already have an account?{' '}
                <a className="text-[#006948] hover:underline font-bold transition-colors" href="/login">Login</a>
              </p>
            </div>

          </div>
        </div>

      </div>

      {showSuccess && <SuccessModal onDone={() => navigate('/login')} />}
    </div>
  );
}