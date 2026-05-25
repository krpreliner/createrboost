"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, Loader2, ShieldCheck, ArrowLeft, TrendingUp, Wand2, Star } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [humanVerified, setHumanVerified] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("If an account exists, a recovery link has been sent (check console for now).");
          setIsForgotPassword(false);
        } else {
          toast.error(data.error || "Failed to send reset link");
        }
      } catch (err: any) {
        toast.error("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!humanVerified) {
      toast.error("Please confirm you are not a robot.");
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success("Successfully logged in!");
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to register");
        } else {
          toast.success("Registration successful! Logging you in...");
          
          // Log them in immediately after registering
          const signInRes = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });

          if (!signInRes?.error) {
            router.push("/dashboard");
            router.refresh();
          }
        }
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 bg-[#050505] relative overflow-hidden">
      {/* LEFT SIDE - Marketing / Branding */}
      <div className="hidden lg:flex flex-col justify-center relative p-12 lg:p-20 border-r border-white/5 overflow-hidden">
        {/* Dynamic Colorful Backgrounds */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/30 via-background to-background pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/40 via-background to-background pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-1000" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-16 w-fit group">
            <div className="p-2.5 bg-primary/20 rounded-xl border border-primary/40 group-hover:bg-primary/30 transition-colors">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <span className="font-extrabold text-3xl text-white tracking-tight">CreatorBoost</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              The Ultimate AI Toolkit <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-emerald-400 animate-gradient-x">
                for Next-Gen Creators.
              </span>
            </h1>
            <p className="text-lg xl:text-xl text-white/60 mb-12 max-w-lg leading-relaxed font-light">
              Stop guessing what the algorithm wants. Use data-driven insights and generative AI to craft viral content, dominate trends, and scale your audience exponentially.
            </p>
          </motion.div>

          <div className="relative max-w-xl mt-8">
            {/* Floating Achievement Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              transition={{ 
                opacity: { duration: 0.5, delay: 0.6 },
                scale: { duration: 0.5, delay: 0.6 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -top-12 -right-12 z-20 hidden xl:flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(234,179,8,0.2)]"
            >
              <div className="p-2 bg-yellow-500/20 rounded-xl">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">#1 AI Tool</p>
                <p className="text-yellow-400/80 text-xs font-semibold uppercase tracking-wider">For Creators</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 3D Feature Card 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -30, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.2, type: "spring" }}
                whileHover={{ scale: 1.05, rotateX: 8, rotateY: -8, z: 60 }}
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                className="p-[1px] rounded-2xl bg-gradient-to-br from-emerald-500/40 to-transparent hover:from-emerald-400/60 transition-all duration-300 shadow-lg group"
              >
                <div className="glass-card p-5 rounded-2xl border-0 bg-black/50 backdrop-blur-xl h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
                    <div className="w-12 h-12 mb-4 flex items-center justify-center bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">Viral Trends</h3>
                    <p className="text-white/60 text-sm leading-relaxed">Catch exploding niches before anyone else does.</p>
                  </div>
                </div>
              </motion.div>

              {/* 3D Feature Card 2 */}
              <motion.div 
                initial={{ opacity: 0, x: 30, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.3, type: "spring" }}
                whileHover={{ scale: 1.05, rotateX: 8, rotateY: 8, z: 60 }}
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                className="p-[1px] rounded-2xl bg-gradient-to-bl from-purple-500/40 to-transparent hover:from-purple-400/60 transition-all duration-300 shadow-lg group"
              >
                <div className="glass-card p-5 rounded-2xl border-0 bg-black/50 backdrop-blur-xl h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
                    <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-500/20 rounded-xl border border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                      <Wand2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">AI Hooks</h3>
                    <p className="text-white/60 text-sm leading-relaxed">Generate hooks scientifically proven to retain viewers.</p>
                  </div>
                </div>
              </motion.div>

              {/* 3D Feature Card 3 */}
              <motion.div 
                initial={{ opacity: 0, x: -30, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.4, type: "spring" }}
                whileHover={{ scale: 1.05, rotateX: -8, rotateY: -8, z: 60 }}
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                className="p-[1px] rounded-2xl bg-gradient-to-tr from-blue-500/40 to-transparent hover:from-blue-400/60 transition-all duration-300 shadow-lg group md:translate-y-4"
              >
                <div className="glass-card p-5 rounded-2xl border-0 bg-black/50 backdrop-blur-xl h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
                    <div className="w-12 h-12 mb-4 flex items-center justify-center bg-blue-500/20 rounded-xl border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">Auto-Scripts</h3>
                    <p className="text-white/60 text-sm leading-relaxed">Turn any idea into a full, engaging video script in seconds.</p>
                  </div>
                </div>
              </motion.div>

              {/* 3D Feature Card 4 */}
              <motion.div 
                initial={{ opacity: 0, x: 30, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.5, type: "spring" }}
                whileHover={{ scale: 1.05, rotateX: -8, rotateY: 8, z: 60 }}
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                className="p-[1px] rounded-2xl bg-gradient-to-tl from-pink-500/40 to-transparent hover:from-pink-400/60 transition-all duration-300 shadow-lg group md:translate-y-4"
              >
                <div className="glass-card p-5 rounded-2xl border-0 bg-black/50 backdrop-blur-xl h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
                    <div className="w-12 h-12 mb-4 flex items-center justify-center bg-pink-500/20 rounded-xl border border-pink-500/30 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">Shadowban Proof</h3>
                    <p className="text-white/60 text-sm leading-relaxed">AI ensures your content abides by all platform algorithms.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Testimonial Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, type: "spring" }}
              className="mt-16 p-6 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 relative shadow-2xl backdrop-blur-md"
            >
              <div className="absolute -top-4 -right-4 flex gap-1 bg-black/80 backdrop-blur-xl p-2.5 rounded-full border border-white/10 shadow-2xl">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-white/90 italic mb-5 leading-relaxed font-light text-base pr-8">"I went from 2k to 150k subscribers in 3 months by literally just letting the AI tell me what to post. It feels like cheating."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 shadow-lg border-2 border-white/20 flex items-center justify-center font-bold text-white text-sm">
                  SJ
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Sarah Jenkins</p>
                  <p className="text-emerald-400 font-semibold text-[10px] uppercase tracking-widest">Tech Creator • 150k Subs</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative overflow-hidden h-full">
        {/* Colorful Background Orbs for the Right Side */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Mesh gradient overlay for the right side */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background pointer-events-none" />

        <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 z-10 lg:hidden">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg text-white">CreatorBoost</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[440px] p-8 sm:p-10 rounded-3xl z-10 relative shadow-[0_0_50px_rgba(99,102,241,0.15)] border border-white/10 bg-black/40 backdrop-blur-3xl before:absolute before:inset-0 before:rounded-3xl before:p-[1px] before:bg-gradient-to-b before:from-white/20 before:to-transparent before:-z-10"
        >
          <div className="text-center mb-10">
            {isForgotPassword ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-3">Reset Password</h2>
                <p className="text-white/60">Enter your email and we'll send you a recovery link.</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
                  {isLogin ? "Welcome back" : "Create an account"}
                </h2>
                <p className="text-white/60 text-sm">
                  {isLogin ? "Log in to your dashboard to continue." : "Start your 14-day free trial today."}
                </p>
              </>
            )}
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
                required
              />
            </div>

            {!isForgotPassword && (
              <>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
                    required
                    minLength={6}
                  />
                </div>
                
                {isLogin && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Custom "I am not a robot" Security Check */}
                <button
                  type="button"
                  onClick={() => setHumanVerified(!humanVerified)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm ${
                    humanVerified
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "bg-black/40 border-white/10 text-white/60 hover:border-white/30"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 flex-shrink-0 transition-all duration-300 ${
                    humanVerified ? "bg-emerald-500 border-emerald-500" : "border-white/30"
                  }`}>
                    {humanVerified && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                  <span className="text-sm font-medium flex-1 text-left">
                    {humanVerified ? "Verified — Not a robot" : "I am not a robot"}
                  </span>
                  <ShieldCheck className={`w-5 h-5 flex-shrink-0 transition-colors ${humanVerified ? "text-emerald-400" : "text-white/30"}`} />
                </button>
              </>
            )}

            <button
              type="submit"
              disabled={loading || (!isForgotPassword && !humanVerified)}
              className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] mt-4"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : isForgotPassword ? (
                "Send Recovery Link"
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {!isForgotPassword && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
                  <span className="bg-[#0f0a1c] px-3 text-white/40 rounded-full">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white text-black hover:bg-gray-100 rounded-2xl font-bold text-base transition-all shadow-md active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google & YouTube
              </button>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-white/60 font-medium">
            {isForgotPassword ? (
              <button
                onClick={() => setIsForgotPassword(false)}
                className="flex items-center justify-center gap-2 w-full text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to login
              </button>
            ) : (
              <>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-primary/80 font-bold transition-colors ml-1"
                >
                  {isLogin ? "Sign up free" : "Log in"}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
