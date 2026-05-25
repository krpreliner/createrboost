"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ArrowLeft, Loader2, Copy, Check, Image, List } from "lucide-react";
import Link from "next/link";

interface ScriptResult {
  scriptText: string;
  estimatedDuration: string;
  keyPoints?: string[];
  thumbnailIdeas?: string[];
}

export default function ScriptsTool() {
  const [platform, setPlatform] = useState("youtube");
  const [tone, setTone] = useState("Professional");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"script" | "extras">("script");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    setResult(null);
    setCopied(false);
    setError("");
    setActiveTab("script");

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "script", params: { platform, topic, tone } }),
      });
      const data = await response.json();
      if (data.data) setResult(data.data);
      else setError("Failed to generate script. Please try again.");
    } catch {
      setError("Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.scriptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/dashboard/ai-tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Script Generator</h1>
          <p className="text-muted-foreground">Full scripts with hooks, sections, CTAs & thumbnail ideas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <form onSubmit={handleGenerate} className="glass-card p-6 rounded-2xl space-y-4 sticky top-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="youtube">YouTube Long-form</option>
                <option value="shorts">YouTube Shorts</option>
                <option value="reels">Instagram Reels</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Professional">Professional</option>
                <option value="Casual & Relatable">Casual & Relatable</option>
                <option value="Funny & Entertaining">Funny & Entertaining</option>
                <option value="Motivational">Motivational</option>
                <option value="Educational & Analytical">Educational & Analytical</option>
                <option value="Storytelling">Storytelling</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">What is the video about?</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Be specific! e.g. 'How I went from 0 to 10k subscribers in 6 months without spending money on ads'"
                rows={5}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !topic}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Writing Script...</> : <><MessageSquare className="w-5 h-5" /> Generate Full Script</>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground glass-card rounded-2xl">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="font-medium">Writing your complete script...</p>
              <p className="text-sm mt-1 opacity-60">Crafting hook, sections, and CTA</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          {!loading && !result && !error && (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground glass-card rounded-2xl">
              <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">Your full script will appear here</p>
              <p className="text-sm opacity-60 mt-1">Includes hook, body sections, CTA & thumbnail ideas</p>
            </div>
          )}

          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    ⏱ <span className="text-emerald-400 font-medium">{result.estimatedDuration}</span>
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveTab("script")}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${activeTab === "script" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 inline mr-1" />Script
                    </button>
                    <button
                      onClick={() => setActiveTab("extras")}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${activeTab === "extras" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
                    >
                      <List className="w-3.5 h-3.5 inline mr-1" />Extras
                    </button>
                  </div>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors"
                >
                  {copied ? <><Check className="w-4 h-4 text-green-400" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Script</>}
                </button>
              </div>

              {/* Script Tab */}
              {activeTab === "script" && (
                <div className="p-6 max-h-[600px] overflow-y-auto">
                  {result.scriptText.split('\n').map((line, i) => {
                    const isLabel = line.startsWith('[') && line.includes(']');
                    return (
                      <p
                        key={i}
                        className={`leading-relaxed mb-3 ${
                          isLabel
                            ? "text-emerald-400 font-bold text-xs uppercase tracking-widest mt-6 mb-1 first:mt-0"
                            : "text-white/90"
                        } ${line.trim() === '' ? 'mb-0' : ''}`}
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>
              )}

              {/* Extras Tab */}
              {activeTab === "extras" && (
                <div className="p-6 space-y-6">
                  {result.keyPoints && result.keyPoints.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <List className="w-4 h-4 text-emerald-400" /> Key Talking Points
                      </h3>
                      <ul className="space-y-2">
                        {result.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                            <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.thumbnailIdeas && result.thumbnailIdeas.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Image className="w-4 h-4 text-yellow-400" /> High-CTR Thumbnail Ideas
                      </h3>
                      <ul className="space-y-3">
                        {result.thumbnailIdeas.map((idea, i) => (
                          <li key={i} className="p-3 bg-yellow-400/5 border border-yellow-400/10 rounded-xl text-sm text-white/80">
                            <span className="text-yellow-400 font-bold mr-2">#{i + 1}</span>
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
