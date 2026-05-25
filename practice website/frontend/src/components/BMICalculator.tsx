'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator } from 'lucide-react';

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight) return;

    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);
    
    if (h > 0 && w > 0) {
      const calculatedBmi = w / (h * h);
      setBmi(parseFloat(calculatedBmi.toFixed(1)));

      if (calculatedBmi < 18.5) setCategory('Underweight');
      else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) setCategory('Normal Weight');
      else if (calculatedBmi >= 25 && calculatedBmi <= 29.9) setCategory('Overweight');
      else setCategory('Obese');
    }
  };

  return (
    <section className="py-24 bg-surface relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="glass-card max-w-4xl mx-auto p-8 md:p-12 border-primary/20 relative overflow-hidden">
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="text-primary w-8 h-8" />
                <h4 className="text-primary font-bold uppercase tracking-widest">Fitness Tools</h4>
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-6">
                Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">BMI</span>
              </h2>
              <p className="text-gray-400 mb-8">
                Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women. Calculate yours to determine your fitness starting point.
              </p>

              <form onSubmit={calculateBMI} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Height (cm)</label>
                    <input 
                      type="number" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 175"
                      className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 70"
                      className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-red-600 text-white font-bold uppercase tracking-wider py-4 rounded-lg transition-all shadow-[0_0_15px_rgba(255,0,60,0.3)]"
                >
                  Calculate Now
                </button>
              </form>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="bg-background/50 border border-white/5 rounded-2xl w-full h-full min-h-[300px] flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                  {bmi ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center w-full"
                    >
                      <h3 className="text-gray-400 font-bold uppercase tracking-widest mb-4">Your Result</h3>
                      <div className="inline-block relative">
                        <span className="text-7xl font-black text-white">{bmi}</span>
                        <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full -z-10"></div>
                      </div>
                      <div className="mt-6">
                        <span className="text-sm text-gray-400 mr-2">Category:</span>
                        <span className={`font-bold text-xl uppercase tracking-wider ${
                          category === 'Normal Weight' ? 'text-green-500' : 
                          category === 'Underweight' ? 'text-blue-400' : 
                          'text-secondary'
                        }`}>
                          {category}
                        </span>
                      </div>
                      
                      {/* Scale visualization */}
                      <div className="mt-8 relative w-full h-2 bg-gray-800 rounded-full overflow-hidden flex">
                        <div className="w-[20%] h-full bg-blue-400"></div>
                        <div className="w-[30%] h-full bg-green-500"></div>
                        <div className="w-[20%] h-full bg-yellow-500"></div>
                        <div className="w-[30%] h-full bg-red-500"></div>
                        
                        {/* Indicator */}
                        <div 
                          className="absolute top-0 bottom-0 w-1 bg-white" 
                          style={{ 
                            left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%`,
                            boxShadow: '0 0 10px white'
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500 uppercase mt-2 font-bold tracking-wider">
                        <span>Under</span>
                        <span>Normal</span>
                        <span>Over</span>
                        <span>Obese</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-gray-500"
                    >
                      <Calculator className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="uppercase tracking-widest font-bold text-sm">Enter your details to see results</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
