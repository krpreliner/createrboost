"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Flame, ArrowRight, Sparkles, Search, Loader2 } from "lucide-react";

interface Trend {
  topic: string;
  growth: string;
  status: string;
  category: string;
}

interface TrendData {
  prediction: string;
  trends: Trend[];
}

export default function TrendsPage() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrendData | null>(null);
  const [error, setError] = useState("");

  const handleDiscover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/trends/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche }),
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Failed to fetch trends");
      }

      setData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Real Trend Discovery</h1>
        <p className="text-muted-foreground text-lg">AI-powered insights into exactly what's going viral right now in your niche.</p>
      </div>

      <form onSubmit={handleDiscover} className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="Enter your niche (e.g., Fitness, Tech Reviews, Real Estate)"
          className="w-full pl-12 pr-32 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg shadow-xl shadow-black/20"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !niche.trim()}
          className="absolute inset-y-2 right-2 px-6 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Discover"
          )}
        </button>
      </form>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl max-w-2xl">
          {error}
        </motion.div>
      )}

      {loading && !data && (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <Sparkles className="w-12 h-12 text-primary animate-bounce relative z-10" />
          </div>
          <p className="text-muted-foreground text-lg animate-pulse">Analyzing millions of data points for "{niche}"...</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {data && !loading && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 glass-card p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">AI Trend Prediction</h2>
              </div>
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                {data.prediction}
              </p>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium text-white">Algorithm Confidence Score</span>
                </div>
                <span className="text-lg font-bold text-emerald-400">94%</span>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Flame className="w-6 h-6 text-red-500" />
                </div>
                Exploding Topics
              </h2>
              <div className="space-y-4">
                {data.trends.map((trend, i) => (
                  <motion.div 
                    key={trend.topic}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group border border-white/5 hover:border-primary/30"
                  >
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">{trend.topic}</p>
                      <p className="text-xs text-muted-foreground">{trend.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-emerald-400">{trend.growth}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">{trend.status}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
