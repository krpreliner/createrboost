'use client';

import { motion } from 'framer-motion';
import { Dumbbell, ShieldCheck, Trophy, Users } from 'lucide-react';
import Image from 'next/image';

export default function AboutSection() {
  const features = [
    {
      icon: <Dumbbell className="w-8 h-8 text-primary" />,
      title: "Modern Equipment",
      description: "Train with the latest and most advanced fitness technology available."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Certified Trainers",
      description: "Our elite trainers have years of experience to guide your fitness journey."
    },
    {
      icon: <Trophy className="w-8 h-8 text-primary" />,
      title: "Transformation Focus",
      description: "We focus on actual results and sustainable body transformations."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Safe Environment",
      description: "A clean, secure, and supportive space for everyone to train safely."
    }
  ];

  return (
    <section id="about" className="py-24 bg-surface relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Image Grid */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-8"
            >
              <img 
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop" 
                alt="Gym Equipment" 
                className="rounded-xl w-full h-[250px] object-cover shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
                alt="Personal Training" 
                className="rounded-xl w-full h-[300px] object-cover shadow-2xl"
              />
            </motion.div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h4 className="text-primary font-bold uppercase tracking-widest mb-2">About Iron Edge</h4>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                More Than Just <br/> A Gym.
              </h2>
              <p className="text-gray-400 mb-10 text-lg">
                Located near SBI Bank in Ranchi, Iron Edge Gym is the city's premier fitness destination. We blend luxury aesthetics with hardcore training principles to help you achieve the physique you've always wanted. 
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="bg-surface-light p-3 rounded-lg h-fit shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <a 
                  href="#contact"
                  className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
