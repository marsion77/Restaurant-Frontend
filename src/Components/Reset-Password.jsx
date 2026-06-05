// RestaurantResetPassword.jsx - HERO ON RIGHT SIDE
import { useState } from "react";
import { 
  FaLockOpen, 
  FaKey, 
  FaFingerprint, 
  FaLock, 
  FaEnvelope, 
  FaCircleCheck 
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function RestaurantResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const securityIcons = [
    { icon: FaLockOpen, pos: "top-20 left-10", anim: "animate-bounce", delay: "-1s", color: "text-emerald-400/50", size: "text-5xl" },
    { icon: FaKey, pos: "top-32 right-20", anim: "animate-pulse", delay: "-2s", color: "text-indigo-400/40", size: "text-4xl" },
    { icon: FaFingerprint, pos: "top-1/2 left-8", anim: "animate-spin", delay: "-0.5s", color: "text-purple-500/45", size: "text-6xl" },
    { icon: FaLock, pos: "bottom-32 right-16", anim: "animate-ping", delay: "-1.5s", color: "text-sky-400/40", size: "text-5xl" },
    { icon: FaEnvelope, pos: "bottom-20 left-24", anim: "animate-bounce", delay: "-3s", color: "text-amber-400/40", size: "text-4xl" },
    { icon: FaKey, pos: "top-2/4 right-24", anim: "animate-pulse", delay: "-2.5s", color: "text-rose-400/40", size: "text-5xl" }
  ];

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    }, 1500);
  };

  const goToLogin = () => navigate('/');

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {securityIcons.map((iconProps, i) => (
            <div key={i} className={`absolute ${iconProps.pos} ${iconProps.anim} [animation-delay:${iconProps.delay}] opacity-30 ${iconProps.color} ${iconProps.size}`}>
              <iconProps.icon />
            </div>
          ))}
        </div>

        <div className="relative w-full max-w-md z-10 text-center">
          <div className="absolute inset-0 rounded-[2.25rem] bg-gradient-to-tr from-emerald-500/30 via-sky-400/20 to-emerald-400/30 blur-3xl animate-pulse" />
          
          <div className="relative bg-slate-900/90 border border-emerald-400/50 rounded-[2.25rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.85)] p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-400/10" />
            
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto mb-8 bg-emerald-500/20 rounded-3xl flex items-center justify-center border-4 border-emerald-400/50 animate-bounce">
                <FaCircleCheck className="text-4xl text-emerald-400" />
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-500 bg-clip-text text-transparent mb-4">
                Password Updated!
              </h2>
              
              <p className="text-lg text-slate-300 mb-8 max-w-sm mx-auto">
                Your new password has been set successfully. Redirecting to login...
              </p>
              
              <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-400/30 rounded-2xl px-6 py-3 text-emerald-300 font-medium mb-8">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                <span>Redirecting in <span className="text-emerald-400 font-bold">2</span>s</span>
              </div>
              
              <button
                onClick={goToLogin}
                className="group w-full rounded-xl bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-500 py-3 text-sm font-semibold text-slate-950 shadow-lg hover:shadow-emerald-400/70 hover:-translate-y-0.5 transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  Go to Login <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {securityIcons.map((iconProps, i) => (
          <div key={i} className={`absolute ${iconProps.pos} ${iconProps.anim} [animation-delay:${iconProps.delay}] opacity-30 ${iconProps.color} ${iconProps.size}`}>
            <iconProps.icon />
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-6xl z-10">
        <div className="absolute inset-0 rounded-[2.25rem] bg-gradient-to-tr from-sky-500/20 via-emerald-400/15 to-amber-400/20 blur-3xl" />
        
        <div className="relative bg-slate-900/80 border border-white/10 rounded-[2.25rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.85)] grid md:grid-cols-2 min-h-[600px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.25)_0%,rgba(15,23,42,0.9)_60%,rgba(15,23,42,1)_100%)]" />
          <div className="absolute inset-0 bg-slate-950/90" />

          {/* ✅ RESET PASSWORD FORM - LEFT SIDE */}
          <div className="relative px-8 py-9 md:px-10 lg:px-14 flex flex-col justify-center">
            <header className="flex flex-col gap-2 mb-7">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
                <FaKey className="text-2xl text-emerald-400" />
              </div>
              <h2 className="text-3xl font-semibold text-slate-50 mb-1">Set New Password</h2>
              <p className="text-sm text-slate-300">Create a strong password for your account security.</p>
            </header>

            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-100 mb-3 flex items-center gap-2">
                  <FaLock className="text-emerald-400" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 pr-16 text-sm text-slate-50 shadow-inner placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-2 flex items-center px-3 text-[11px] text-emerald-200 hover:text-emerald-100"
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-100 mb-3 flex items-center gap-2">
                  <FaLock className="text-emerald-400" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 pr-16 text-sm text-slate-50 shadow-inner placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-2 flex items-center px-3 text-[11px] text-emerald-200 hover:text-emerald-100"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 bg-slate-600 rounded-full" />
                  Password must be 8+ characters with uppercase, number, special char
                </div>
                <div className="flex gap-1 h-2 bg-slate-800/50 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${
                    newPassword.length >= 8 ? 'bg-emerald-400 w-1/4' : 'bg-slate-600 w-1/4'
                  }`} />
                  <div className={`h-full transition-all duration-300 ${
                    /[A-Z]/.test(newPassword) ? 'bg-emerald-400 w-1/4' : 'bg-slate-600 w-1/4'
                  }`} />
                  <div className={`h-full transition-all duration-300 ${
                    /\d/.test(newPassword) ? 'bg-emerald-400 w-1/4' : 'bg-slate-600 w-1/4'
                  }`} />
                  <div className={`h-full transition-all duration-300 ${
                    /[!@#$%^&*]/.test(newPassword) ? 'bg-emerald-400 w-1/4' : 'bg-slate-600 w-1/4'
                  }`} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 8}
                className="group w-full rounded-xl bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-500 py-2.5 text-sm font-semibold text-slate-950 shadow-lg hover:shadow-emerald-400/70 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      Set New Password <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            <p className="mt-6 text-center text-[11px] text-slate-300">
              Remember your password?{' '}
              <button onClick={goToLogin} className="font-semibold text-emerald-300 hover:text-emerald-200">
                Sign in instead
              </button>
            </p>
          </div>

          {/* ✅ FOOD SECURITY HERO IMAGE - RIGHT SIDE */}
          <div className="relative h-72 md:h-full order-1 md:order-2">
            <img 
              src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg" 
              alt="Food safety inspection - secure kitchen operations" 
              className="h-full w-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-950/65 to-emerald-900/40" />
            <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10 lg:p-14 text-white">
              <div className="space-y-4 max-w-md text-center md:text-right ml-auto">
                <div className="flex flex-col sm:flex-row-reverse sm:items-center sm:justify-between gap-3">
                  <p className="inline-flex items-center justify-center rounded-full bg-emerald-500/25 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-emerald-100 w-[220px] max-w-full self-center sm:w-auto">
                    Secure Update
                  </p>
                  <div className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900/70 border border-emerald-400/40 px-3 py-1 text-[11px] text-slate-100 shadow-md w-[240px] max-w-full self-center sm:w-auto">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Encrypted</span>
                  </div>
                </div>
                <h1 className="text-3xl mb-6 md:text-4xl lg:text-5xl font-semibold leading-tight">New Password</h1>
                <p className="text-sm md:text-base mb-3 text-slate-100/85">Set your new password with restaurant-grade security.</p>
              </div>
              <div className="space-y-3 hidden sm:flex flex-col items-end">
                <div className="text-[11px] uppercase tracking-[0.35em] text-emerald-200 mb-2">Password Requirements</div>
                <div className="text-sm space-y-1 text-emerald-100 text-right">
                  <div>• 8+ characters</div>
                  <div>• 1 uppercase, 1 number</div>
                  <div>• 1 special character</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
