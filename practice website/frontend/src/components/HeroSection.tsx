'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        {/* We use a placeholder image for the cinematic gym video/image for now */}
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase leading-[1.1] tracking-tight mb-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Push Beyond <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Your Limits
            </span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the ultimate transformation in a luxury fitness environment. 
            State-of-the-art equipment, elite trainers, and a community built on strength.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 items-center md:items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a 
              href="#pricing"
              className="group flex items-center justify-center gap-2 bg-primary hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all w-full sm:w-auto shadow-[0_0_20px_rgba(255,0,60,0.5)]"
            >
              Join Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#contact"
              className="flex items-center justify-center gap-2 glass text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white/10 transition-all w-full sm:w-auto"
            >
              <Play className="w-5 h-5" />
              Book Free Trial
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Stats */}
      <motion.div 
        className="absolute bottom-10 left-0 w-full z-10 hidden md:block"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between">
          <div className="glass-card px-8 py-4 flex flex-col items-center border-l-4 border-l-primary">
            <span className="text-3xl font-black text-white">50+</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Premium Machines</span>
          </div>
          <div className="glass-card px-8 py-4 flex flex-col items-center border-l-4 border-l-primary">
            <span className="text-3xl font-black text-white">10+</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Expert Trainers</span>
          </div>
          <div className="glass-card px-8 py-4 flex flex-col items-center border-l-4 border-l-primary">
            <span className="text-3xl font-black text-white">24/7</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Member Access</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
