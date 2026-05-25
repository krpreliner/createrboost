"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-white/5 opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
            <SparklesIcon className="w-4 h-4" />
            <span>CreatorBoost AI 2.0 is here</span>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Grow Faster With <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">AI</span>
            </h1>
          </motion.div>
          
          <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            The ultimate AI-powered growth engine for content creators. Generate viral ideas, analyze hooks, and scale your audience on autopilot.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              Start for free <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 glass-card hover:bg-white/5 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5" /> Watch Demo
            </button>
          </motion.div>
          
          <motion.div variants={fadeIn} className="mt-20">
            <div className="relative rounded-2xl border border-white/10 glass-card p-2 md:p-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
              <img 
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop" 
                alt="Dashboard Preview" 
                className="w-full h-auto rounded-xl border border-white/5 object-cover object-center max-h-[600px] opacity-80 mix-blend-screen"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function SparklesIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
