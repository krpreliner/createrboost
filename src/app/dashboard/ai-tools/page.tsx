"use client";

import { motion } from "framer-motion";
import { Lightbulb, Magnet, FileVideo, MessageSquare, ArrowRight, Video } from "lucide-react";
import Link from "next/link";

const aiTools = [
  {
    name: "Content Idea Generator",
    description: "Generate viral content ideas tailored to your niche across educational, entertainment, and trending categories.",
    icon: Lightbulb,
    href: "/dashboard/ai-tools/ideas",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    name: "Viral Hook Generator",
    description: "Stop the scroll with high-retention hooks engineered specifically for YouTube Shorts, Reels, and TikTok.",
    icon: Magnet,
    href: "/dashboard/ai-tools/hooks",
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
  {
    name: "Thumbnail Analyzer",
    description: "Upload your thumbnail and title to get instant AI-predicted CTR scores and actionable improvement suggestions.",
    icon: FileVideo,
    href: "/dashboard/ai-tools/thumbnails",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    name: "Script Generator",
    description: "Turn ideas into full scripts with customized tones—Professional, Funny, Motivational, or Educational.",
    icon: MessageSquare,
    href: "/dashboard/ai-tools/scripts",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    name: "AI Video Maker",
    description: "Transform your text prompts into stunning high-definition videos instantly using advanced AI models.",
    icon: Video,
    href: "/dashboard/ai-tools/video-maker",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

export default function AITools() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">AI Creator Tools</h1>
        <p className="text-muted-foreground">Supercharge your content creation workflow with our specialized AI models.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {aiTools.map((tool, index) => (
          <Link href={tool.href} key={tool.name}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl h-full hover:border-primary/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${tool.bg}`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="text-muted-foreground mb-6">
                {tool.description}
              </p>
              
              <div className="flex items-center text-sm font-medium text-primary mt-auto">
                Try Tool <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
