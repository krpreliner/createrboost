"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden glass-card p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to skyrocket your views?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of creators who are using AI to grow their audience 10x faster. Try CreatorBoost AI today.
            </p>
            
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black hover:bg-white/90 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95">
              Start Your Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            
            <p className="mt-4 text-sm text-white/60">No credit card required • 14-day free trial</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
