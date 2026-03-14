"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowLeft, Loader2, ShieldCheck, Eye, EyeOff, XCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Small delay for realism
    setTimeout(() => {
      if (email === "SweetMeltAdmin@gmail.com" && password === "ardiansayangjaka") {
        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_email", email);
        router.push("/admin");
      } else {
        setError("Email atau Password salah!");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6 relative">
      {/* Back Button - Top Left */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-slate-900 hover:shadow-sm hover:border-slate-300 transition-all text-xs font-bold group z-[100]"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Ke Landing Page
      </Link>

      {/* Decorative Blur */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-lumer/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-oreo-black/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[400px] relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
             <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                <ShieldCheck className="text-white" size={28} />
             </div>
             <span className="font-display text-3xl font-bold tracking-tight text-slate-950">
               Sweet<span className="text-lumer">Melt</span>
             </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">Admin Authentication</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Lakukan login untuk mengelola operasional harian.</p>
        </div>

        {/* Shadcn-like Card */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-slate-700 block ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-lumer transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-slate-700 block ml-1">Security Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-lumer transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-slate-900 placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 z-20"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold animate-shake flex items-center gap-2">
                <XCircle size={14} className="shrink-0" /> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-slate-950 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Mencocokkan Data...
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
             <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-300">
                <span>Secure Access</span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
             </div>
          </div>
        </div>
        
        <p className="text-center text-[11px] text-slate-400 mt-8 font-medium italic">
          &copy; 2026 SweetMelt Internal Systems.
        </p>
      </div>
    </main>
  );
}
