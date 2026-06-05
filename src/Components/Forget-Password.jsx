import { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleCheck, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api/config";

const LogoHeader = ({ subtitle, desc }) => (
  <div className="text-center mb-5">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 mb-2.5 transform hover:rotate-12 transition-transform duration-300">
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    </div>
    <h1 className="text-2xl font-extrabold tracking-tight text-white">
      Sky<span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Bowl</span>
    </h1>
    <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Premium Dining Portal</p>
    {subtitle && <h2 className="text-lg font-bold text-slate-200 mt-3.5">{subtitle}</h2>}
    {desc && <p className="text-xs text-slate-400 mt-1 font-medium">{desc}</p>}
  </div>
);

export default function RestaurantForgetPassword() {
  const [step, setStep]                   = useState(1);
  const [email, setEmail]                 = useState("");
  const [otp, setOtp]                     = useState(["", "", "", ""]);
  const [newPassword, setNewPassword]     = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [resendTime, setResendTime]       = useState(30);
  const [canResend, setCanResend]         = useState(false);
  const [error, setError]                 = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 2 && resendTime > 0) {
      const timer = setTimeout(() => setResendTime(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTime === 0) {
      setCanResend(true);
    }
  }, [resendTime, step]);

  const handleSendOTP = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsLoading(true); setError("");
    try {
      await axios.post(`${API_BASE}/users/forgot-password`, { email });
      setStep(2); setResendTime(30); setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || "Email address not found");
    } finally { setIsLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError("");
    try {
      await axios.post(`${API_BASE}/users/verify-otp`, { email, otp: otp.join("") });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally { setIsLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError("");
    try {
      await axios.post(`${API_BASE}/users/reset-password`, { email, newPassword });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally { setIsLoading(false); }
  };

  const mainWrapperClass = "h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center relative font-sans";
  const bgEffects = (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(251,146,60,0.22),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
    </>
  );

  const containerClass = "relative w-full max-w-md mx-4 z-10";
  const glowBorder = <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-3xl blur-md opacity-40 transition duration-1000" />;
  const cardBodyClass = "relative bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-center";

  // ── STEP 1: Enter Email ──────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className={mainWrapperClass}>
        {bgEffects}
        <div className={containerClass}>
          {glowBorder}
          <div className={cardBodyClass}>
            <LogoHeader subtitle="Reset Password" desc="Verify your email to recover your account" />

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-500">
                    <FaEnvelope size={14} />
                  </span>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 pl-11 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-semibold"
                    placeholder="yourname@example.com"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={isLoading}
                className="w-full mt-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP…
                  </span>
                ) : (
                  "Send Secure OTP"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs font-semibold text-slate-400">
              Remembered?{" "}
              <button onClick={() => navigate("/")} className="text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2: Verify OTP ───────────────────────────────────────────────────
  if (step === 2) {
    return (
      <div className={mainWrapperClass}>
        {bgEffects}
        <div className={containerClass}>
          {glowBorder}
          <div className={cardBodyClass}>
            <LogoHeader subtitle="Verification" desc={`We sent a 4-digit code to ${email}`} />

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="flex justify-between gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i} id={`otp-${i}`} maxLength={1} value={digit}
                    onChange={(e) => {
                      const next = [...otp]; next[i] = e.target.value; setOtp(next);
                      if (e.target.value && i < 3) document.getElementById(`otp-${i + 1}`)?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digit && i > 0) document.getElementById(`otp-${i - 1}`)?.focus();
                    }}
                    className="w-14 h-14 text-center bg-slate-950/80 text-slate-100 rounded-2xl border border-slate-700 text-2xl font-black focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-semibold"
                  />
                ))}
              </div>

              <button
                type="submit" disabled={isLoading}
                className="w-full mt-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs font-semibold text-slate-400">
              {canResend ? (
                <button
                  type="button"
                  onClick={() => { setCanResend(false); setResendTime(30); handleSendOTP(); }}
                  className="text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer"
                >
                  Resend OTP
                </button>
              ) : (
                <span>Resend code in <strong className="text-slate-200">{resendTime}s</strong></span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 3: Enter New Password ───────────────────────────────────────────
  if (step === 3) {
    return (
      <div className={mainWrapperClass}>
        {bgEffects}
        <div className={containerClass}>
          {glowBorder}
          <div className={cardBodyClass}>
            <LogoHeader subtitle="New Password" desc="Create a strong new password for your account" />

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <FaLock size={14} />
                  </span>
                  <input
                    type={showNewPassword ? "text" : "password"} required value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 pl-11 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-semibold"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={isLoading}
                className="w-full mt-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 4: Success Screen ───────────────────────────────────────────────
  return (
    <div className={mainWrapperClass}>
      {bgEffects}
      <div className={containerClass}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur-md opacity-40" />
        <div className="relative text-center p-8 bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 rounded-3xl shadow-2xl z-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 animate-bounce">
            <FaCircleCheck className="text-4xl text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-emerald-400 mb-1 tracking-tight">Password Updated!</h2>
          <p className="text-slate-400 text-xs font-semibold mb-6">Your password has been successfully reset.</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}