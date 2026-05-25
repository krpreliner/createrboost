'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function MembershipSection() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Basic",
      monthlyPrice: 1500,
      yearlyPrice: 15000,
      features: [
        "Access to gym equipment",
        "Locker room access",
        "Free fitness consultation",
        "Basic training plan"
      ],
      notIncluded: [
        "Personal Trainer",
        "Diet Plan",
        "Spa & Sauna access"
      ],
      recommended: false
    },
    {
      name: "Pro",
      monthlyPrice: 2500,
      yearlyPrice: 25000,
      features: [
        "All Basic features",
        "Group classes included",
        "Customized diet plan",
        "1 Personal Training session/mo",
        "Advanced training program"
      ],
      notIncluded: [
        "Spa & Sauna access"
      ],
      recommended: true
    },
    {
      name: "Elite",
      monthlyPrice: 4000,
      yearlyPrice: 40000,
      features: [
        "All Pro features",
        "Unlimited Personal Training",
        "Premium diet & nutrition",
        "Spa & Sauna access",
        "Guest passes (2/month)"
      ],
      notIncluded: [],
      recommended: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold uppercase tracking-widest mb-2"
          >
            Pricing Plans
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-8"
          >
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Membership</span>
          </motion.h2>

          {/* Toggle */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            <span className={`text-sm font-bold uppercase tracking-wider ${!isYearly ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-16 h-8 bg-surface-light rounded-full p-1 flex items-center transition-colors border border-white/10 relative"
            >
              <div 
                className={`w-6 h-6 bg-primary rounded-full shadow-lg transform transition-transform duration-300 ${isYearly ? 'translate-x-8' : 'translate-x-0'}`}
              ></div>
            </button>
            <span className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isYearly ? 'text-white' : 'text-gray-500'}`}>
              Yearly <span className="bg-primary/20 text-primary text-[10px] px-2 py-1 rounded-full">Save 20%</span>
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`glass-card relative flex flex-col p-8 transition-transform duration-500 hover:-translate-y-4 ${
                plan.recommended 
                  ? 'border-primary shadow-[0_0_30px_rgba(255,0,60,0.15)] scale-105 md:-mt-4 md:mb-4 z-10' 
                  : 'border-white/10'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-8 pb-8 border-b border-white/10">
                <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">{plan.name}</h3>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-xl text-gray-400 font-bold">₹</span>
                  <span className="text-5xl font-black text-white">
                    {isYearly ? plan.yearlyPrice.toLocaleString('en-IN') : plan.monthlyPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-gray-400 font-medium mb-1">/{isYearly ? 'yr' : 'mo'}</span>
                </div>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="bg-primary/20 rounded-full p-1 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 opacity-50">
                    <div className="bg-surface rounded-full p-1 mt-0.5">
                      <Check className="w-3 h-3 text-transparent" />
                    </div>
                    <span className="text-gray-500 text-sm line-through">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`w-full py-4 rounded-full font-bold uppercase tracking-wider transition-all ${
                  plan.recommended
                    ? 'bg-primary text-white hover:bg-red-600 shadow-[0_0_15px_rgba(255,0,60,0.4)] hover:shadow-[0_0_25px_rgba(255,0,60,0.6)]'
                    : 'bg-surface text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                Buy Membership
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
