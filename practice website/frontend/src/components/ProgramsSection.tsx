'use client';

import { motion } from 'framer-motion';
import { Activity, Flame, HeartPulse, Shield, Weight } from 'lucide-react';

export default function ProgramsSection() {
  const programs = [
    {
      icon: <Weight className="w-10 h-10 text-white" />,
      title: "Strength Training",
      description: "Build muscle and increase raw power with our comprehensive free weights and modern machines.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"
    },
    {
      icon: <Flame className="w-10 h-10 text-white" />,
      title: "CrossFit",
      description: "High-intensity functional movements designed to improve overall fitness and endurance.",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop"
    },
    {
      icon: <HeartPulse className="w-10 h-10 text-white" />,
      title: "Cardio Fitness",
      description: "State-of-the-art treadmills, ellipticals, and bikes to maximize cardiovascular health.",
      image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=600&auto=format&fit=crop"
    },
    {
      icon: <Activity className="w-10 h-10 text-white" />,
      title: "Weight Loss",
      description: "Targeted programs combining nutrition advice with effective calorie-burning workouts.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop"
    },
    {
      icon: <Shield className="w-10 h-10 text-white" />,
      title: "Personal Training",
      description: "One-on-one coaching to keep you accountable and ensure proper form for maximum results.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <section id="programs" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold uppercase tracking-widest mb-2"
          >
            Our Programs
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight"
          >
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Path</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${program.image}')` }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="bg-primary/90 w-16 h-16 rounded-full flex items-center justify-center mb-6 transform transition-transform duration-500 group-hover:-translate-y-4 shadow-[0_0_15px_rgba(255,0,60,0.5)]">
                  {program.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 transform transition-transform duration-500 group-hover:-translate-y-4">
                  {program.title}
                </h3>
                <p className="text-gray-300 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-500 transform translate-y-4 group-hover:-translate-y-4">
                  {program.description}
                </p>
              </div>
            </motion.div>
          ))}
          
          {/* Join Now Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: programs.length * 0.1, duration: 0.5 }}
            className="group relative h-[400px] rounded-2xl overflow-hidden bg-surface-light border border-white/10 flex flex-col items-center justify-center text-center p-8 hover:border-primary/50 transition-colors"
          >
            <h3 className="text-3xl font-black text-white uppercase mb-4">Start Your Journey</h3>
            <p className="text-gray-400 mb-8">Join Iron Edge Gym today and transform your body and mind.</p>
            <a 
              href="#pricing"
              className="bg-primary hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,0,60,0.4)]"
            >
              View Pricing
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
