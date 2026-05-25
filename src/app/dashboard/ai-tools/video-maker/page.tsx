"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, ArrowLeft, Loader2, Download, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function VideoMakerTool() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (predictionId && (status === "starting" || status === "processing")) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`/api/ai/video/${predictionId}`);
          const data = await res.json();

          if (data.error) {
            setError(data.error);
            setStatus("failed");
            setLoading(false);
            clearInterval(intervalId);
            return;
          }

          setStatus(data.status);

          if (data.status === "succeeded") {
            setVideoUrl(data.output);
            setLoading(false);
            clearInterval(intervalId);
            toast.success("Video generated successfully!");
          } else if (data.status === "failed" || data.status === "canceled") {
            setError("Generation failed or was canceled.");
            setLoading(false);
            clearInterval(intervalId);
            toast.error("Video generation failed.");
          }
        } catch (err) {
          console.error("Error polling status:", err);
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [predictionId, status]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setStatus("starting");
    
    try {
      const response = await fetch("/api/ai/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setLoading(false);
        setStatus("failed");
        toast.error(data.error);
        return;
      }
      
      setPredictionId(data.id);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
      setStatus("failed");
      toast.error("Failed to connect to server.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/dashboard/ai-tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Video className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Text-to-Video Generator</h1>
          <p className="text-muted-foreground">Transform your prompts into stunning HD videos instantly using advanced AI models.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <form onSubmit={handleGenerate} className="glass-card p-6 rounded-2xl space-y-4 sticky top-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Video Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe exactly what you want to see. e.g. 'A cinematic tracking shot of a futuristic cyberpunk city at night with neon lights reflecting on wet streets...'"
                rows={8}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-500/90 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
              ) : (
                <><Video className="w-5 h-5" /> Generate Video</>
              )}
            </button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Video generation may take 1-3 minutes to complete.
            </p>
          </form>
        </div>

        <div className="lg:col-span-8">
          {error && (
            <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
               <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
               <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {!loading && !videoUrl && !error && (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground glass-card rounded-2xl border-dashed border-white/10 border-2">
              <Video className="w-16 h-16 mb-6 opacity-20" />
              <p className="font-medium text-lg">Your generated video will appear here</p>
              <p className="text-sm opacity-60 mt-2 max-w-sm text-center">
                Enter a detailed prompt on the left and click generate to create your AI video.
              </p>
            </div>
          )}

          {loading && (
             <div className="flex flex-col items-center justify-center py-32 text-muted-foreground glass-card rounded-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/10 animate-pulse" />
               <Loader2 className="w-12 h-12 animate-spin text-purple-400 mb-6" />
               <p className="font-semibold text-white text-lg">Generating Video...</p>
               <p className="text-sm mt-2 opacity-80 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                 Status: <span className="text-purple-400 capitalize">{status}</span>
               </p>
               <p className="text-xs mt-6 opacity-50 text-center max-w-sm">
                 Please wait, high quality AI video models typically take 60-120 seconds to process frames.
               </p>
             </div>
          )}

          {videoUrl && !loading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-purple-500/20"
            >
              <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <span className="text-sm font-medium text-white/80">
                  ✨ Generation Complete
                </span>
                <a
                  href={videoUrl}
                  download="generated-video.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm font-medium transition-colors border border-purple-500/30"
                >
                  <Download className="w-4 h-4" /> Download MP4
                </a>
              </div>

              <div className="p-4 bg-black/40">
                 <video 
                    ref={videoRef}
                    controls 
                    autoPlay 
                    loop
                    className="w-full rounded-xl"
                    src={videoUrl}
                 >
                    Your browser does not support the video tag.
                 </video>
              </div>
              
              <div className="p-5 bg-white/5 border-t border-white/10">
                 <h4 className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Original Prompt</h4>
                 <p className="text-sm text-white/90 leading-relaxed italic border-l-2 border-purple-500 pl-3">
                    "{prompt}"
                 </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
