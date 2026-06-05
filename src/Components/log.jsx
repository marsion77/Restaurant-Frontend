import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple, FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api/config";

export default function RestaurantLogin() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_BASE}/users/loginUser`, { email, password });
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/menu");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center relative font-sans">
      
      {/* Premium Background Graphics - Enhanced brightness */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(251,146,60,0.22),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Main Glass Container */}
      <div className="relative w-full max-w-md mx-4 z-10">
        
        {/* Stronger Glow Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-3xl blur-md opacity-40 transition duration-1000" />
        
        <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-center">
          
          {/* Logo Section */}
          <div className="text-center mb-6">
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

          <h2 className="text-lg font-bold text-slate-200 mb-4 text-center">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <FaEnvelope size={14} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 pl-11 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-semibold"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="text-xs font-bold text-slate-300">Password</label>
                <Link to="/forget-password" className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <FaLock size={14} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 pl-11 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-semibold"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-orange-400 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center ml-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-400 hover:text-slate-300 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-lg border-slate-700 bg-slate-950/80 text-orange-500 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-orange-500"
                />
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3 text-[10px] uppercase font-bold tracking-wider text-slate-500 select-none">
            <span className="flex-1 h-px bg-slate-800" />
            or connect with
            <span className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <FcGoogle size={18} />, key: "Google" },
              { icon: <FaFacebook size={16} className="text-blue-500" />, key: "Facebook" },
              { icon: <FaApple size={16} className="text-white" />, key: "Apple" }
            ].map(({ icon, key }) => (
              <button
                key={key}
                type="button"
                className="flex items-center justify-center py-2.5 rounded-2xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer"
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-xs font-semibold text-slate-400 font-medium">
            New to Sky Bowl?{" "}
            <Link to="/register" className="text-orange-400 hover:text-orange-300 font-bold transition-colors">
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
