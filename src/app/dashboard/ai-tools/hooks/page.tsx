"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Magnet, ArrowLeft, Loader2, Brain, Zap, Target } from "lucide-react";
import Link from "next/link";

interface HookResult {
  hookText: string;
  psychologyTrigger: string;
  hookType?: string;
  platformFit?: string;
}

export default function HooksTool() {
  const [platform, setPlatform] = useState("youtube");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HookResult[] | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    setResults(null);
    setError("");

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "hooks", params: { platform, topic } }),
      });
      const data = await response.json();
      if (data.data) setResults(Array.isArray(data.data) ? data.data : [data.data]);
      else setError("Failed to generate hooks. Please try again.");
    } catch {
      setError("Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyHook = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/dashboard/ai-tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-red-400/10 flex items-center justify-center">
          <Magnet className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Viral Hook Generator</h1>
          <p className="text-muted-foreground">8 psychology-backed hooks engineered to stop the scroll.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleGenerate} className="glass-card p-6 rounded-2xl space-y-4 sticky top-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="youtube">YouTube Shorts</option>
                <option value="instagram">Instagram Reels</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube-long">YouTube Long-form</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Video Topic</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How to start a successful podcast in 2026 with no audience"
                rows={4}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !topic}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Magnet className="w-5 h-5" /> Generate 8 Hooks</>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="font-medium">Engineering the perfect hooks...</p>
              <p className="text-sm mt-1 opacity-60">Analyzing psychology triggers</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          {!loading && !results && !error && (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground glass-card rounded-2xl">
              <Magnet className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">8 scroll-stopping hooks will appear here</p>
              <p className="text-sm opacity-60 mt-1">Describe your video topic to get started</p>
            </div>
          )}

          {results && !loading && (
            <>
              <h2 className="text-lg font-semibold text-white">High-Retention Hooks ({results.length})</h2>
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  className="glass-card p-5 rounded-2xl border-l-4 border-l-red-400 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-white text-base font-medium italic leading-relaxed flex-1">
                      "{result.hookText}"
                    </p>
                    <button
                      onClick={() => copyHook(result.hookText, index)}
                      className="flex-shrink-0 px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                      {copied === index ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-red-400/10 text-red-400 border border-red-400/20">
                      <Brain className="w-3 h-3" />
                      {result.psychologyTrigger}
                    </span>
                    {result.hookType && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-purple-400/10 text-purple-400 border border-purple-400/20">
                        <Zap className="w-3 h-3" />
                        {result.hookType}
                      </span>
                    )}
                    {result.platformFit && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-blue-400/10 text-blue-400 border border-blue-400/20">
                        <Target className="w-3 h-3" />
                        {result.platformFit}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
