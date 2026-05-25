"use client";

import { motion } from "framer-motion";
import { Lightbulb, Magnet, FileVideo, Clock, BarChart3, MessageSquare } from "lucide-react";

const features = [
  {
    name: "AI Content Idea Generator",
    description: "Generate viral content ideas tailored to your niche across educational, entertainment, and trending categories.",
    icon: Lightbulb,
  },
  {
    name: "Viral Hook Generator",
    description: "Stop the scroll with high-retention hooks engineered specifically for YouTube Shorts, Reels, and TikTok.",
    icon: Magnet,
  },
  {
    name: "Thumbnail & Title Analyzer",
    description: "Upload your thumbnail and title to get instant AI-predicted CTR scores and actionable improvement suggestions.",
    icon: FileVideo,
  },
  {
    name: "AI Script Generator",
    description: "Turn ideas into full scripts with customized tones—Professional, Funny, Motivational, or Educational.",
    icon: MessageSquare,
  },
  {
    name: "Posting Time Optimizer",
    description: "Maxmize reach with AI recommendations on exactly when to post based on audience activity data.",
    icon: Clock,
  },
  {
    name: "Creator Analytics Dashboard",
    description: "Track followers, engagement, and watch-time with beautiful charts and predictive growth algorithms.",
    icon: BarChart3,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything you need to go viral</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our suite of AI tools replaces your entire content team. From ideation to publishing, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl hover:border-primary/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.name}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
