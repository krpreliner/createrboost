"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, ArrowLeft, Loader2, TrendingUp, BookOpen, Sparkles, User, Bookmark } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Idea {
  title: string;
  category: string;
  description: string;
  estimatedViralScore?: number;
}

const categoryConfig: Record<string, { color: string; icon: any }> = {
  "Educational":      { color: "text-blue-400 bg-blue-400/10 border-blue-400/20",   icon: BookOpen },
  "Entertainment":    { color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: Sparkles },
  "Trending":         { color: "text-red-400 bg-red-400/10 border-red-400/20",       icon: TrendingUp },
  "Personal Branding":{ color: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: User },
};

export default function IdeasTool() {
  const { data: session } = useSession();
  const user = session?.user;
  const [platform, setPlatform] = useState("youtube");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Idea[] | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche) return;
    setLoading(true);
    setResults(null);
    setError("");

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "ideas", params: { platform, niche } }),
      });
      const data = await response.json();
      if (data.data) {
        setResults(Array.isArray(data.data) ? data.data : [data.data]);
        setSource(data.source || "demo");
      } else {
        setError(data.error || "Failed to generate ideas. Please try again.");
      }
    } catch {
      setError("Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const [source, setSource] = useState<string | null>(null);

  const handleSave = async (idea: Idea) => {
    if (!user) {
      toast.error("You must be logged in to save content");
      return;
    }
    
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.id,
          type: "idea",
          content: idea,
        }),
      });
      if (res.ok) {
        toast.success("Idea saved to your library!");
      } else {
        toast.error("Failed to save idea.");
      }
    } catch (e) {
      toast.error("An error occurred while saving.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/dashboard/ai-tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Content Idea Generator</h1>
          <p className="text-muted-foreground">AI generates 10 viral content ideas tailored to your niche.</p>
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
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram Reels</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Your Niche / Topic</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Personal Finance, Tech Reviews, Fitness"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !niche}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Lightbulb className="w-5 h-5" /> Generate 10 Ideas</>}
            </button>

            {results && (
              <p className="text-xs text-center text-muted-foreground">
                {results.length} ideas generated for <span className="text-primary font-medium">{niche}</span>
              </p>
            )}
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="font-medium">AI is brainstorming viral ideas...</p>
              <p className="text-sm mt-1 opacity-60">This takes about 10-15 seconds</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          {!loading && !results && !error && (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground glass-card rounded-2xl">
              <Lightbulb className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">Your 10 ideas will appear here</p>
              <p className="text-sm opacity-60 mt-1">Enter your niche and click Generate</p>
            </div>
          )}

          {results && !loading && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Generated Ideas ({results.length})</h2>
                {source === "gemini" && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    <Sparkles className="w-3 h-3" />
                    Live Gemini AI
                  </span>
                )}
              </div>
              {results.map((idea, index) => {
                const config = categoryConfig[idea.category] || { color: "text-white/60 bg-white/5 border-white/10", icon: Lightbulb };
                const Icon = config.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                    className="glass-card p-5 rounded-2xl hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="text-xl font-bold text-white/20 mt-0.5 w-6 flex-shrink-0">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-white font-semibold leading-snug">{idea.title}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border ${config.color}`}>
                          <Icon className="w-3 h-3" />
                          {idea.category}
                        </span>
                        {idea.estimatedViralScore && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            idea.estimatedViralScore >= 85 ? "bg-green-500/20 text-green-400" :
                            idea.estimatedViralScore >= 70 ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-white/10 text-white/60"
                          }`}>
                            🔥 {idea.estimatedViralScore}/100
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed pl-9 mb-4">{idea.description}</p>
                    <div className="flex justify-end pr-2">
                      <button 
                        onClick={() => handleSave(idea)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        Save to Library
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
