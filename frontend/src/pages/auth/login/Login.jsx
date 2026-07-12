import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiFeather,
  FiArrowRight,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import { checkServerHealth } from "../api/auth"

export default function Login() {
  const { login, loading, error, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Input State Hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // UI Presentation State Hooks
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Server wake-up state
  const [serverStatus, setServerStatus] = useState("waking"); // "waking" | "ready" | "unreachable"

  useEffect(() => {
    let cancelled = false;

    const pingServer = async () => {
      try {
        await checkServerHealth();
        if (!cancelled) setServerStatus("ready");
      } catch (err) {
        if (!cancelled) setServerStatus("unreachable");
      }
    };

    pingServer();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password, rememberMe });
      navigate("/dashboard"); // adjust to your actual post-login route
    } catch (err) {
      // error already captured in `error` state from useAuth
    }
  };

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle(tokenResponse.access_token);
        console.log("loginWithGoogle finished, navigating...");
        navigate("/dashboard");
      } catch (err) {
        console.log("loginWithGoogle THREW:", err);
      }
    },
    onError: (err) => {
      console.log("GOOGLE ERROR FIRED:", err);
    },
  });

  const emailFloated = emailFocused || email.length > 0;
  const passwordFloated = passwordFocused || password.length > 0;

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] antialiased min-h-[100dvh] flex w-full">
      {/* Split Screen Layout */}
      <div className="flex w-full min-h-[100dvh]">
        {/* Left Side: Illustration (Hidden on screens smaller than lg) */}
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
        </div>

        {/* Right Side: Login Form (Optimized padding for all devices) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-[#f8f9ff] min-h-[100dvh]">
          <div className="w-full max-w-[440px] bg-white rounded-2xl sm:rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(0,105,72,0.12)] border border-[#bccac0]/20 flex flex-col gap-5 sm:gap-6 my-auto">
            {/* Logo & Header */}
            <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#006948] to-[#00855d] flex items-center justify-center shadow-[0_8px_20px_rgba(0,105,72,0.25)] mb-1">
                <FiFeather className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0b1c30]">
                Welcome Back
              </h1>
              <p className="text-sm sm:text-base text-[#3d4a42]">
                Log in to access your poultry health dashboard.
              </p>
            </div>

            {/* Server waking up notice */}
            {serverStatus === "waking" && (
              <div className="text-sm text-[#00855d] bg-[#006948]/5 border border-[#006948]/20 rounded-lg px-4 py-2 text-center">
                Connecting to server, this can take up to a minute if it's been idle...
              </div>
            )}
            {serverStatus === "unreachable" && (
              <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-center">
                Having trouble reaching the server. Please wait a moment and try again.
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 sm:gap-5"
            >
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="relative">
                <div className="relative flex items-center h-[46px] sm:h-[50px] bg-[#f8f9ff]/60 border-2 border-[#bccac0]/60 rounded-xl focus-within:border-[#006948] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#006948]/10 transition-all duration-300 overflow-hidden px-4">
                  <FiUser
                    className={`text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0 transition-colors duration-200 ${emailFocused ? "text-[#006948]" : "text-[#6d7a72]"}`}
                  />
                  <input
                    className="w-full h-full bg-transparent border-0 p-0 pt-4 sm:pt-[18px] focus:ring-0 text-[#0b1c30] text-sm sm:text-base outline-none peer"
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
                    className={`absolute left-11 sm:left-14 origin-left pointer-events-none transition-all duration-250 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                      emailFloated
                        ? "top-0.5 scale-[0.72] font-semibold text-[#006948]"
                        : "top-1/2 -translate-y-1/2 scale-100 text-sm sm:text-base text-[#8a958e]"
                    }`}
                  >
                    Email address
                  </label>
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="relative flex items-center h-[46px] sm:h-[50px] bg-[#f8f9ff]/60 border-2 border-[#bccac0]/60 rounded-xl focus-within:border-[#006948] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#006948]/10 transition-all duration-300 overflow-hidden px-4">
                  <FiLock
                    className={`text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0 transition-colors duration-200 ${passwordFocused ? "text-[#006948]" : "text-[#6d7a72]"}`}
                  />
                  <input
                    className="w-full h-full bg-transparent border-0 p-0 pt-4 sm:pt-[18px] focus:ring-0 text-[#0b1c30] text-sm sm:text-base outline-none peer"
                    id="password"
                    name="password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    htmlFor="password"
                    className={`absolute left-11 sm:left-14 origin-left pointer-events-none transition-all duration-250 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                      passwordFloated
                        ? "top-0.5 scale-[0.72] font-semibold text-[#006948]"
                        : "top-1/2 -translate-y-1/2 scale-100 text-sm sm:text-base text-[#8a958e]"
                    }`}
                  >
                    Password
                  </label>
                  <button
                    aria-label="Toggle password visibility"
                    className="ml-2 sm:ml-3 text-[#6d7a72] hover:text-[#006948] transition-colors focus:outline-none flex-shrink-0"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="text-lg sm:text-xl" />
                    ) : (
                      <FiEye className="text-lg sm:text-xl" />
                    )}
                  </button>
                </div>
              </div>

              {/* Options Row (Responsive layout wraps gracefully on narrow screens) */}
              <div className="flex flex-row items-center justify-between gap-2 mt-1">
                <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group select-none">
                  <input
                    className="w-4 h-4 rounded text-[#006948] border-[#bccac0] focus:ring-[#006948] focus:ring-offset-white bg-white cursor-pointer"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-xs sm:text-sm text-[#3d4a42] group-hover:text-[#0b1c30] transition-colors">
                    Remember Me
                  </span>
                </label>
                {/* TODO: no forgot-password endpoint in backend yet */}

                
                <a  className="text-xs sm:text-sm text-[#006948] hover:text-[#00855d] font-medium transition-colors"
                  href="/forgot-password"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                className="group w-full h-[46px] sm:h-[50px] bg-gradient-to-r from-[#006948] to-[#00855d] text-white text-base font-semibold rounded-xl shadow-[0_10px_24px_-6px_rgba(0,105,72,0.3)] hover:shadow-[0_14px_28px_-6px_rgba(0,105,72,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
                <FiArrowRight className="text-lg transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-[#bccac0]/40"></div>
              <span className="flex-shrink-0 mx-3 sm:mx-4 text-xs font-medium text-[#6d7a72] uppercase tracking-wider bg-white px-2">
                or
              </span>
              <div className="flex-grow border-t border-[#bccac0]/40"></div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={() => googleLoginHandler()}
              className="w-full h-[46px] sm:h-[50px] flex items-center justify-center gap-2.5 sm:gap-3 border-2 border-[#bccac0]/60 rounded-xl text-[#0b1c30] font-medium text-sm sm:text-base hover:border-[#006948]/40 hover:bg-[#f8f9ff] active:scale-[0.98] transition-all"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            {/* Registration Link */}
            <div className="text-center">
              <p className="text-xs sm:text-base text-[#3d4a42]">
                Don't have an account?{" "}
                
                 <a className="text-[#006948] hover:text-[#00855d] font-semibold transition-colors ml-1"
                  href="/register"
                >
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}