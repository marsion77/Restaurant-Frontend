import { useState } from "react";
import { FaEye, FaEyeSlash, FaUser, FaPhone, FaEnvelope, FaLock } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/config";

export default function RestaurantRegister() {
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [phone, setPhone]             = useState("");
  const [password, setPassword]       = useState("");
  const [address1, setAddress1]       = useState("");
  const [address2, setAddress2]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [isSuccess, setIsSuccess]     = useState(false);
  const [error, setError]             = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await axios.post(`${API_BASE}/users/adduser`, {
        name, email, password, mobile: phone, address1, address2
      });
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center relative font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.22),rgba(255,255,255,0))]" />
        
        {/* Success Glow Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur-md opacity-40 max-w-sm w-full mx-4" />
        
        <div className="relative text-center p-8 bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 rounded-3xl shadow-2xl max-w-sm w-full mx-4 z-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 animate-bounce">
            <svg className="w-9 h-9 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-emerald-400 mb-1 tracking-tight">Account Created!</h2>
          <p className="text-slate-400 text-xs font-semibold">Redirecting to login portal…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center relative font-sans">
      
      {/* Premium Background Graphics - Identical to Login */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(251,146,60,0.22),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Main Glass Container */}
      <div className="relative w-full max-w-lg mx-4 z-10">
        
        {/* Glow Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-3xl blur-md opacity-40 transition duration-1000" />
        
        <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-center">
          
          {/* Logo Section - Identical to Login */}
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
          </div>

          <h2 className="text-lg font-bold text-slate-200 mb-3.5 text-center">Create Account</h2>

          {error && (
            <div className="mb-3.5 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-semibold text-center animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Grid 1: Name and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 ml-1">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                    <FaUser size={12} />
                  </span>
                  <input
                    type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-semibold"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 ml-1">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                    <FaPhone size={12} />
                  </span>
                  <input
                    type="tel" required value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-semibold"
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>

            {/* Field: Email */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 ml-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                  <FaEnvelope size={12} />
                </span>
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-semibold"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Grid 2: Address Lines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 ml-1">Address Line 1</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-500">
                    <FaMapMarkerAlt size={12} />
                  </span>
                  <input
                    type="text" required value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-semibold"
                    placeholder="Flat/House No., Building"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 ml-1">Address Line 2</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-500">
                    <FaMapMarkerAlt size={12} />
                  </span>
                  <input
                    type="text" required value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-semibold"
                    placeholder="Area, Street, Landmark"
                  />
                </div>
              </div>
            </div>

            {/* Field: Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 ml-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                  <FaLock size={12} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-10 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-semibold"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-slate-500 hover:text-orange-400 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center ml-1 pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-[11px] font-bold text-slate-400 hover:text-slate-300 select-none">
                <input
                  type="checkbox"
                  required
                  className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950/80 text-orange-500 focus:ring-0 accent-orange-500"
                />
                I agree to the Terms & Conditions
              </label>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-3 text-xs font-bold text-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account…
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-5 text-center text-xs font-semibold text-slate-400 font-medium">
            Already have an account?{" "}
            <Link to="/" className="text-orange-400 hover:text-orange-300 font-bold transition-colors">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
