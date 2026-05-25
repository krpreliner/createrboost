"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, Search, Star, Upload, X, Image as ImageIcon, Send, Bot, User, Sparkles, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ThumbnailAnalyzer() {
  const [title, setTitle] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat State
  const [messages, setMessages] = useState<{role: string, content: string, imageUrl?: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be smaller than 4MB.");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      const base64Data = base64String.split(",")[1];
      setImageBase64(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    setResult(null);
    setError("");
    setMessages([]);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tool: "thumbnail", 
          params: { 
            title,
            image: imageBase64 
          } 
        }),
      });
      const data = await response.json();
      if (data.data) {
        setResult(data.data);
        // Initialize the AI Supporter
        setMessages([
          { role: "assistant", content: `I've analyzed your title "${title}" ${imageBase64 ? "and your thumbnail image" : ""}. Your predicted CTR score is ${data.data.ctrScore}/100! Let me know if you want me to write more title variations, explain any of the suggested improvements, or generate a brand new thumbnail design for you.` }
        ]);
      }
      else setError(data.error || "Analysis failed. Try again.");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = { role: "user", content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      // Build the full context for the AI
      const systemPrompt = `You are an AI Design & Title Supporter helping a YouTube creator refine their content.
      Context of their original request:
      Title they provided: "${title}"
      Has thumbnail image: ${imageBase64 ? "Yes" : "No"}
      
      The analysis you just gave them:
      CTR Score: ${result.ctrScore}/100
      Analysis: ${result.analysis}
      Strengths: ${result.strengths.join(", ")}
      Improvements: ${result.improvements.join(", ")}
      
      Goal: Answer their follow-up questions accurately, generate more title variations if asked, or give specific design advice based on the improvements you suggested. Keep your answers concise and directly actionable.`;

      const chatHistory = [...messages, userMsg].map(m => ({ role: m.role, content: m.content })); // strip imageUrl for backend

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory, systemPrompt }),
      });

      const data = await res.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response, imageUrl: data.imageUrl }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that request." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "A network error occurred." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <Link href="/dashboard/ai-tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Title & Thumbnail Analyzer</h1>
          <p className="text-muted-foreground">Get AI-predicted CTR score and visual improvement suggestions.</p>
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="glass-card p-6 rounded-2xl space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Video Title <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How I Made $10,000 In One Month With YouTube"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Thumbnail Image (Optional)</label>
          {!imagePreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-primary/50 transition-colors"
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload thumbnail</p>
              <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WEBP (Max 4MB)</p>
            </div>
          ) : (
            <div className="relative w-full rounded-xl overflow-hidden aspect-video bg-black/40 border border-white/10 flex items-center justify-center group">
              <Image src={imagePreview} alt="Thumbnail preview" fill className="object-contain" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title}
          className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Search className="w-5 h-5" /> Analyze Content</>}
        </button>
      </form>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-4">{error}</div>}

      {loading && (
        <div className="flex flex-col items-center py-16 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p>Vision AI is analyzing your content...</p>
        </div>
      )}

      {result && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* CTR Score */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">CTR Prediction Score</h2>
              <span className={`text-3xl font-black ${result.ctrScore >= 70 ? "text-green-400" : result.ctrScore >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                {result.ctrScore}/100
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.ctrScore}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`h-3 rounded-full ${result.ctrScore >= 70 ? "bg-green-400" : result.ctrScore >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
              />
            </div>
            <p className="text-muted-foreground text-sm mt-3">{result.analysis}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div className="glass-card p-6 rounded-2xl h-full">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="text-green-400 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <div className="glass-card p-6 rounded-2xl h-full">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-blue-400" /> Suggested Improvements</h3>
                <ul className="space-y-2">
                  {result.improvements.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="text-blue-400 mt-0.5">→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Better Titles */}
          {result.betterTitles?.length > 0 && (
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-white font-semibold mb-3">✨ Optimized Title Alternatives</h3>
              <ul className="space-y-3">
                {result.betterTitles.map((t: string, i: number) => (
                  <li key={i} className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-white text-sm font-medium">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Supporter Chat UI */}
          <div className="glass-card p-6 rounded-2xl mt-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" /> AI Supporter
            </h3>
            
            <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${
                          msg.role === 'user' ? 'bg-primary/20 border-primary/30' : 'bg-white/10 border-white/20'
                        }`}>
                          {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-primary" />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-white/90 rounded-tl-none'
                        }`}>
                          <p>{msg.content}</p>
                          {msg.imageUrl && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-white/10 relative group">
                              <img src={msg.imageUrl} alt="Generated Thumbnail" className="w-full h-auto object-cover" />
                              <a 
                                href={msg.imageUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute bottom-2 right-2 p-2 bg-black/60 hover:bg-primary text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-2 backdrop-blur-sm"
                              >
                                <Download className="w-4 h-4" /> Download
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl rounded-tl-none flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSendChat} className="p-3 border-t border-white/5 bg-white/5 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me to write more titles, explain a suggestion, or generate a new thumbnail..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
